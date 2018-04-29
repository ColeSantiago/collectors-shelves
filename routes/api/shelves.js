const axios = require("axios");
const router = require("express").Router();
const models = require('../../models/index.js');
let db = require("../../models");
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const cheerio = require('cheerio');
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
            password: newUser.password,
        }).then(function(result){
            models.user_collection.create({
                userId: result.dataValues.id,
                title: "My Favorite Things That I Own",
                description: "Load your favorites here!",
            }).then(function(subresult) {
                models.user_collection.create({
                    userId: result.dataValues.id,
                    title: "Things I Want",
                    description: "Put things you want to own here!",
                }).then(function(subsubresult) {
                    sendEmail(newUser);
                    res.redirect("/");
                }).catch(function(err) {
                    console.log(err);
                    res.json(err);
                })
            })
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

router.post('/signout', function(req,res){
    console.log("Signing out User", req.body.userId); 
    
     models.user_status.destroy({
        where : {
            userId : req.body.userId
            }
        }).then(function(status){
            console.log("You are offline!", status);  
    });     
});

router.get("/dashboard", function(req, res) {
	if (req.mySession && req.mySession.user) {
		let loggedInUser = req.mySession.user; 
	    res.locals.user = loggedInUser;		
	    db.user.findAll({
		    where: {
		        id: loggedInUser.id
		    }        
		}).then(function(results) {
            axios.get('http://news.toyark.com/').then(function(response) {
                let $ = cheerio.load(response.data);
                let result = {};
                $('.entry-header').each(function(i, element) {

                    result.title = $(this)
                    .text();
                    result.link = $(this)
                    .children('h2')
                    .children('a')
                    .attr('href');

                    db.articles.create(result)
                    .then(function(articles) {
                    })
                    .catch(function(err) {
                        return res.json(err);
                    });

                    db.articles.findAll({})
                    .then(function(moreResults) {
                        res.json({user: results[0].dataValues, articles: moreResults});
                    })
                });
            });
        });
    } 
});

router.post("/profile", function(req, res) {
    let loggedInUser = req.mySession.user;
    models.user.update({
        bio: req.body.bio 
    }, {
        where: {
            id: loggedInUser.id
        }
    })
    .then(function(results) {
        res.json(results)
    })
});

router.get("/profile", function(req, res) {
    let loggedInUser = req.mySession.user;
    models.user.findOne({
        where: {id: loggedInUser.id},
        include: [
            {
                model: models.user_collection,
                where: {userId: loggedInUser.id},
                attributes: ["title", "description", "userId", "id"]
            }
        ]
    })
    .then(function(results) {
        res.json({user: results.dataValues, collection: results.dataValues.user_collections})
    })
});

router.post("/addcollection", function(req, res) {
    let loggedInUser = req.mySession.user;
    models.user_collection.create({
        userId: req.body.userId,
        title:req.body.title,
        description: req.body.description
    })
    .then(function(results) {
        console.log('collection created');
    })
});

router.get("/collection/:id", function(req, res) {
    let loggedInUser = req.mySession.user;
    models.user_collection.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: models.collection_photos,
                where: {collectionId: req.params.id},
                attributes: ["photo_link", "id", "title", "likes"]
            }
        ]
    })
    .then(function(results) {
        res.json({collectionInfo: results.dataValues, photos: results.collection_photos});
    })
});

router.post("/deletecollection", function(req, res) {
    console.log(req.body.id);
    models.user_collection.destroy({
        where: {id: req.body.id}
    })
    .then(function(results) {
        console.log('deleted');
    })
})

router.post("/photoupload", function(req, res) {
    console.log(req.body);
    models.collection_photos.create({
        collectionId: req.body.collectionId,
        photo_link: req.body.photo,
        userCollectionId: req.body.collectionId,
        likes: 0 
    })
    .then(function(results) {
        console.log(results);
    })
});

router.post("/photodelete", function(req, res) {
    models.collection_photos.destroy({
        where: {
            id: req.body.id
        }
    })
    .then(function(results) {
        console.log("Photo deleted")
    })
});

router.get("/editphoto/:id", function(req, res) {
    models.collection_photos.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(function(result) {
        res.json(result)
    })
});

router.post("/edittitle", function(req, res) {
    models.collection_photos.update({
        title: req.body.title
    }, {
        where: {id: req.body.id}
    })
    .then(function(result) {
        console.log("title changed");
    })
});

router.post("/addlike", function(req, res) {
    console.log(req.body.id);
    models.collection_photos.update({
        likes: + 1
    }, {
        where: {id: req.body.id}
    })
    .then(function(result) {
        console.log(result);
    })
});

router.post("/subtractlike", function(req, res) {
    models.collection_photosat.update({
        likes: likes - 1
    }, {
        where: {id: req.body.id}
    })
    .then(function(result) {
        console.log(result);
    })
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
};

module.exports = router;