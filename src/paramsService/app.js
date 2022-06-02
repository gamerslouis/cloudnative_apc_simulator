import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import factorRouter from './routers/v1/factor';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('', factorRouter);

export default app;
