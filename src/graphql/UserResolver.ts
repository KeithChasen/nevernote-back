import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entity/User";
import { hash } from "bcryptjs";

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "Hello there";
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
}