const express = require('express')
const router = express.Router()
const contoller = require('../controllers/authController')

const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')


router.get('/getUsers', [authMiddleware, roleMiddleware(['ADMIN'])],contoller.getUsers)


router.post('/login', 
[
    check('password', 'Пароль должен быть больше 6 символов').isLength({max: 20, min: 6}),
    check('email', 'Вы должны ввести почту').isEmail()
],
contoller.login)


router.post('/register',[
    check('fullname', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 6 символов').isLength({max: 20, min: 6}),
    check('email', 'Вы должны ввести почту').isEmail()
], contoller.register)

router.post('/chengeUserRole',  [authMiddleware, roleMiddleware(['ADMIN'])], contoller.chengRoleUser)

module.exports = router