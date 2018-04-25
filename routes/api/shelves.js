const axios = require("axios");
const router = require("express").Router();
const models = require('../../models/index.js');
let db = require("../../models");
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post("/signup", (req, res) => {
    const newUser = req.body;
    bcrypt.hash(newUser.password, saltRounds, function(err, hash) {
        newUser.password = hash;
        models.user.create({
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            username: newUser.username,
            password: newUser.password
        }).then(function(result){
            sendEmail(newUser);
            res.redirect("/");
        }).catch(function(err) {
            console.log(err);
            res.json(err);
        });                
    });
});  

//SIGNIN
router.post("/signin", function(req, res) {
    const loginUser = req.body;
    let reqPassword = req.body.password;
    let reqUserName = req.body.username;
    models.user.findOne({
        where: {
            username: reqUserName
        }
    }).then(function(dbUser) {
        bcrypt.compare(reqPassword, dbUser.password, function(err, result) {
            if(result) {
                console.log("passwords match");
                req.mySession.user = dbUser;
                console.log(req.mySession);
                    models.user_status.create({
                        login_status: true,
                        userId : dbUser.id
                    }).then(function(status){
                        console.log("You are online!");
                        res.json(status);
                    }); 
            } else {
                alert("We cannot find either you Username or Password");
                res.json(err);
            } 
        });
    }).catch(function(err){
        console.log(err);
    });
}); 

router.get("/", function(req, res) {
	if (req.mySession && req.mySession.user) {
		res.redirect("/dashboard");
	}else{
		res.redirect("/signin");
	}
});

router.get("/dashboard", function(req, res) {
	if (req.mySession && req.mySession.user) {
		let loggedInUser = req.mySession.user; 
	    res.locals.user = loggedInUser;		
	    db.user.findOne({
		    where: {
		        id: loggedInUser.id
		    }        
		}).then(function(results) {
		    res.json(results);
            console.log(results);
		});
	} 
});

function sendEmail(newUser){
    console.log(newUser);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'collectorshelves@gmail.com',
        pass: 'collectandconnect'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let mailOptions = {
      from: 'collectorshelve@gmail.com',
      to: newUser.email,
      subject: 'Hey Collector!',
      text: 'Welcome to your virtual shelves! Have fun collecting and connecting - Cole'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent to: ',  newUser.email);
        console.log('Response got :', info.response);
      }
    });
}

module.exports = router;