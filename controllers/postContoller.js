const User = require('../models/User')
const Role = require('../models/Role')
const Post = require('../models/Post')

const {validationResult} = require('express-validator')
class postController{
    async getAllPosts(req, res){
        try{
            const post = await Post.find()
            res.json(post)
        }
        catch{
            res.status(404).json({message: e})
        }
    }

    async getOnePost(req, res){
        const {id} = req.params
        try{
            if(!id){
                return res.status(400).json({message: 'Нету id'})
            }

            const post = await Post.findById(id)


            if(!post){
                return res.status(400).json({message: `id ${id} не найден`})
            }

            res.json(post)
        }
        catch(e){
            return res.status(400).json({message: e})
        }
    }

    async createPost(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: 'Ошибки валидации', errors})
            }

            
            const {title, descripton, img } = req.body 

            const creater = req.user.id

            const post = await new Post({title, descripton, img, creater})
            
            await post.save()
            res.json(post)
        }
        catch(e){
            res.status(404).json({message: e})
        }
    }

    async updatePost(req, res){
        const {id} = req.params
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message: 'Ошибки валидации', errors})
        }
        try{
            const {title, descripton, img } = req.body
            const post = await Post.findById(id)

            if(!post){
                return res.status(400).json({message: 'Пост не найден'})
            }
            if(post.creater != req.user.id){
                return res.status(400).json({message: 'Обновить пост может только тот кто создал его'})
            }
            
            await Post.findByIdAndUpdate(id, {title, descripton, img}, (err, post) => {
                if(err){
                    return res.status(400).json({message: 'Ошибка обновления поста'})
                }

                res.json(post)
            })
        }
        catch(e){
            return res.status(400).json({message: e})
        }
    }

    async deletePost(req, res){
        const {id} = req.params
        try{
            const post = await Post.findById(id)
            if(!post){
                return res.status(400).json({message: 'Пост не найден'})
            }

            if(post.creater != req.user.id){
                return res.status(400).json({message: 'Удалить пост может только тот кто создал его'})
            }
            await Post.findByIdAndDelete(id)

            res.json({message: 'Пост удален'})

        }
        catch(e){
            return res.status(400).json({message: e})
        }
    }
    async likePost(req, res){
        const {id} = req.params
        try{
            const post = await Post.findById(id)
            
            if(!post){
                return res.status(400).json({message: 'Пост не найден'})
            }

            if(post.like.includes(req.user.id)){
                post.like.pop(req.user.id)

                post.save()

               res.json(post)
            }
            else{
                console.log('NOT FIND ID')
               post.like.push(req.user.id)

               post.save()

               res.json(post)
            }
        }
        catch(e){
            return res.status(400).json({message: e})
        }
    }
}

module.exports = new postController()