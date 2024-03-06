import express from "express";
import register from "../controllers/auth";
import login from "../controllers/login";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
export default router;
