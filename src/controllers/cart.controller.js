import { getManagerCarts } from "../dao/daoManager.js";

const managerData = await getManagerCarts()
const manager = new managerData.ManagerCartMongoDB;

export const getCart = async (req, res) => {
    try {
        const cart = await manager.getElementById(req.params.cid)
        const popCart = await cart.populate({ path: 'products.productId', model: manager.productModel })

        res.send({
            status: "success",
            payload: popCart
        })
    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })
    }
}

export const createCart = async (req, res) => {
    try {
        const newCart = {}
        const data = await manager.addElements(newCart)

        res.send({
            status: "success",
            payload: data
        })
        console.log(data)
    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })
        console.log(error)
    }
}

export const addProduct = async (req, res) => {
    try {
        const data = await manager.addProduct(req.params.cid, req.params.pid, 1)

        res.send({
            status: "success",
            payload: data
        })

    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })
    }
}

export const overwriteCart = async (req, res) => {
    try {
        const productsToAdd = req.body

        const response = await manager.replaceAllProducts(req.params.cid, productsToAdd)

        res.send({
            status: "success",
            payload: response
        })
    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })
    }
}

export const changeProductQuantity = async (req, res) => {
    try {
        const { quantity } = req.body
        const newQuantity = parseInt(quantity)

        const updatedProduct = await manager.changeQuantity(req.params.cid, req.params.pid, newQuantity)

        res.send({
            status: "success",
            payload: updatedProduct
        })

    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })
    }
}

export const removeProduct = async (req, res) => {
    try {
        const cart = await manager.removeProduct(req.params.cid, req.params.pid)

        res.send({
            status: "success",
            payload: cart
        })
    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })

    }
}

export const clearCart = async (req, res) => {
    try {
        const cart = await manager.emptyCart(req.params.cid)
        res.send({
            status: "success",
            payload: cart
        })
    } catch (error) {
        res.send({
            status: "error",
            payload: error.message
        })
    }
}