import "dotenv/config";
import cors from "cors";
import bedRoutes from "./routes/beds";
import express, { Express } from "express";
import databaseConnect from "./config/database";
import upload from "./config/multer";
import { uploadBedImage } from "./controller";

// INITIALIZING EXPREESS
const app: Express = express();
const port = process.env.PORT;

databaseConnect();

// MIDDLEWARES
// app.disable("x-powered-by");
app.use(express.json());
app.use(
  express.urlencoded({ parameterLimit: 100000, limit: "50mb", extended: false })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

// app.use("/image", images)

//IMAGE ROUTE
app.use("/beds-image", express.static("dist/uploads/beds"));

//ROUTES
app.get("/", (req, res) => {
  res.status(200).json({ name: "Test Sucess" });
});

app.use("/beds", bedRoutes);

app.post("/test", (req, res) => {
  res.status(200).json({ name: req.body });
});

// PORT LISTEN
app.listen(port, () => {
  console.log(`Server Runnig http://localhost:${port}`);
});
