import { userManager } from "./user.controller.js"
import { validatePassword } from "../utils/bcrypt.js"

export const getSession = async (req, res) => {
    try {
        if (req.session.login) {
            const sessionData = {
                name: req.session.userFirst,
                role: req.session.role
            }
            return sessionData
        } else {
            res.redirect('/login', 500, { message: "Logueate para continuar" })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const checkLogin = async (req, res) => {
    try {
        //
        const { email, password } = req.body

        if (email === "admin@coderhouse.com" && password === "admin12345") {
            req.session.login = true
            req.session.userFirst = "Admin Coder"
            req.session.role = "admin"
            console.log(`${email} logged in`)
            res.redirect('/products')
        } else {
            const user = await userManager.getUserByEmail(email)

            if (user && validatePassword(password, user.password)) {
                req.session.login = true
                req.session.userFirst = user.first_name
                req.session.role = user.role
                console.log(`${email} logged in as ${user.role}`)
                res.redirect('/products')
            } else {
                res.status(401).json({
                    message: "User or password incorrect"
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const destroySession = (req, res) => {
    try {
        if (req.session.login) {
            req.session.destroy()
            console.log(`Session closed`)
            res.status(200).redirect('/')
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const requireAuth = (req, res, next) => {
    console.log(req.session.login)
    req.session.login ? next() : res.redirect('/login')

}