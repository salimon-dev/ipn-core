import { Router } from "express";
import register from "./register";
import login from "./login";
import editProfile from "./editProfile";
import AuthMidd from "../authMidd";
import errorHandler from "../errorHandler";
import exchange from "./exchange";
import getProfile from "./getProfile";

const routes = Router();

routes.post("/register", (req, res) => errorHandler(req, res, register));
routes.post("/login", (req, res) => errorHandler(req, res, login));
routes.post("/profile", AuthMidd, (req, res) => errorHandler(req, res, editProfile));
routes.get("/profile", AuthMidd, (req, res) => errorHandler(req, res, getProfile));
routes.post("/exchange", AuthMidd, (req, res) => errorHandler(req, res, exchange));

export default routes;
