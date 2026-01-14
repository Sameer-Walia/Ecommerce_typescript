import express from "express";
import { addtocart, delproduct, getcart } from "../controllers/CartController";
const router = express.Router();

router.post("/addtocart", addtocart)
router.get("/getcart", getcart)
router.delete("/delproduct/:id", delproduct)



export default router
