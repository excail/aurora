var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var jsonWebToken = require('jsonwebtoken');
var secretKey = config.secretKey;

var info = {
    userCreated: "User has been created.",
    invalidCredentials: "Invalid username or password.",
    loginSuccess: "Login successful.",
    authFailed: "Failed to authenticate the user.",
    noToken: "No token provided.",
    storyCreated: "New story created.",
    storyEmpty: "Story is empty."
};

var createToken = function (user) {
    return jsonWebToken.sign({
        id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresIn: 1440
    });
};

module.exports = function (app, express) {
    var api = express.Router();

    api.post('/signup', function (req, res) {
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });

        var token = createToken(user);

        user.save(function (error) {
            if (error) {
                res.send(error);
                return;
            }
            res.json({
                success: true,
                token: token,
                message: info.userCreated
            });
        })
    });

    api.post('/login', function (req, res) {
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function (error, user) {
            if (error) {
                throw error;
            }
            if (!user) {
                res.send({message: info.invalidCredentials});
            } else {
                var validPassword = user.comparePassword(req.body.password);

                if (!validPassword) {
                    res.send({message: info.invalidCredentials});
                } else {
                    var token = createToken(user);
                    res.json({
                        success: true,
                        message: info.loginSuccess,
                        token: token
                    });
                }
            }
        });
    });

    api.get('/users', function (req, res) {
        User.find({}, function (error, users) {
            if (error) {
                res.send(error);
                return;
            }
            res.json(users);
        });
    });

    // Middleware
    api.use(function (req, res, next) {
        var token = req.body.token || req.params.token || req.headers['x-access-token'];
        if (token) {
            jsonWebToken.verify(token, secretKey, function (error, decoded) {
                if (error) {
                    res.status(403).send({success: false, message: info.authFailed});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({success: false, message: info.noToken});
        }
    });

    api.route('/')
        .post(function (req, res) {
            var story = new Story({
                creator: req.decoded.id,
                content: req.body.content
            });

            if (req.body.content) {
                story.save(function (error) {
                    if (error) {
                        res.send(error);
                        return;
                    }
                    res.json({message: info.storyCreated});
                });
            } else {
                res.send(info.storyEmpty);
            }
        })
        .get(function (req, res) {
            Story.find({creator: req.decoded.id}, function (error, stories) {
                if (error) {
                    res.send(error);
                    return;
                }
                res.json(stories);
            });
        });

    api.get('/me', function (req, res) {
        res.json(req.decoded)
    });

    return api;
};