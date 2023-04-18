import { Router } from 'express'
import { getManagerProducts } from '../dao/daoManager.js';
import { messageManager } from '../controllers/message.controller.js';
import { productManager } from '../controllers/product.controller.js';

const routerSocket = Router()

// const prodManagerData = await getManagerProducts()
// const prodManager = new prodManagerData.ManagerProductsMongoDB
// const msgManagerData = await getManagerMessages()
// const msgManager = new msgManagerData()

routerSocket.get('/', async (req, res) => {
    let { limit } = req.query;

    let products
    !limit
        ? products = await productManager.getElements(0)
        : products = await productManager.getElements(limit)
    res.render("home", { products })

    // const products = await manager.getProducts();
    // let { limit } = req.query;
    // let data;
    // if (!limit) {
    //     data = products;
    // } else {
    //     data = products.slice(0, parseInt(limit));
    // }
    // res.render("home", { data });
})

routerSocket.get("/realtimeproducts", async (req, res) => {

    try {

        const products = await productManager.getElements(0)
        console.log(products)
        res.render("realTimeProducts", { products: products })
    } catch (error) {
        console.log(error)
    }


    // const products = await manager.getProducts()

    // res.render("realTimeProducts", {
    //     products: products
    // })
})

routerSocket.get("/chat", async (req, res) => {
    const messages = await messageManager.getElements(0)
    res.render("chat", { messages: messages })
})

export default routerSocket