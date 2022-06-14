import { AppDataSource } from "./data-source";
import express from 'express';

AppDataSource.initialize().then(async () => {
    const app = express();

    app.get('/', (req, res) => {
        res.send('hello')
    })

    app.listen(4000, () =>
        console.log('server running http://localhost:4000')
    )
}).catch(error => console.log(error))
