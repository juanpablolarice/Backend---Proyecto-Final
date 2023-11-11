const userDTO = require('../../../dto/user.dto')
const userModel = require('../models/user.model')
const { sendEmailDeleteAccount } = require('../../../../controllers/emailController')

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
        const user = await userModel.findOne({ _id: id})
        const userDto = new userDTO(user)
        return userDto        
    }

    GetUser = async (user) => {
        const userDto = new userDTO(user)
        const result = await userModel.find({ _id: userDto.id})
        return result
    }

    updateRoleByUserId = async (user_id, role) => {
        try {
            const user = await userModel.findById(user_id)            
            user.role = role
            const result = await user.save()
            if(result){
                return true
            }else{
                return false
            }            
        } catch (error) {
            return false            
        }
    }

    deleteUserByEmail = async (email) => {
        try {
            console.log(email)
            const user = await userModel.findOne({ email: email})
            if(user){
                const name = user.name
                const email = user.email
                                
                let response = await userModel.deleteOne({ email: { $eq: email } }) 
                
                if(response.deletedCount == 1){
                    const result = await sendEmailDeleteAccount(name, email)
                }else{
                    return false
                }                
                return true            
            }else{
                return false
            }
        } catch (error) {
            console.log("ERROR en deleteUserByEmail: ")
            return false
        }
        
    }
}

module.exports = User