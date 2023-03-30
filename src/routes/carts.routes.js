import { Router } from 'express'
import { addProduct, changeProductQuantity, clearCart, createCart, getCart, overwriteCart, removeProduct } from '../controllers/cart.controller.js'

const routerCart = Router()

routerCart.get('/:cid', getCart)
routerCart.post('/', createCart)
routerCart.post('/:cid/product/:pid', addProduct)
routerCart.put('/:cid', overwriteCart)
routerCart.put('/:cid/product/:pid', changeProductQuantity)
routerCart.delete('/:cid/product/:pid', removeProduct)
routerCart.delete('/:cid', clearCart)

export default routerCart