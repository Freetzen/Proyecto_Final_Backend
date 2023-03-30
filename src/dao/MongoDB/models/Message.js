import { ManagerMongoDB } from "../db/mongoDBManager.js";
import { Schema } from "mongoose";

const messageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

class ManagerMessageMongoDB extends ManagerMongoDB {
    constructor() {
        super(process.env.URLMONGODB, "messages", messageSchema)
    }
}


export default ManagerMessageMongoDB