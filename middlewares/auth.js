const isLogin = async (req,res,next)=>{
    try {
        if(req.session.user_name){
            console.log("login succesful")
        }else{
            res.clearCookie()
            return res.redirect('/')
        }
        return next()
    } catch (error) {
        console.log(error.message)
    }
}

const isLogout = async (req,res,next)=>{
    try {
        if(req.session.user_name){
            return res.redirect('/home')
        }
        return next()
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    isLogin,
    isLogout
}