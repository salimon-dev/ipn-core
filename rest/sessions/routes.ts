import { Router } from "express";
import AuthMidd from "../authMidd";
import search from "./search";
import requestSession from "./requestSession";
import updateStatus from "./updateStatus";
import destroy from "./destroy";

const routes = Router();

routes.post("/request", AuthMidd, requestSession);
routes.post("/update-status/:id", AuthMidd, updateStatus);
routes.post("/destroy/:id", AuthMidd, destroy);
routes.get("/", AuthMidd, search);

export default routes;
