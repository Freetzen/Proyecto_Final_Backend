import Router from "express";
import passport from "passport";
import { roleVerification, passportError } from "../utils/errorMessages.js";

const routerPolicies = Router()

routerPolicies.get('/public', (req, res) => {
    res.send("Ruta pública")
})

routerPolicies.get('/authenticated', passportError('jwt'), (req, res) => {
    res.send(req.user)
})

routerPolicies.get('/premium', passportError('jwt'), roleVerification(["admin", "premiumuser"]), (req, res) => {
    res.send(req.user)
})

export default routerPolicies