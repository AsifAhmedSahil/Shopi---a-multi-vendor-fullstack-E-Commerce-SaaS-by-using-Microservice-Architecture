import express, { Router } from "express";
import { userRegistration } from "../controller/auth.controller";


const router:Router = express.Router()
// api written here

router.post("/user-registration",userRegistration)

export default router;