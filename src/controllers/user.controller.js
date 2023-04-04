import { getManagerUsers } from "../dao/daoManager.js";
import { createHash } from "../utils/bcrypt.js";

const managerData = await getManagerUsers()
export const userManager = new managerData.ManagerUserMongoDB;

export const createUser = async (req, res) => {
    res.redirect('/login', 200, { status: "success", message: "Usuario creado correctamente" })
}
