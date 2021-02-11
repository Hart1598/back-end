const User = require('../models/User')
const Role = require('../models/Role')

const bcrypt = require('bcrypt')

const {validationResult} = require('express-validator')

const jwt = require('jsonwebtoken')


const generateAccessToken = (id, roles) => {
    const payload = {id, roles}

    return jwt.sign(payload, process.env.JWT_KEY, {expiresIn: "24h"})
}



class authController{
    async register(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: 'Ошибки валидации', errors})
            }


            const {fullname, email ,password} = req.body

            const candidate = await User.findOne({email})

            if(candidate){
                return res.status(400).json({message: 'Пользыватель с таким email уже существует'})
            }

            const hashPssword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: 'ADMIN'})
            const user = new User({email, password: hashPssword, fullname, roles:[userRole.value]})
            await user.save()

            const token = generateAccessToken(user._id, user.roles)

            return res.json({token})

        }
        catch(e){
            res.status(404).json({message: 'request error'+ e})
        }
    }

    async login(req, res){
        try{
            const {email ,password} = req.body
            const user = await User.findOne({email})

            if(!user){
                return res.status(400).json({message: `Пользователь c ${email} не найден`})
            }

            const validPassword = bcrypt.compareSync(password, user.password)

            if(!validPassword){
                return res.status(400).json({message: `Некоректный пароль`})
            }

            const token = generateAccessToken(user._id, user.roles)

            return res.json({token})
        }
        catch(e){
            res.status(404).json({message: 'request error'+ e})
        }
    }

    async getUsers(req, res){
        try{

            const users = await User.find()

            res.json(users)
        }
        catch(e){
            res.status(404).json({message: 'request error'+ e})
        }
    }

    async chengRoleUser(req, res){
        const {email, role} = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message: `Пользователь c ${email} не найден`})
        }

        await User.findOneAndUpdate({email}, {$push:{"roles": role}})

        res.json({message: 'Успешно обновленна роль'})
    }
}

module.exports = new authController()