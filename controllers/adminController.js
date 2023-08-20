const User = require('../models/userModel')

//-----------------------------------------
//loading the login page
const loginLoad = async (req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}

const verifyLogin = async (req,res)=>{
    try{
        const adminMatch = await User.findOne({ $and: [{ email: req.body.email},{password: req.body.password},{admin_status:true}]})
    
        if(adminMatch){
            console.log(adminMatch.name +"(admin) logged in")
            req.session.user_name  = adminMatch.name
            req.session.admin = true
            res.cookie('user_name',adminMatch.name)
            res.redirect("/admin/home")
        }else{
            res.render('login',{Message: "Invalid Credentials"})
        }
    } catch (error){
        console.log(error.message)
    }
}

const loadDashboard = async (req,res)=>{
    try{
        const all_users = await User.find()
        res.render('home', { username:req.session.user_name, users: all_users, alert:req.query.alert})
    } catch (error){
        console.log(error.message)
    }
}

const logout = async (req,res)=>{
    try{
        res.clearCookie("user_name")
        console.log(req.session.user_name+"(admin) logged out")
        req.session.destroy()
        res.render('login',{message:'please login to continue'})
    } catch(error){
        console.log(error.message);
    }
}

const searchUser = async (req,res)=>{
    try {
        const all_users = await User.find()

        const startLetter = req.body.search
        const regex = new RegExp(`^${startLetter}`,`i`)
        const search_user = await User.find({ name:{$regex: regex}}) //find user with starting letter

        res.render('home',{
            username : req.session.user_name ,
            users:all_users,
            searchData:search_user 
        })
    } catch (error) {
        console.log(error.message)
    }
}

const editUser = async (req,res)=>{
    // check password and confirm password is same
    if(req.body.password != req.body.password2){
        console.log("password mismatch")
        res.redirect('/admin/home') //popup
    }else{
        try {
            // if email or password exist in database
            const emailMatch = await User.findOne({ email: req.body.email})
            const phoneMatch = await User.findOne({phone:req.body.phone})
            if(emailMatch || phoneMatch){
                console.log('Existing user in database')
                res.redirect('/admin/home')
            } else{
                //if details not in database
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: "password",
                    admin_status:req.body.admin_status
                })

                const userData = await user.save()
                if(userData){
                    // adding to database success
                    res.redirect('/admin/home?alert=User created successfully') //popup successful
                } else{
                    res.redirect('/admin/home?alert= Unable to create user') //popup failed
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}

const deleteUser = async(req,res)=>{
    try {
        if(req.body.phone){
            await User.deleteOne({ phone: req.body.phone})
        }else{
            User.deleteOne({email:req.body.email})
            res.redirect("/admin?alert=User deleted successfully")
        }
    } catch (error) {
        console.log(error.message)
    }
}

const modifyUser = async(req,res)=>{
    try {
        const emailMatch = await User.findOne({ email: req.body.email})
        const phoneMatch = await User.findOne({ phone: req.body.phone})
        if(!emailMatch){
            console.log("User records not found")
            res.redirect('/admin/home?alert=email not found in database')
        }else{
            // if email present in database
            const userData = await User.updateOne({email: req.body.email},{
                $set:{
                    name: req.body.name,
                    email:req.body.email,
                    phone : req.body.phone ,
                    admin_status:req.body.admin_status
                }
            })
            console.log(userData)
            if(userData){
                // adding to database success?
                res.redirect('/admin/home?alert=User data modified successfully')
            }else{
                res.redirect('/admin/home?alert=Unable to modify  user data')
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}
module.exports={
    loginLoad,
    verifyLogin,
    loadDashboard,
    logout,
    searchUser,
    editUser,
    deleteUser,
    modifyUser
}