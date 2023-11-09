const userDTO = require('../../../dto/user.dto')
const userModel = require('../models/user.model')

class User {    

    getAll = async (limit, sort, page) => {
        try {
            const dataUsers = await userModel.paginate({}, {
                limit: limit || 5,
                sort: { name: 'asc' },
                page: page || 1
            })
            
            let  users = dataUsers.docs.map((item) => {
                // FALTA VALIDAR ULTIMA SESSION MAYOR A 2 DIAS
                const userDto = new userDTO(item)
                return userDto
                // return {
                //     _id: item._id,
                //     name: item.name,
                //     email: item.email,
                //     // phone: item.phone,
                //     // age: item.age,
                //     // cart: item.cart,
                //     role: item.role
                // };
            });
            const { docs, ...rest } = dataUsers;
            
            return [users, rest]
        } catch (error) {
            console.log("ERROR IN CLASS")
        }
    }

    getUserById = async (id) => {
        // const userDto = new userDTO(user)
        const user = await userModel.findOne({ _id: id})
        const userDto = new userDTO(user)
        return userDto
        // return {
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     phone: user.phone,
        //     age: user.age,
        //     cart: user.cart,
        //     role: user.role
        // };
    }

    GetUser = async (user) => {
        const userDto = new userDTO(user)
        const result = await userModel.find({ _id: userDto.id})
        return result
    }
}

module.exports = User