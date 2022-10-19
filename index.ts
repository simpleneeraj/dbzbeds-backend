import "dotenv/config";
import cors from "cors";
import bedRoutes from "./routes/beds";
import iconRoutes from "./routes/icons";
import express, { Express } from "express";
import databaseConnect from "./config/database";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import paymentRoutes from "./routes/payment";
import userRoutes from "./routes/user";
import orderRoutes from "./routes/order";

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
        origin: process.env.ALLOWED_DOMAINS?.split(" "),
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

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/icons", iconRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);

// PORT LISTEN
app.listen(port, () => {
    console.log(`Server Runnig http://localhost:${port}`);
});
