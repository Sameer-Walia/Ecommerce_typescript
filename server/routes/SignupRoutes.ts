import express from "express";
const router = express.Router();

import { activateuseraccount, changepassword, ContactUs, deluser, fetchoneuser, getallusers, google_login, login, logout, resendmail, searchuser, signup, updateoneuser } from "../controllers/SignupController";
import { verifyadmin, verifyjsontoken } from "../utils/auth";

router.post("/signup", signup)
router.post("/resendmail", resendmail)
router.put("/activateuseraccount", activateuseraccount)
router.post("/login", login)
router.post("/google-login", google_login)
router.post("/logout", logout)
router.put("/changepassword", verifyjsontoken, changepassword)
router.get("/getallusers", verifyjsontoken, verifyadmin, getallusers)
router.get("/fetchoneuser/:id", verifyjsontoken, verifyadmin, fetchoneuser)
router.put("/updateoneuser", verifyjsontoken, verifyadmin, updateoneuser)
router.delete("/deluser/:uid", verifyjsontoken, verifyadmin, deluser)
router.get("/searchuser", verifyjsontoken, verifyadmin, searchuser)
router.post("/ContactUs", ContactUs)



export default router;
