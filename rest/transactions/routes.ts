import { Router } from "express";
import AuthMidd from "../authMidd";
import send from "./send";
import receive from "./receive";
import check from "./check";
import execute from "./execute";
import search from "./search";

const routes = Router();

routes.post("/send", AuthMidd, send);
routes.post("/receive", AuthMidd, receive);
routes.post("/check", AuthMidd, check);
routes.post("/execute", AuthMidd, execute);
routes.post("/search", AuthMidd, search);

export default routes;
