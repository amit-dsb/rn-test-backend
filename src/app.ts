import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setInterface } from './utils/handleResponse';
dotenv.config({path: '.env'})
import UserRouter from './routes/auth.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

var corsOptions = {
    origin: function (origin: any, callback: any) {
        callback(null, true);
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(setInterface);

app.use('/api/v1/test', (req, res)=>{res.status(200).json({message: "working"})})
app.use('/api/v1/auth', UserRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

let PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server started on PORT: ${PORT}`)
});