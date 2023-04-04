import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    const token = jwt.sign({ user }, process.env.COOKIE_SECRET, { expiresIn: "24h" });
    return token;
};

export const authToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: "User not authenticated" });
    } else {
        const token = authHeader.split(" ")[1]; 

        jwt.sign(token, process.env.SIGNED_COOKIE, (error, credentials) => {
            if (error) {
                return res.status(403).send({ error: "Unauthorized user" });
            } else {
                req.user = credentials.user;
                next();
            }
        });
    }
};