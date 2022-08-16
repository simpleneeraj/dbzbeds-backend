import "dotenv/config"
import cors from "cors";
import bedRoutes from "./routes/beds"
import express, { Express } from "express"
import databaseConnect from "./config/database";
const images = require("./routes/imageapi")

// INITIALIZING EXPREESS
const app: Express = express();
const port = process.env.PORT;

databaseConnect();

// MIDDLEWARES
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/image", images)


//ROUTES
app.get("/", (req, res) => {
    res.status(200).json({ name: 'Test Sucess' })
})
app.use("/beds", bedRoutes);



// PORT LISTEN
app.listen(port, () => {
    console.log((`Server Runnig http://localhost:${port}`))
})