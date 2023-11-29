import { Router } from "express";
import user from "./user";
import fee from "./fee";

const routes = Router();

routes.post("/user", user);
routes.get("/fee", fee);

export default routes;
