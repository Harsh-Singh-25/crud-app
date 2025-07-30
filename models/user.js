const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/testApp1")

const userSchema = new mongoose.Schema({
   name: String,
   email: String,
   imageUrl: String
   });

module.exports = mongoose.model('user', userSchema)