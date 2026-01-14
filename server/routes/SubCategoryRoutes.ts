import express from "express";
const router = express.Router();

import { addsubcategory, delsubcat, fetchsubcatbycatid, updatesubcategory } from "../controllers/SubCategoryController";
import { verifyadmin, verifyjsontoken } from "../utils/auth";
import upload from "../utils/multerConfig";

router.post("/addsubcategory", verifyjsontoken, verifyadmin, upload.single('picture'), addsubcategory)
router.get("/fetchsubcatbycatid", fetchsubcatbycatid)
router.delete("/delsubcat", verifyjsontoken, verifyadmin, delsubcat)
router.put("/updatesubcategory", verifyjsontoken, verifyadmin, upload.single('upsubpic'), updatesubcategory)

export default router
