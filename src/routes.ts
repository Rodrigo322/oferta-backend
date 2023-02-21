import { Router } from "express";
import multer from "multer";

export const router = Router();

import uploadConfig from "./config/multer";
const upload = multer(uploadConfig);

import { createNivelAcesso } from "./controller/AccessController";
import { login } from "./controller/authController";
import { createLoja, getAllLoja } from "./controller/lojaController";
import {
  createProduto,
  deleteManyProdutos,
  getAllProdutos,
  getAllProdutosLoja,
  getUniqueProdutos,
} from "./controller/ProdutoController";
import {
  createUser,
  getUniqueUser,
  listUser,
  updateUser,
} from "./controller/UserController";
import {
  getAllVendasByUserId,
  realizarVenda,
} from "./controller/VendasController";
import { authMiddleware } from "./middlewares/auth";

router.post("/user", createUser);
router.post("/login", login);
router.post("/nivel", createNivelAcesso);

router.get("/users", authMiddleware(["adm"]), listUser);

router.post(
  "/update/user",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  updateUser
);

router.get(
  "/get/user",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  getUniqueUser
);
router.post("/create/loja", authMiddleware(["Vendedor", "adm"]), createLoja);

router.post(
  "/create/produto/loja/:lojaId",
  authMiddleware(["Vendedor", "adm"]),
  upload.single("image"),
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
router.post("/venda", authMiddleware(["Comprador", "adm"]), realizarVenda);
router.get(
  "/vendas/user",
  authMiddleware(["Comprador", "adm", "Vendedor"]),
  getAllVendasByUserId
);
router.post("/deletarTodosProdutos", deleteManyProdutos);
router.get("/produto/:produtoId", getUniqueProdutos);
