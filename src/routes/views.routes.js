import { Router } from "express";
import { requireAuth, tryLogin  } from "../controllers/session.controller.js";
import { renderProducts, viewCarts, viewLogin, viewRegister } from "../controllers/view.controller.js";

const routerViews = Router()

routerViews.get('/', requireAuth, viewLogin)

routerViews.get('/login', viewLogin)

routerViews.get('/register', viewRegister)

routerViews.get('/products', requireAuth, renderProducts)

routerViews.get('/carts/:cid', requireAuth, viewCarts)

export default routerViews