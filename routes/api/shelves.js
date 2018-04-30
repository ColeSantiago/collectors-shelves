const axios = require("axios");
const router = require("express").Router();
const models = require("../../models/index.js");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const cheerio = require("cheerio");
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
                    models.user_friends.create({
                        userId: result.dataValues.id,
                        friendId: 1,
                        username: "colee"
                    })
                    .then(function(subsubsubResult) {
                        sendEmail(newUser);  
                    }).catch(function(err) {
                        console.log(err);
                        res.json(err);
                    })
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

router.post("/signout", function(req,res){
    console.log("Signing out User", req.body.userId); 
    
     models.user_status.destroy({
        where : {
            userId : req.body.userId
            }
        }).then(function(status){
            console.log("You are offline!");  
    });     
});

router.get("/dashboard", function(req, res) {
	if (req.mySession && req.mySession.user) {
		let loggedInUser = req.mySession.user; 
	    res.locals.user = loggedInUser;		
	    models.user.findAll({
		    where: {
		        id: loggedInUser.id
		    }        
		}).then(function(results) {
            axios.get("http://news.toyark.com/").then(function(response) {
                let $ = cheerio.load(response.data);
                let result = {};
                $(".entry-header").each(function(i, element) {

                    result.title = $(this)
                    .text();
                    result.link = $(this)
                    .children("h2")
                    .children("a")
                    .attr("href");

                    models.articles.create(result)
                    .then(function(articles) {
                        models.articles.findAll({
                            order: [
                                ['id', 'DESC']
                            ]
                        })
                        .then(function(articleResults) {
                            models.collection_photos.findAll({
                                order: [
                                    ['id', 'DESC']
                                ]
                            })
                            .then(function(photoResults) {
                                res.json({
                                    user: results[0].dataValues, 
                                    articles: articleResults, 
                                    activity: photoResults
                                });
                            })
                        })
                    })
                });
            });
        });
    } 
});


router.post("/profile", function(req, res) {
    let loggedInUser = req.mySession.user;
    models.user.update({
        bio: req.body.bio,
        photo: req.body.photo 
    }, {
        where: {
            id: loggedInUser.id
        }
    })
    .then(function(results) {
        res.json(results)
    })
});

router.get("/profile/:username/:id", function(req, res) {
    let loggedInUser = req.mySession.user;
    models.user.findAll({
        where: {id: req.params.id},
        include: [
            {
                model: models.user_collection,
                where: {userId: req.params.id},
                attributes: ["title", "description", "userId", "id"]
            }, 
            {
                model: models.user_friends,
                where: {userId: req.params.id},
                attributes: ["friendId", "username"],         
            },
        ]
    })
    .then(function(results) {
        models.user.findAll({
            where: {id: loggedInUser.id}
        })
        .then(function(currentUserResults) {
            res.json({
                user: results[0].dataValues, 
                collection: results[0].dataValues.user_collections, 
                friends: results[0].dataValues.user_friends,
                currentUser: currentUserResults
            })
        })
    })
});

router.post("/addcollection", function(req, res) {
    models.user_collection.create({
        userId: req.body.userId,
        title:req.body.title,
        description: req.body.description
    })
    .then(function(results) {
        console.log("collection created");
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
        models.user.findAll({
            where: {id: results.dataValues.userId}
        })
        .then(function(userResults) {
            models.user.findAll({
                where: {id: loggedInUser.id}
            })
            .then(function(currentUserResults) {
                res.json({
                    collectionInfo: results.dataValues, 
                    photos: results.collection_photos, 
                    user: userResults,
                    currentUser: currentUserResults
                })
            });
        })
    })
});

router.post("/deletecollection", function(req, res) {
    models.user_collection.destroy({
        where: {id: req.body.id}
    })
    .then(function(results) {
        console.log("deleted");
    })
})

router.post("/photoupload", function(req, res) {
    models.collection_photos.create({
        collectionId: req.body.collectionId,
        photo_link: req.body.photo,
        userCollectionId: req.body.collectionId,
        likes: 0 
    })
    .then(function(results) {
        console.log("photo uploaded");
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
        likes: - 1
    }, {
        where: {id: req.body.id}
    })
    .then(function(result) {
        console.log(result);
    })
});

router.post("/addfriend", function(req, res) {
    let loggedInUser = req.mySession.user;
    models.user_friends.create({
        userId: loggedInUser.id,
        friendId: req.body.friendId,
        username: req.body.username
    })
    .then(function(result) {
        console.log('friend added');
    })
});

router.post("/unfriend", function(req, res) {
    let loggedInUser = req.mySession.user;
    models.user_friends.destroy({
        where: {
            userId: loggedInUser.id,
            friendId: req.body.friendId
        }
    })
    .then(function(result) {
        console.log("unfriend");
    })
})


function sendEmail(newUser){
    console.log(newUser);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "collectorshelves@gmail.com",
        pass: "collectandconnect"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let mailOptions = {
      from: "collectorshelve@gmail.com",
      to: newUser.email,
      subject: "Hey Collector!",
      text: "Welcome to your virtual shelves! Have fun collecting and connecting - Cole"
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent to: ",  newUser.email);
        console.log("Response got :", info.response);
      }
    });
};

module.exports = router;