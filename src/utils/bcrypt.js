import bcrypt from 'bcrypt'

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))
}

export const validatePassword = (password, storedPassword) => {
    return bcrypt.compareSync(password, storedPassword) //password: del usuario / storedPassword: De la BDD
}