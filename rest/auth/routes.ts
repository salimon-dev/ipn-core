import { Router } from "express";
import register from "./register";
import login from "./login";
import edit from "./edit";
import AuthMidd from "../authMidd";

const routes = Router();

routes.post("/register", register);
routes.post("/login", login);
routes.post("/profile", AuthMidd, edit);

export default routes;
