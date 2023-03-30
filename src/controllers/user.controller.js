import { getManagerUsers } from "../dao/daoManager.js";
import { createHash } from "../utils/bcrypt.js";

const managerData = await getManagerUsers()
export const userManager = new managerData.ManagerUserMongoDB;

export const createUser = async (req, res) => {
    const { first_name, last_name, username, email, password, role = "user" } = req.body

    try {
        const user = await userManager.getUserByEmail(email)
        if (user) {
            res.status(400).json({
                message: "User already registered"
            })
        } else {
            const hashPassword = createHash(password)

            const createdUser = await userManager.addElements({
                first_name: first_name,
                last_name: last_name,
                username: username,
                email: email,
                password: hashPassword,
                role: role
            })

            res.status(200).json({
                message: "User created",
                createdUser
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
