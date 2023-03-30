import { Router } from "express";
import { destroySession, checkLogin, getSession } from "../controllers/session.controller.js";

const routerSession = Router()

routerSession.post('/login', checkLogin)
routerSession.get('/logout', destroySession)

export default routerSession