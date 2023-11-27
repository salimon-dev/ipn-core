import { Router } from "express";
import AuthMidd from "../authMidd";
import search from "./search";
import create from "./create";
import edit from "./edit";
import remove from "./remove";

const routes = Router();

routes.post("/", AuthMidd, create);
routes.post("/:id", AuthMidd, edit);
routes.delete("/:id", AuthMidd, remove);
routes.get("/", AuthMidd, search);

export default routes;
