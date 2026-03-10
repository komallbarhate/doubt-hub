const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const http = require("http")
const { Server } = require("socket.io")

const Doubt = require("./models/doubt")
const User = require("./models/user")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())
app.use(bodyParser.json())
app.use(express.static("public"))

app.get("/", (req,res)=>{
res.sendFile(__dirname + "/public/login.html")
})

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/doubts")
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))

/* SIGNUP */

app.post("/signup", async (req,res)=>{

let name=req.body.name
let email=req.body.email
let password=req.body.password
let role=req.body.role

let existing=await User.findOne({email:email})

if(existing){

return res.json({error:"User already exists"})

}

await User.create({
name:name,
email:email,
password:password,
role:role
})

res.json({success:true})

})

/* LOGIN */

app.post("/login", async (req,res)=>{

let email=req.body.email
let password=req.body.password

let user=await User.findOne({email:email,password:password})

if(user){

res.json(user)

}else{

res.json({error:"Invalid login"})

}

})

/* ADD DOUBT */

app.post("/addDoubt", async (req,res)=>{

let name=req.body.name
let text=req.body.text
let topic=req.body.topic
let anonymous=req.body.anonymous

if(anonymous){
name="Anonymous"
}

let existing=await Doubt.findOne({text:text,topic:topic})

if(existing){

existing.votes+=1
await existing.save()

io.emit("doubtUpdated")

}else{

const doubt=new Doubt({
name:name,
topic:topic,
text:text,
votes:1
})

await doubt.save()

io.emit("doubtUpdated")

}

res.send("saved")

})

/* GET DOUBTS */

app.get("/getDoubts", async (req,res)=>{

const doubts=await Doubt.find()

res.json(doubts)

})

/* DELETE DOUBT */

app.delete("/deleteDoubt/:id", async (req,res)=>{

await Doubt.findByIdAndDelete(req.params.id)

io.emit("doubtUpdated")

res.send("deleted")

})

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
console.log("Server running on port "+PORT)
})