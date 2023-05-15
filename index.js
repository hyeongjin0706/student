import express from "express";
import cors from "cors";
import morgan from "morgan";
import {config} from "./config.js";
import {sequelize} from "./db/database.js";
import studentRouter from "./router/student.js";
import scoreRouter from "./router/score.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// /student 미들웨어 등록
app.use("/student", studentRouter);
// /score 미들웨어 등록
app.use("/score", scoreRouter);

app.use((req, res, next) => {
    res.sendStatus(404);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.sendStatus(500);
});

// db 서버가 실행되면 post listen
sequelize.sync().then(() => {
    const sever = app.listen(config.host.port);
});