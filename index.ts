import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.send({
    name: "salimon official ipn",
  });
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});

server.listen(parseInt(process.env["PORT"] || "3000"), () => {
  console.log("server running at http://localhost:3000");
});
