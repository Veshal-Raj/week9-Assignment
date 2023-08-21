const User = require('../models/userModel')


//-----------------------------------------

//loading the signup page
const loadRegister = async(req,res)=>{
    try{
        res.render('signup')
    }catch(error){
        console.log("Error in loading register", error.message)
    }
}

//-------------------------------------------

const insertUser = async(req,res)=>{
    //check password and confirm password is same
    console.log("checking insertUser1")
    if(req.body.password != req.body.password2){
    console.log("checking insertUser2")

        res.render('signup',{ title:'websitename- signup',message:'password mismatch'})
    console.log("checking insertUser3")

    }else{

        try {
            // if email or password exist in database
            // console.log("checking again")
            const emailMatch = await User.findOne({ email:req.body.email})
            // console.log("checking again2")

            const phoneMatch = await User.findOne({ phone: req.body.phone})
            // console.log(req.body)
            // console.log("checking again3")
            // console.log(phoneMatch)
            if(emailMatch || phoneMatch){
            // console.log(req.body.phone) 

            // console.log("checking again4")

                res.render('signup',{title:'websitename- signup',message:'Email or Phone number already exist'})
            }else{
                // if details not in database

                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    phone:req.body.phone,
                    password:req.body.password,
                    admin_status:false
                })

                const userData = await user.save()

                if(userData){
                    // adding to database success?
                    res.render('login',{ message:"Account created Successfully, Please Login to continue"})
                } else{
                    res.render('login',{message:"Account creation failed"})
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}

//---------------------------------------------------
// loading the login page
const loginLoad = async (req,res)=>{
    try{
        res.render('login')
    }catch (error){
        console.log(error.message);
    }
}

//-----------------------------------------------------

const verifyLogin = async (req,res)=>{
    try{
        const userMatch = await User.findOne({ $and: [{email:req.body.email},{password:req.body.password}]})
        if(userMatch) {
            // if username and password combination exists
            req.session.user_name = userMatch.name // setting _id data to session
            res.cookie('user_name',userMatch.name)
            console.log(userMatch.name+" (user) logged in")
            res.redirect("/home")
        }else{
            res.render('login',{ message: 'Email or Password incorrect'})
        }
    } catch (error){
        console.log(error.message)
    }
}

//--------------------------------------------------
const loadHome = async (req,res)=>{
    try{
        res.render('home',{username: req.session.user_name})
    } catch (error){
        console.log(error.message)
    }
}

//-----------------------------------------------------------

const logout = async (req,res)=>{
    try{
        res.clearCookie("user_name")
        console.log(req.session.user_name+" (user) logged out")
        req.session.destroy()
        res.render('login',{ message:'Please login to continue'})
    } catch(error){
        console.log(error.message)
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    logout
}