module.exports = function(roles){
    return function(req, res, next){
        if(!req.user){
            return res.status(403).json({message: 'Пользователь не авторизован'}) 
        }
        if(req.user.roles.includes(...roles) ){
            next()
        }else{
            return res.status(403).json({message: 'У вас нету прав доступа'}) 
        }
    }
}