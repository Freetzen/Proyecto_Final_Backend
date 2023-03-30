import { Router } from 'express'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.controller.js'

const routerProduct = Router()

routerProduct.get('/', getProducts);
routerProduct.get("/:pid", getProduct);
routerProduct.post('/', createProduct)
routerProduct.put('/:pid', updateProduct)
routerProduct.delete('/:pid', deleteProduct)

export default routerProduct