import { AppDataSource } from "./data-source";
import express from 'express';
import { CONST } from "./constants/strings";
import cors from 'cors';
import morgan from "morgan";
import { ApolloServer, gql } from "apollo-server-express";

AppDataSource.initialize().then(async () => {
    const app = express();

    app.use(cors());
    app.use(morgan('dev'));

    app.get('/', (req, res) => {
        res.send('hello')
    });

    const apolloServer = new ApolloServer({
        typeDefs: gql`
          type Query {
              hello: String!
          }
        `,
        resolvers: {
            Query: {
                hello: () => "Hello there"
            }
        }
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    app.listen(CONST.PORT, () =>
        console.log(`server running http://localhost:${CONST.PORT}/graphql`)
    )
}).catch(error => console.log(error))
