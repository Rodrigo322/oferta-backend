import express from "express";

const app = express();

import { createNivelAcesso, createUser } from "./controller/UserController";

app.use(express.json());

app.post("/user", createUser);
app.post("/nivel", createNivelAcesso);

app.listen(3333, () =>
  console.log("Service listening on port http://localhost:3333")
);
