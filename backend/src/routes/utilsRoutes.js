// src/routes/utilsRoutes.js
import { Router } from "express";
import { getCepInfo } from "../controllers/utilsController.js";

const router = Router();

router.get("/cep/:cep", getCepInfo);

export default router;
