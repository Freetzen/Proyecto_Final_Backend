import mongoose from "mongoose";

export class ManagerMongoDB {
    #url

    constructor(url, collection, schema) {
        this.#url = url
        this.collection = collection
        this.schema = schema
        this.model = mongoose.model(this.collection, this.schema)
    }

    async _setConnection() {
        try {
            await mongoose.connect(this.#url)
            console.log("Connected to MongoDB")
        } catch (error) {
            throw error
        }
    }

    async addElements(elements) {
        this._setConnection()
        try {
            return await this.model.insertMany(elements)
        } catch (error) {
            throw error
        }
    }

    async getElements(limit) {
        this._setConnection()
        try {
            return await this.model.find().limit(limit)
        } catch (error) {
            throw error
        }
    }

    async getElementById(id) {
        this._setConnection()
        try {
            return await this.model.findById(id)
        } catch (error) {
            throw error
        }
    }

    async updateElement(id, info) {
        this._setConnection()
        try {
            return await this.model.findByIdAndUpdate(id, info)
        } catch (error) {
            throw error
        }
    }

    async deleteElement(id) {
        this._setConnection()
        try {
            return await this.model.findByIdAndDelete(id)
        } catch (error) {
            throw error
        }
    }

    async aggregate(stages) {
        this._setConnection()
        try {
            return await this.model.aggregate(stages)
        } catch (error) {
            throw error
        }
    }


}