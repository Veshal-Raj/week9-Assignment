const express = require("express")
const admin_route = express()
const session = require('express-session')
const config = require('../config/config')
const adminController = require('../controllers/adminController')

admin_route.use(session({
    secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}))

const bodyParser = require('body-parser')
admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({extended:true}))

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

const auth = require('../middlewares/adminAuth')

admin_route.get('/',auth.isLogout,adminController.loginLoad)
admin_route.post('/',adminController.verifyLogin)
admin_route.get('/home',auth.isLogin,auth.cookieCheck,adminController.loadDashboard)
admin_route.get('/logout',auth.isLogin,adminController.logout)
admin_route.post('/logout',adminController.logout)
admin_route.post('/search',auth.isLogin, auth.cookieCheck, adminController.searchUser);
admin_route.post('/edit',auth.isLogin, auth.cookieCheck, adminController.editUser); // create user
admin_route.post('/deleteUser',auth.isLogin, auth.cookieCheck, adminController.deleteUser);
admin_route.post('/modifyUser',auth.isLogin, auth.cookieCheck, adminController.modifyUser);  //edit user | modify
admin_route.get('*',(req,res)=>{ res.redirect('/admin')})



module.exports = admin_route