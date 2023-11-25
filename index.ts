import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

import auth from "./rest/auth/routes";
import transactions from "./rest/transactions/routes";
import testClean from "./rest/test-clean";

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

app.post("/test/clean", testClean);
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
