import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";
import passport from "passport";

const routerUser = Router()

//Ruta -Middleware - Controller
routerUser.post('/register', passport.authenticate('register'), createUser)

export default routerUser