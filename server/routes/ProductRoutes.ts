import express from "express";
import { verifyadmin, verifyjsontoken } from "../utils/auth";
import { addproduct, delproduct, fetchlatestprods, fetchproductbycatidandsubcatid, fetchproductbyid, updateproduct, searchproducts, fetchprodbysubcatid } from "../controllers/ProductController";
import upload from "../utils/multerConfig";
const router = express.Router();


router.post("/addproduct", verifyjsontoken, verifyadmin, upload.fields([{ name: "picture", maxCount: 1 }, { name: "extraimages" }]), addproduct)

router.get("/fetchproductbycatidandsubcatid", verifyjsontoken, verifyadmin, fetchproductbycatidandsubcatid)
router.delete("/delproduct", verifyjsontoken, verifyadmin, delproduct)

router.put("/updateproduct", verifyjsontoken, verifyadmin, upload.fields([{ name: "pic", maxCount: 1 }, { name: "extraimages" }]), updateproduct)

router.get("/fetchlatestprods", fetchlatestprods)
router.get("/fetchproductbyid", fetchproductbyid)
router.get("/searchproducts", searchproducts)
router.get("/fetchprodbysubcatid", fetchprodbysubcatid)


export default router
