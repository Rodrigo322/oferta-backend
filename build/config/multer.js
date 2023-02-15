"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.default = {
    storage: multer_1.default.diskStorage({
        destination: path_1.default.join(__dirname, "..", "..", "uploads"),
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
    limits: {
        fileSize: 8 * 1024 * 1024, // 8MB
    },
    fileFilter: (req, file, cb) => {
        const mimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!mimeTypes.includes(file.mimetype)) {
            return cb(null, false);
        }
        cb(null, true);
    },
};
