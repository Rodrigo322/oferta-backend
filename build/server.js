"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(routes_1.router);
app.use("/image", express_1.default.static(node_path_1.default.join(__dirname, "..", "uploads")));
app.listen(3333, () => console.log("Service listening on port http://localhost:3333"));
