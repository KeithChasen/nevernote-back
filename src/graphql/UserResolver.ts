import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware
} from "type-graphql";
import { User } from "../entity/User";
import { compare, hash } from "bcryptjs";
import {
    generateAccessToken,
    generateRefreshToken,
    sendRefreshToken
} from "../helpers/generateToken";
import { Request, Response } from "express";
import { CONST } from "../constants/strings";
import { AppDataSource } from "../data-source";
import { isAuth } from "../helpers/isAuth";

export interface MyContext {
    res: Response,
    req: Request
    tokenPayload?: {
        userId: string,
        tokenVersion?: number
    }
}

@ObjectType()
class LoginResponse {
    @Field(() => String)
    access_token: string
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "Hello there";
    }

    @Query(() => User)
    @UseMiddleware(isAuth)
    async me(@Ctx() ctx: MyContext) {
        const payload = ctx.tokenPayload;
        if (!payload) return null;
        try {
            return await User.findOne({
                where: { id: payload.userId },
                relations: { notes: true }
            });
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    @Mutation(() => Boolean)
    async signup(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        try {
            const findUser = await User.findOne({ where: { email } });
            if (findUser)
                throw new Error('User with this email is already exists');

            await User.insert({
                email,
                password: await hash(password, 12),
                username: email.split('@')[0]
            });
            return true;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: MyContext
    ) {
        try {
            const findUser = await User.findOne({ where: { email } });
            if (!findUser)
                throw new Error('User with this email doesn\'t exist');

            const isPasswordValid = await compare(password, findUser.password);
            if (!isPasswordValid)
                throw new Error('Password is invalid');

            const accessToken = generateAccessToken(findUser);
            const refreshToken = generateRefreshToken(findUser);

            res.cookie(CONST.JWT_COOKIE, refreshToken, {
                httpOnly: true
            })

            sendRefreshToken(res, refreshToken);

            return {
                access_token: accessToken
            };
        } catch (error: any) {
            throw new Error(error);
        }
    }

    @Mutation(() => Boolean)
    async revokeUserSession(@Arg('userId') userId: string) {
        await AppDataSource
            .getRepository(User)
            .increment({ id: userId! }, 'token_version', 1);
        return true;
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: MyContext) {
        ctx.res.clearCookie(CONST.JWT_COOKIE);
        return true;
    }
}
