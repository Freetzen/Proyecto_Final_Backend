import { userManager } from "./user.controller.js"
import { validatePassword } from "../utils/bcrypt.js"
import passport from "passport";

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

export const tryLogin = async (req, res) => {
    passport.authenticate('login', (error, user) => {
        try {
            if (error) {
                console.log(`TRYLOGIN> error`)
                req.session.message = "An error ocurred, try again later"
                res.redirect('/login')
                return 
            }
            if (!user) {
                console.log(`TRYLOGIN> incorrecto`)
                req.session.message = "Usuario o Contraseña incorrecta"
                res.redirect('/login')
                return
            }

            console.log(`TRYLOGIN> Autenticado`)
            req.session.login = true
            req.session.name = user.first_name
            req.session.role = user.role

            res.redirect('/products')
            return
            
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    })(req, res)
}

export const destroySession = (req, res) => {
    try {
        if (req.session.login) {
            req.session.destroy()
            console.log(`Session cerrada`)
            res.status(200).redirect('/')
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const requireAuth = (req, res, next) => {
    console.log(`SESSIONCTRL> Sesión activa?: ${req.session.login}`);
    req.session.login ? next() : res.redirect("/login");

}