import { Router } from "express";

export const router = Router();

import { createNivelAcesso } from "./controller/AccessController";
import { login } from "./controller/authController";
import { createLoja, getAllLoja } from "./controller/lojaController";
import {
  createProduto,
  getAllProdutos,
  getAllProdutosLoja,
} from "./controller/ProdutoController";
import { createUser, listUser } from "./controller/UserController";
import { realizarVenda } from "./controller/VendasController";
import { authMiddleware } from "./middlewares/auth";

router.post("/user", createUser);
router.post("/login", login);
router.post("/nivel", authMiddleware(["adm"]), createNivelAcesso);

router.get("/users", authMiddleware(["adm"]), listUser);

router.post("/create/loja", authMiddleware(["Vendedor", "adm"]), createLoja);

router.post(
  "/create/produto/loja/:lojaId",
  authMiddleware(["Vendedor", "adm"]),
  createProduto
);

router.get(
  "/produtos",
  authMiddleware(["Vendedor", "adm", "Comprador"]),
  getAllProdutos
);

router.get(
  "/produtos/:lojaId",
  authMiddleware(["Vendedor", "adm", "Comprador"]),
  getAllProdutosLoja
);

router.get(
  "/loja",
  authMiddleware(["Vendedor", "adm", "Comprador"]),
  getAllLoja
);

router.post("/venda", authMiddleware(["Comprador", "adm"]), realizarVenda);
