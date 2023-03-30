import { ManagerMongoDB } from "../db/mongoDBManager.js";
import { Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: Array,
        default: []
    }
})

productSchema.plugin(mongoosePaginate)

export class ManagerProductsMongoDB extends ManagerMongoDB {
    constructor() {
        super(process.env.URLMONGODB, "products", productSchema)
    }

    async paginate(filter, options) {
        super._setConnection()
        try {
            return await this.model.paginate(filter, options)
        } catch (error) {
            return error
        }
    }
}