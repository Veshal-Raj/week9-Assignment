const cookieParser = require('cookie-parser')
const express = require('express')
const mongoose = require("mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/newData')
.then(()=>{
    console.log("DB is connected")
})

const app = express()

app.use(cookieParser())

app.use((req,res,next)=>{
    res.set("Cache-control","no-store,no-cache")
    next()
})

// For User Routes
const userRoute = require('./router/userRoute')
app.use('/',userRoute)

// For Admin Routes
const adminRoute = require("./router/adminRoute")
app.use('/admin',adminRoute)

app.listen(4000,()=>{
    console.log(`Server started on port 4000`)
})