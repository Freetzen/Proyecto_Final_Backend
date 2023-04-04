import { Router } from "express";
import passport from 'passport'

const routerGithub = Router()

// Register
routerGithub.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

// Login
routerGithub.get('/githubSession', (req, res, next) => {
    passport.authenticate('github', async (error, user) => {
        if (error) {
            req.session.message = "An error ocurred"
            res.redirect('/login')
        }
        if (!user) {
            req.session.message = "Unable to verify user"
            res.redirect('/login')
        }

        req.session.login = true
        req.session.name = user.first_name
        req.session.role = user.role

        res.redirect('/products')

    })(req, res, next)
})

export default routerGithub