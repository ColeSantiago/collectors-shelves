const axios = require("axios");
const router = require("express").Router();
const models = require("../../models/index.js");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const cheerio = require("cheerio");
const saltRounds = 10;

// this route looks crazy but it is just creating the user, and creating starter friends, collections,
// photos, and notifications for the user
router.post("/signup", (req, res) => {
    const newUser = req.body;
    bcrypt.hash(newUser.password, saltRounds, function(err, hash) {
        newUser.password = hash;
        // creating the user
        models.user.create({
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            claps: 0,
            username: newUser.username,
            password: newUser.password,
        }).then(function(result){
            // creating a favorite things collection
            models.user_collection.create({
                userId: result.dataValues.id,
                title: "My Favorite Things That I Own",
            }).then(function(favCollectionResult) {
                // creating a things i want collection
                models.user_collection.create({
                    userId: result.dataValues.id,
                    title: "Things I Want",
                }).then(function(wantCollectionResult) {
                    // creating a temp photo entry for the want collection we just made
                    models.collection_photos.create({
                        collectionId: wantCollectionResult.dataValues.id,
                        userCollectionId: wantCollectionResult.dataValues.id, 
                    })
                    .then(function(wantCollectionPhotoResult) {
                        models.collection_photos.create({
                            // creating a temp photo entry for the favorite collection we just made
                            collectionId: favCollectionResult.dataValues.id,
                            userCollectionId: favCollectionResult.dataValues.id,  
                        })
                        .then(function(favCollectionPhotoResult) {
                            // creating a temp photo friend
                            models.user_friends.create({
                                userId: result.dataValues.id,
                                username: "Follow some people!"
                            })
                            .then(function(friendResult) {
                                // creating a welcome message for the notification area
                                models.user_notifications.create({
                                    userId: result.dataValues.id,
                                    message: "Welcome to collector-shelves.com!"
                                })
                                .then(function(notificationResult) {
                                    // sends a welcome email to the email provided
                                    sendEmail(newUser);  
                                }).catch(function(err) {
                                    console.log(err);
                                    res.json(err);
                                })
                            })
                        })
                    })
                })
            })
        });                
    });
});  

//Sign in route
router.post("/signin", function(req, res) {
    const loginUser = req.body;
    let reqPassword = req.body.password;
    let reqUserName = req.body.username;
    models.user.findOne({
        where: {
            username: reqUserName
        }
    }).then(function(dbUser) {
        // finding the user and checking the password
        bcrypt.compare(reqPassword, dbUser.password, function(err, result) {
            if(result) {
                console.log("passwords match");
                req.mySession.user = dbUser;
                // creating there status to be online
                res.json({login_status: true});
            // if the passwords do not match 
            } else {
                alert("We cannot find either you Username or Password");
                res.json(err);
            } 
        });
    }).catch(function(err){
        console.log(err);
    });
}); 

// Another crazy looking route, but this is just finding the current user, scraping articles about
// action figures, and also displaying all of the uploads to the dashboard
router.get("/dashboard", function(req, res) {
	if (req.mySession && req.mySession.user) {
		let loggedInUser = req.mySession.user; 
	    res.locals.user = loggedInUser;
        // finding the user
	    models.user.findAll({
		    where: {
		        id: loggedInUser.id
		    }        
		}).then(function(results) {
            // scrapeing the articles saving them in the database, then displaying them
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
                            // displaying all of the photos that have been uploaded
                            models.collection_photos.findAll({
                                order: [
                                    ['id', 'DESC']
                                ]
                            })
                            .then(function(photoResults) {
                                // sending to client side
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

// This route updates the users bio and photo if they choose to do so
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
        // sending to client side
        res.json(results)
    })
});

// Yet another crazy route. This one loads all of the users profiles
// It is using parameters so everyone's profile can be viewed, but it also passes through the 
// current users info so the client side can tell who is looking at what profile by comparing 
// the info
router.get("/profile/:username/:id", function(req, res) {
    let loggedInUser = req.mySession.user;
    // finding the user, their collections, friends, and notifications
    models.user.findAll({
        where: {id: req.params.id},
        include: [
            {
                model: models.user_collection,
                where: {userId: req.params.id},
                attributes: ["title", "description", "userId", "id"],
            }, 
            {
                model: models.user_friends,
                where: {userId: req.params.id},
                attributes: ["friendId", "username"],         
            },
            {
                model: models.user_notifications,
                where: {userId: req.params.id},
                attributes: ["message", "friendId", "friendUsername", "id"]
            }
        ],
        order: [
            [models.user_collection, 'id', 'DESC'],
            [models.user_notifications, 'id', 'DESC'],
            [models.user_friends, 'id', 'DESC'],
        ]
    })
    .then(function(results) {
        // finding the looged in users
        models.user.findAll({
            where: {id: loggedInUser.id}
        })
        .then(function(currentUserResults) {
            // sending to client side
            res.json({
                user: results[0].dataValues, 
                collection: results[0].dataValues.user_collections, 
                friends: results[0].dataValues.user_friends,
                notifications: results[0].dataValues.user_notifications,
                currentUser: currentUserResults
            })
        })
    })
});

// Creates new collections
router.post("/addcollection", function(req, res) {
    models.user_collection.create({
        userId: req.body.userId,
        title:req.body.title,
        description: req.body.description
    })
    .then(function(results) {
        // creates a temp photo entry
        models.collection_photos.create({
            collectionId: results.dataValues.id,
            userCollectionId: results.dataValues.id,
        })
        console.log("collection created");
    })
});

// the last crazy route i promise
// this one finds the current collection with the parameters, along with its photos,
// and the user it belongs to as well as the current user
router.get("/collection/:id", function(req, res) {
    let loggedInUser = req.mySession.user;
    // finding the collection with its photos
    models.user_collection.findAll({
        where: {
            id: req.params.id,
        },
        include: [
            {
                model: models.collection_photos,
                where: {collectionId: req.params.id},
                attributes: ["photo_link", "id", "title"],
            }
        ],
         order: [
            [models.collection_photos, 'id', 'DESC']
        ]
    })
    .then(function(results) {
        // finding the user the collection belongs to
        models.user.findAll({
            where: {id: results[0].dataValues.userId}
        })
        .then(function(userResults) {
            // finding the current user
            models.user.findAll({
                where: {id: loggedInUser.id}
            })
            .then(function(currentUserResults) {
                // sending to client side
                res.json({
                    collectionInfo: results[0].dataValues, 
                    photos: results[0].collection_photos, 
                    user: userResults,
                    currentUser: currentUserResults
                })
            });
        })
    })
});

// deletes collections with the id
router.post("/deletecollection", function(req, res) {
    console.log(req.body.id)
    models.collection_photos.destroy({
        where: {collectionId: req.body.id}
    })
    .then(function(result) {
        models.user_collection.destroy({
            where: {id: req.body.id}
        })
        .then(function(results) {
            res.json(results)
            console.log("deleted");
        })
    })  
});

// saves all of the photo data in the database
router.post("/photoupload", function(req, res) {
    models.collection_photos.create({
        collectionId: req.body.collectionId,
        photo_link: req.body.photo,
        userCollectionId: req.body.collectionId,
        likes: 0 
    })
    .then(function(results) {
        res.json(results);
        console.log("photo uploaded");
    })
});

// deletes individual photos
router.post("/photodelete", function(req, res) {
    models.collection_photos.destroy({
        where: {
            id: req.body.id
        }
    })
    .then(function(results) {
        res.json(results);
        console.log("Photo deleted")
    })
});

// this route brings the user to the page to edit the photo they choose using
// the parameter
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

// updates the title of the specific photo
router.post("/edittitle", function(req, res) {
    models.collection_photos.update({
        title: req.body.title
    }, {
        where: {id: req.body.id}
    })
    .then(function(result) {
        res.json(result);
        console.log("title changed");
    })
});

// this route handles the clap funtionailty
router.post("/addclap", function(req, res) {
    let loggedInUser = req.mySession.user;
    // finds the user thats been applauded and increments their claps by 1
    models.user.update({
        claps: models.sequelize.literal('claps + 1')
    }, {
        where: {id: req.body.id}
    })
    .then(function(result) {
        // creates the notification for the user
        models.user_notifications.create({
            userId: req.body.id, 
            friendId: loggedInUser.id,
            friendUsername: req.body.username,
            message: `${req.body.username} applauded you!`
        })
        .then(function(subResult) {
            res.json(subResult);
            console.log('clap');
        })
    })
});

// lets the users add each other
router.post("/addfriend", function(req, res) {
    let loggedInUser = req.mySession.user;
    models.user_friends.create({
        userId: loggedInUser.id,
        friendId: req.body.friendId,
        username: req.body.username
    })
    .then(function(result) {
        // creates the notification for the user
        models.user_notifications.create({
            userId: req.body.friendId, 
            friendId: loggedInUser.id,
            friendUsername: req.body.friendUsername,
            message: `${req.body.friendUsername} followed you!`
        })
        .then(function(subResult) {
            res.json(subResults);
            console.log('followed');
        })   
    })
});

// allows the user to unfriend someone
router.post("/unfriend", function(req, res) {
    let loggedInUser = req.mySession.user;
    models.user_friends.destroy({
        where: {
            userId: loggedInUser.id,
            friendId: req.body.friendId
        }
    })
    .then(function(result) {
        res.json(result);
        console.log("unfriend");
    })
});

// the search route. looks for photos with titles similar to the titles
router.post("/dashboard", function(req, res) {
    console.log(req.body);
    models.collection_photos.findAll({
        where :{
            title: {
                $like: req.body.searchText + '%'
            }
        }
    }).then(function(searchResults) {          
        res.json({searchResults: searchResults});
    });    
});

// function that sends the email to the created users
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
      text: "Welcome to your virtual shelves, have fun collecting - Cole"
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