import { AppDataSource } from "./data-source";
import express from 'express';
import { CONST } from "./constants/strings";

AppDataSource.initialize().then(async () => {
    const app = express();

    app.get('/', (req, res) => {
        res.send('hello')
    })

    app.listen(CONST.PORT, () =>
        console.log(`server running http://localhost:${CONST.PORT}`)
    )
}).catch(error => console.log(error))
