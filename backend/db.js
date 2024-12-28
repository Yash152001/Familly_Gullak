const mongoose = require('mongoose')
const mongoURI =
  "mongodb+srv://aniskhan45:aniskhan45@data.tnmy1.mongodb.net/?retryWrites=true&w=majority&appName=Data"; 

const connectmongo = () =>{
    mongoose.connect(mongoURI , {  
        // useNewUrlParser: true, 
        // useUnifiedTopology: true,
        family: 4,})
}
console.log("Connected")

module.exports = connectmongo;