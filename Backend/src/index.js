import dotenv from "dotenv"
import connectDB from "./db/db.js";
import app from "./app.js"

dotenv.config({
    path: "./env"
})

connectDB()
.then( () => {
    console.log("Connected to database");

    app.on("Error: ", (error) => {
        console.log("Express server error: ",error);
        throw error;
    })

    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is running at Port: ${process.env.PORT}`);
    })
} )
.catch((error)=>{
    console.log("DB Connection Error",error);
});