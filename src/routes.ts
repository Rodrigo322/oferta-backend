import { Router } from "express";

export const router = Router();

import { createNivelAcesso } from "./controller/AccessController";
import { login } from "./controller/authController";
import { createLoja, createProduto } from "./controller/lojaController";
import { createUser, listUser } from "./controller/UserController";
import { realizarVenda } from "./controller/VendasController";
import { authMiddleware } from "./middlewares/auth";
import { checkAccess } from "./middlewares/checkAccess";

router.post("/user", createUser);
router.post("/login", login);
router.post("/nivel", createNivelAcesso);

router.get("/users/:id", checkAccess("Comprador"), listUser);

router.post("/create/loja", authMiddleware(["Vendedor"]), createLoja);

router.post(
  "/create/produto/loja/:lojaId",
  authMiddleware(["Vendedor"]),
  createProduto
);

router.post("/venda", authMiddleware(["Comprador"]), realizarVenda);
