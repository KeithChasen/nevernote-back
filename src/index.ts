import { AppDataSource } from "./data-source";
import express from 'express';
import { CONST } from "./constants/strings";
import cors from 'cors';
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/UserResolver";
import { MyContext } from "./graphql/UserResolver";

AppDataSource.initialize().then(async () => {
    const app = express();

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    app.use(morgan('dev'));

    app.get('/', (req, res) => {
        res.send('hello')
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
