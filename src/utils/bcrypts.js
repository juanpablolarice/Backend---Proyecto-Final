const bcrypt = require('bcrypt')

const createHash = async (password) => {
    const hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    return hash
}

const isValidPassword = async (user, password) => {
    const valid = bcrypt.compareSync(password, user.password)
    return valid
}

module.exports = {
    createHash,
    isValidPassword
}
