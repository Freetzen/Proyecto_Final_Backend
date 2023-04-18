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

export const getCurrentSession = (req, res) => {
    try {
        !req.session.login ? res.send(`No session active`) : res.send({ status: "success", payload: req.user })
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}

export const tryLogin = async (req, res) => {

    try {
        if (!req.user) {
            return res.status(401).send({
                status: "error",
                error: "Invalidated user"
            })
        }
        console.log(`<LOGIN> authenticated`)
        req.session.login = true
        console.log(`<LOGIN> req.user: ${req.user}`)
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            cart_id: req.user.cart_id
        }
        req.session.name = req.user.first_name
        req.session.role = req.user.role

        res.redirect('/products')
    } catch (error) {
        console.log(`TRYLOGIN[error]> ${error.message}`)
        res.status(500).send({
            message: error.message
        })
    }
}

export const destroySession = (req, res) => {
    try {
        if (req.session.login) {
            req.session.destroy()
            console.log(`Session cerrada`)
            res.status(200).redirect('/')
        }else {
            res.status(200).send(`Sesión inactiva`)
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