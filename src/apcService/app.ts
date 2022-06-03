import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import processRouter from './routers/v1/process';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('', processRouter);

export default app;
