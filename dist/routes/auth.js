"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth"));
const login_1 = __importDefault(require("../controllers/login"));
const router = express_1.default.Router();
router.post("/register", auth_1.default);
router.post("/login", login_1.default);
exports.default = router;
//# sourceMappingURL=auth.js.map