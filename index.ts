import express, { NextFunction, Request, Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

import auth from "./rest/auth/routes";
import transactions from "./rest/transactions/routes";
import verify from "./rest/verify/routes";

import postTest from "./rest/post-test";
import preTest from "./rest/pre-test";

mongoose.connect(process.env["MONGO_URI"] || "").then(() => {
  console.log("connected to the db");
});

const app = express();
app.use(express.json());
app.use(cors());
const server = createServer(app);
const io = new Server(server);

app.use("/auth", auth);
app.use("/transactions", transactions);
app.use("/verify", verify);

app.post("/test/prepare", preTest);
app.post("/test/clean", postTest);
app.get("/", (req, res) => {
  res.send({
    name: "salimon official ipn",
  });
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});
const port = parseInt(process.env["PORT"] || "3000");
server.listen(port, () => {
  console.log("server running at port", port);
});
