import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    const token = jwt.sign({ user }, process.env.COOKIE_SECRET, { expiresIn: "24h" }); //user, asignarle valores (usuario). Secret, clave privada. Tiempo de expiración. 
    return token;
};

export const authToken = (req, res, next) => {
    //Consultamos en el header, si ya existe el token
    const authHeader = req.headers.authorization;

    //Token no existente o expirado
    if (!authHeader) {
        return res.status(401).send({ error: "Usuario no autenticado" });
    } 
        const token = authHeader.split(" ")[1]; //Sacar palabra 'Bearer' del token

        //Validar si el token es válido o no
        jwt.sign(token, process.env.SIGNED_COOKIE, (error, credentials) => {
            if (error) {
                return res.status(403).send({ error: "Usuario no autorizado" });
            }
                //Token existente y válido
                req.user = credentials.user;
                next();
            
        });
    
};