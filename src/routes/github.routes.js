import { Router } from "express";
import passport from 'passport'

const routerGithub = Router()

// Register
routerGithub.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

// Login


routerGithub.get('/githubSession', (req, res, next) => {
    passport.authenticate('github', async (error, user) => {
        if (error) {
            req.session.message = "Ocurrió un error"
            console.log(error)
            res.redirect('/login')
            return
        }
        if (!user) {
            req.session.message = "No se pudo verificar"
            res.redirect('/login')
            return
        }

        req.session.login = true
        req.session.name = user.first_name
        req.session.role = user.role

        
        res.redirect('/products')
        return

    })(req, res, next)
})

export default routerGithub