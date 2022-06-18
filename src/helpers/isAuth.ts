import { verify } from "jsonwebtoken";
import { CONST } from "../constants/strings";
import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { MyContext } from "../graphql/UserResolver";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    try {
        const bearer = context.req.headers['authorization'];
        const token  = bearer!.split(' ')[1];
        if (!token) throw new Error('Not authenticated');

        const tokenPayload = verify(token, CONST.ACCESS_TOKEN_SECRET);
        if (!tokenPayload) throw new Error('Not authenticated');

        context.tokenPayload = tokenPayload as any;
    } catch (e) {
        throw new Error('Not authenticated');
    }
    return next();
}
