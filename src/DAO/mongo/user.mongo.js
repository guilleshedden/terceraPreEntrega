const { logger } = require("../../utils/logger");
const { UserModel } = require("./models/user.model");

class UserManagerMongo{
    constructor(){
        this.userModel= UserModel
    }

    async getUser(email){
        try{
            return await this.userModel.findOne(email)
        }catch(err){
            return new Error(err)
        }
    }   
    
    async createUser(newUser){
        try{
            return await this.userModel.create(newUser)
        }catch(err){
            return new Error(err)
        }
    }

    async getUserById(uid){
        try {
            return await this.userModel.findOne({_id: uid})
        } catch (error) {
            logger.error(error)
        }
    }

}

module.exports= UserManagerMongo