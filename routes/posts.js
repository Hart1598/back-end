const express = require('express')
const router = express.Router()
const {check} = require('express-validator')
const controller = require('../controllers/postContoller')
const authMiddleware = require('../middleware/authMiddleware')



router.get('/', controller.getAllPosts)

router.get('/:id', [authMiddleware],controller.getOnePost)

router.post('/',[
    authMiddleware,
    check('title', 'Название поста не может быть пустым').notEmpty(),
    check('descripton', 'Описание поста не может быть пустым').notEmpty(),
    check('img', 'Картинка поста не может быть пустым').notEmpty(),
], controller.createPost)


router.patch('/:id',[authMiddleware], controller.updatePost)
router.delete('/:id', [authMiddleware],controller.deletePost)


router.patch('/like/:id', [authMiddleware],controller.likePost)

module.exports = router