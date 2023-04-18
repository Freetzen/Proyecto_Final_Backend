import passport from "passport"

export const passportError = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                // Token errors
                return next(error)
            }
            if (!user) {
                // Usuario no encontrado
                return res.status(401).send({ error: info.message ? info.message : info.toString() })
            }

            req.user = user
            next()
        })(req, res, next)
    }
}

export const roleVerification = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: "User not authorized" })
        }
        roles.array.forEach(sentRole => {
            if (req.user.user[0].role != sentRole) {
                return res.status(401).send({ error: "User not allowed with current permisions" })
            }
        });


        next()
    }

}