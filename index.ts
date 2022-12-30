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
import bedsRoutes from "./routes/fileroutes";
import headboardRoutes from "./routes/headboard";
import buildYourBedRoutes from "./routes/build-your-bed";
import reviewsRoutes from "./routes/reviews";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { getOrderByIdService } from "./services/order-services";
import {
  getActiveUserBySocketId,
  createActiveUser,
  findActiveUserByOrderId,
  updateUserOrderIdBySocketId,
  reomveOrderIdBySocketId,
  removeActiveUser,
} from "./services/socket-services";
import buildYourBedColorVariants from "./models/buildYourBedColorVariants";

// INITIALIZING EXPREESS
// INITIALIZING EXPREESS
const app: Express = express();
const server = createServer(app);
const port = process.env.PORT;
databaseConnect();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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
  res.status(200).json({ name: "Hello World! 2" });
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/beds", bedRoutes);
app.use("/api/icons", iconRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/headboard", headboardRoutes);
app.use("/api/build-your-bed", buildYourBedRoutes);

app.use("/api/bedsMultiple", bedsRoutes);

// PORT LISTEN
server.listen(port, () => {
  console.log(`Server Runnig http://localhost:${port}`);
});

const activeUsers: IActiveUser[] = [];

io.on("connection", (socket: Socket) => {
  socket.once("active", async () => {
    const findActiveUser = await getActiveUserBySocketId(
      activeUsers,
      socket.id
    );
    if (findActiveUser) return;
    await createActiveUser(activeUsers, {
      socketId: socket.id,
    });
  });

  socket.on("test", async () => {
    const findActiveUser = await getActiveUserBySocketId(
      activeUsers,
      socket.id
    );
    io.emit("test", findActiveUser);
  });

  socket.on("active-order", async (orderId) => {
    if (!orderId) return;

    const findAlreadyActiveUser = await findActiveUserByOrderId(
      activeUsers,
      orderId
    );

    if (!findAlreadyActiveUser) {
      await updateUserOrderIdBySocketId(activeUsers, socket.id, orderId);
    }

    socket.emit("is-order-accessible", {
      access: findAlreadyActiveUser ? false : true,
    });
  });

  socket.on("inactive-order", async (orderId) => {
    if (!orderId) return;
    reomveOrderIdBySocketId(activeUsers, socket.id);
  });

  socket.on("order", async (orderId) => {
    if (!orderId) return;

    const order = await getOrderByIdService(orderId);

    if (!order) {
      await updateUserOrderIdBySocketId(activeUsers, socket.id, orderId);
    }

    socket.emit("order", {
      order,
    });
  });

  socket.on("disconnect", () => {
    removeActiveUser(activeUsers, socket.id);
  });
});

app.get("/active", async (req, res) => {
  res.status(200).json({ activeUsers });
});
