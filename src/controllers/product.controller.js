import { getManagerProducts } from "../dao/daoManager.js";

const managerProductsData  = await getManagerProducts()
export const productManager  = new managerProductsData.ManagerProductsMongoDB;

export const getProducts = async (req, res) => {
    let { limit = 10, page = 1, category = undefined, stock = undefined, sort = undefined } = req.query;

    try {
        if (isNaN(page)) throw new Error("Parameter 'page' must be type: number")

        // Paginación y filtros
        let filter = {}
        if (category) filter.category = category
        if (stock) filter.stock = { $gt: stock - 1 }

        const options = {
            page,
            limit,
            sort: sort && Object.keys(sort).length ? sort : undefined
        };

        if (sort != undefined) {
            if (sort != "ASC" && sort != "DESC") {
                throw new Error("Invalid sorting parameter")
            } else {
                sort == "ASC" ? options.sort = "price" : options.sort = "-price"
            }
        }

        const products = await productManager.paginate(filter, options)

        if ((page > products.totalPages) || (page <= 0)) throw new Error("Parameter 'page' is out of range")

        //Prev and next (Pages)
        const categoryLink = category ? `&category=${category}` : ""
        const stockLink = stock ? `&stock=${stock}` : ""
        const limitLink = limit ? `&limit=${limit}` : ""
        const sortLink = sort ? `&sort=${sort}` : ""
        const prevPageLink = products.hasPrevPage ? `/api/products?page=${products.prevPage}${limitLink}${categoryLink}${stockLink}${sortLink}` : null
        const nextPageLink = products.hasNextPage ? `/api/products?page=${products.nextPage}${limitLink}${categoryLink}${stockLink}${sortLink}` : null

        res.status(200).send({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: prevPageLink,
            nextLink: nextPageLink

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
}

export const getProduct = async (req, res) => {
    try {
        const product = await productManager.getElementById(req.params.pid)
        res.status(200).send({
            status: "success",
            payload: product
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            payload: error.message
        })
    }
}

export const createProduct = async (req, res) => {
    try {
        const info = req.body
        const data = await productManager.addElements(info)
        console.log(data)

        res.status(200).send({
            status: "success",
            payload: data
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            payload: error.message
        })
        console.log(error)
    }
}

export const updateProduct = async (req, res) => {
    try {
        const data = await productManager.updateElement(req.params.pid, req.body)
        res.status(200).send({
            status: "success",
            payload: data
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            payload: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const data = await productManager.deleteElement(req.params.pid)

        res.status(200).send({
            status: "success",
            payload: data
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            payload: error.message
        })
    }
}