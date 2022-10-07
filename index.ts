import "dotenv/config";
import cors from "cors";
import bedRoutes from "./routes/beds";
import iconRoutes from "./routes/icons";
import express, { Express } from "express";
import databaseConnect from "./config/database";
import upload from "./config/multer";
import { uploadBedImage } from "./controllers";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";

// INITIALIZING EXPREESS
const app: Express = express();
const port = process.env.PORT;

databaseConnect();

// MIDDLEWARES
app.disable("x-powered-by");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200,
    })
);

//IMAGE ROUTE

app.use("/api/beds-image", express.static("dist/uploads/beds"));
app.use("/api/icons-image", express.static("dist/uploads/icons"));

//ROUTES
app.get("/api", (req, res) => {
    res.status(200).json({ name: "Hello World!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/icons", iconRoutes);

// PORT LISTEN
app.listen(port, () => {
    console.log(`Server Runnig http://localhost:${port}`);
});
