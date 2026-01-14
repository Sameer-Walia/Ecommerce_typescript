import express from "express";
import { deletecart, delorder, getallordersbydate, getorderid, getorderproducts, getuserorders, saveorder, SearchOrderId, updatestatus, updatestock } from "../controllers/OrderController";
const router = express.Router();

router.post("/saveorder", saveorder)
router.put("/updatestock", updatestock)
router.delete("/deletecart", deletecart)
router.get("/getorderid", getorderid)
router.get("/getallordersbydate", getallordersbydate)
router.get("/delorder/:id", delorder)
router.put("/updatestatus", updatestatus)
router.get("/SearchOrderId", SearchOrderId)
router.get("/getuserorders", getuserorders)
router.get("/getorderproducts", getorderproducts)
router.get("/getuserorders", getuserorders)


export default router
