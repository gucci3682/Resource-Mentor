import express from 'express';
import { AppController } from './src/routers/app.controller';
import { ApiError } from './src/common';
import { StatusCodes } from 'http-status-codes';


export const app = express();
const port = process.env.PORT || 5000; // React is defaulted to 3000, so we will use 5000

app.get('/api', (req, res) => {
    res.send("Test message");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const appController = new AppController(app);
appController.registerControllers();