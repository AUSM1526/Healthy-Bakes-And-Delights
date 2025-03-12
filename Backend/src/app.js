import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser());

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true,limit: "16kb"}));
app.use(express.static("public"));

//routes import
import userRouter from "./routes/user.route.js"
import addressRouter from "./routes/address.route.js";

//routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/address", addressRouter);

export default app;