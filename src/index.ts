import { AppDataSource } from "./data-source";
import express from 'express';
import { CONST } from "./constants/strings";
import cors from 'cors';
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/UserResolver";
import { MyContext } from "./graphql/UserResolver";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import {
    generateAccessToken,
    generateRefreshToken,
    sendRefreshToken
} from "./helpers/generateToken";
import cookieParser from 'cookie-parser';

AppDataSource.initialize().then(async () => {
    const app = express();

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    app.use(morgan('dev'));
    app.use(cookieParser());

    app.get('/', (req, res) => {
        res.send('hello')
    });

    app.post("/refresh-token", async (req, res) => {
        const token = req.cookies[CONST.JWT_COOKIE];
        if (!token) return res.send({ success: false, access_token: '' });

        let data: any = null;
        try {
            data = verify(token, CONST.REFRESH_TOKEN_SECRET);
        } catch (e) {
            console.error(e);
            return res.send({ success: false, access_token: '' });
        }

        const user = await User.findOne(data.userId);
        if (!user)
            return res.send({ success: false, access_token: '' });

        if (user.token_version !== data.tokenVersion) {
            return res.send({ success: false, access_token: '' });
        }
        
        const access_token = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        sendRefreshToken(res, refreshToken);
        return res.send({ success: true, access_token });
    });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({ req, res }): MyContext => ({ req, res})
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(CONST.PORT, () =>
        console.log(`server running http://localhost:${CONST.PORT}/graphql`)
    )
}).catch(error => console.log(error))
