import express from "express";
const router = express.Router();

import { delcat, getallcat, savecategory, updatecategory } from "../controllers/CategoryController";
import { verifyadmin, verifyjsontoken } from "../utils/auth";
import upload from "../utils/multerConfig";

router.post("/savecategory", verifyjsontoken, verifyadmin, upload.single('cpic'), savecategory)
router.get("/getallcat", getallcat)
router.delete("/delcat", verifyjsontoken, verifyadmin, delcat)
router.put("/updatecategory", verifyjsontoken, verifyadmin, upload.single('uppic'), updatecategory)



export default router