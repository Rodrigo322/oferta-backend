import { Router } from "express";

export const router = Router();

import { createNivelAcesso } from "./controller/AccessController";
import { createLoja, createProduto } from "./controller/lojaController";
import { createUser, listUser } from "./controller/UserController";
import { realizarVenda } from "./controller/VendasController";
import { checkAccess } from "./middlewares/checkAccess";

router.post("/user", createUser);
router.post("/nivel", createNivelAcesso);
router.get("/users/:id", checkAccess("Comprador"), listUser);
router.post("/create/loja/user/:id", checkAccess("Vendedor"), createLoja);
router.post(
  "/create/produto/loja/:lojaId/user/:id",
  checkAccess("Vendedor"),
  createProduto
);
router.post("/venda/user/:id", checkAccess("Comprador"), realizarVenda);
