//jshint esversion:6
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import ejs from'ejs';
import mongoose from 'mongoose';
import encryt from 'mongoose-encryption';


dotenv.config(); 
const app = express();
 
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//defining the secret value to encryt the data(convinient method to encrypt)
//const secret = "Thisisourlittlesecret.";     in .env file
userSchema.plugin(encryt, { secret: process.env.SECRET, encryptedFields: ['password'] }); 


const User = new mongoose.model("User", userSchema);

//*****************************************HOME ROUTE************************************** */

app.get("/", function(req, res){
  res.render("home");
});

//*****************************************LOGIN ROUTE************************************** */

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});

//****************************************REGISTER ROUTE************************************** */

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

 
 
app.listen(3000, function(req, res){
  console.log(`Server started on port 3000`);
});