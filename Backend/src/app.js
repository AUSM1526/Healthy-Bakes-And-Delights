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
import productTypeRouter from "./routes/productType.route.js";
import subCategoryRouter from "./routes/subCategory.route.js";
import productRouter from "./routes/product.route.js";

//routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/productType", productTypeRouter);
app.use("/api/v1/subCategory", subCategoryRouter);
app.use("/api/v1/product", productRouter);

export default app;