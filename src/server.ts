import express from "express";
import path from "node:path";

import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(router);

app.use("/image", express.static(path.join(__dirname, "..", "uploads")));

app.listen(3333, () =>
  console.log("Service listening on port http://localhost:3333")
);
