import { ManagerMongoDB } from "../db/mongoDBManager.js";
import { Schema } from "mongoose";
import {ManagerProductsMongoDB} from "./Product.js";

const cartSchema = new Schema({
    products: {
        type: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }],
        default: []
    }
})

export class ManagerCartMongoDB extends ManagerMongoDB {
    constructor() {
        super(process.env.URLMONGODB, "carts", cartSchema)
        this.productModel = ManagerProductsMongoDB.model
    }

    async changeQuantity(cartID, productID, newQuantity) {
        await super._setConnection()
        try {
            // Get cart
            const cart = await this.model.findById(cartID)

            // Check product existance and get its index
            const productIndex = cart.products.findIndex(product => product.productId.equals(productID))
            if (productIndex === -1) throw new Error("Product not found in the specified cart")

            // Update/change product quantity
            cart.products[productIndex].quantity = newQuantity

            // Save updated doc
            await cart.save()

            return cart.products[productIndex]
        } catch (error) {
            return error
        }
    }

    async removeProduct(cartID, productID) {
        await super._setConnection()

        // Get cart
        const cart = await this.model.findById(cartID)

        // Check product existance and get its index
        const productIndex = cart.products.findIndex(product => product.productId.equals(productID))
        if (productIndex === -1) throw new Error("Product not found in the specified cart")

        // Remove specified product
        cart.products.splice(productIndex, 1)

        // Save updated doc
        await cart.save()

        return cart
    }

    async addProduct(cartID, productID, quantity) {
        super._setConnection()
        try {
            // Get the cart
            const cart = await this.model.findById(cartID)

            // Check if the product is already into the cart
            const productIndex = cart.products.findIndex(product => product.productId.equals(productID))
            productIndex === -1
                ? cart.products.push({ productId: productID, quantity: quantity }) // Add new product
                : cart.products[productIndex].quantity += quantity // Increase product quantity

            await cart.save()

            return cart
        } catch (error) {
            return error
        }
    }

    async replaceAllProducts(cartID, productsToAdd) {
        super._setConnection()
        try {
            const cart = await this.model.findById(cartID)
            cart.products = productsToAdd
            await cart.save()
            return cart
        } catch (error) {
            return error
        }
    }

    async emptyCart(cartID) {
        super._setConnection()
        try {
            const cart = await this.model.findById(cartID)
            cart.products = []
            await cart.save()
            return cart
        } catch (error) {
            return error
        }
    }

}