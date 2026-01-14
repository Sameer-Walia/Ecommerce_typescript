import express from "express";
import { checktoken, forgotpassword, resetpassword } from "../controllers/ResetPasswordController";
const router = express.Router();

router.get("/forgotpassword", forgotpassword)
router.get("/checktoken", checktoken)
router.put("/resetpassword", resetpassword)

export default router
