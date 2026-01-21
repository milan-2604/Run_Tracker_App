import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from 'cors';
import ConnectDB from "./config/db";
import authRoutes from './routes/authRoutes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  res.send("its working");
});

app.use('/api/auth',authRoutes);



const startApp = async (): Promise<void> => {
  try {
    await ConnectDB();
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("unable to connect server", error);
    process.exit(1);
  }
};

startApp();
