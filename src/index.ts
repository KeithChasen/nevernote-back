import { AppDataSource } from "./data-source";

AppDataSource.initialize().then(async () => {
    console.log('App running');
}).catch(error => console.log(error))
