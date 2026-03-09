const mongoose = require("mongoose")

const doubtSchema = new mongoose.Schema({

name:String,

topic:String,

text:String,

votes:Number,

solution:String

})

module.exports = mongoose.model("Doubt",doubtSchema)