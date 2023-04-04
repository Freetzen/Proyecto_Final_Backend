import { Router } from "express";
import passport from "passport";
import { destroySession, tryLogin} from "../controllers/session.controller.js";

const routerSession = Router()

routerSession.post("/login", tryLogin);

routerSession.get("/logout", destroySession);

routerSession.get("/testJWT", passport.authenticate("jwt", { session: false },
    (req, res) => {
        res.send({ message: "tokenJWT" });
    })
);

export default routerSession