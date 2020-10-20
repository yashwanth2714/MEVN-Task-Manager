const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const { ObjectID } = require('mongodb')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
var crypto = require('crypto');
var async = require("async");
let transporter = require('../middleware/transporter')
const querystring = require('querystring');  

router.post("/users", async (req, res) => {
    
    try {

        const user = new User(req.body)
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        //res.sendFile(path.resolve(__dirname, '..', 'views', 'private.html'))
        if(token) {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            const url = `${process.env.HOSTNAME}/confirmation/${token}`;
            let mailOptions = {
                from: {
                    name: 'Task Manager',
                    address: process.env.GMAIL_USER
                },
                to: user.email,
                subject: 'Confirm Your Email Address',
                html: `<h3>Welcome to the app, ${user.name}</h3>
                Please click the confirmation link to verify your email in order to complete the sign-up process: 
                <a href="${url}">Sign Up</a>`,       
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    res.status(200).send("Success")
                    console.log('Email sent: ' + info.response);
                }
                });
        }
        await user.save()
        res.status(201).send(user)

    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/confirmation/:token', async (req, res) => {
    try {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async function(err, user) {
            console.log(user);
            if (!user) {
              await User.findOneAndDelete({ resetPasswordToken: req.params.token, resetPasswordExpires: { $lt: Date.now() } })
              const url = `${process.env.HOSTNAME}`;
              return res.status(404).send(`Confirmation mail token is invalid or has expired. \nPlease start your signup process here 
                                                <a href="${url}">Sign Up</a>`);
              
            } else {
                user.resetPasswordToken = ""
                user.resetPasswordExpires = ""
                user.confirmed = true
                await user.save()
                return res.redirect(`${process.env.HOSTNAME}`);
            }
          });   
    } catch (error) {
        console.log(error);
    }
})

router.post("/users/login", async (req, res) => {
    try {
        
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken() 
        res.cookie('auth_token', token)
        //res.sendFile(path.resolve(__dirname, '..', 'views', 'private.html'))
        res.status(200).send(user)

    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post("/users/logout", auth, async (req, res) => {
    try {
        
        req.user.tokens = req.user.tokens.filter(tokenObj => tokenObj.token !== req.token)
        await req.user.save()
        res.send()

    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/users/logoutAll", auth, async (req, res) => {
    try {

        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/users/me", auth, async (req, res) => {
    try {
        
        let user = req.user.toObject()
        user['word'] = req.user['password']
        delete user.tokens
        delete user.password
        res.send(user) 
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch("/users/me", auth, async (req, res) => {
    try {
        
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'age', 'email', 'password', 'isEmailEnabled']
        const isvalidUpdate = updates.every(update => allowedUpdates.includes(update))

        if(!isvalidUpdate) {
            return  res.status(400).send({error: "Invalid Updates!"})
        }

        if(updates.length === 0) {
            return res.status(400).send({error: "Provide some data to update"})
        }        
        
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        res.send(user)

    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete("/users/me", auth, async (req, res) => {
    try {

        await req.user.remove() 
        res.send(req.user)

    } catch (error) {
        res.status(500).send(error)
    }
})

const profileUpload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Please provide a valid image'))
            }
            cb(undefined, true)   
    }
})

router.post("/users/me/avatar", auth, profileUpload.single('avatar'), async (req, res) => {

        if(!req.file) {
            return res.status(400).send({error: 'Please provide a image'})
        }
        
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
        req.user.avatar = buffer 
        await req.user.save()
        res.send()  

}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete("/users/me/avatar", auth, async (req, res) => {
    try {

        if(!req.user.avatar) {
            return res.status(404).send({ error: 'Please upload a profile image to delete!'})
        }
        req.user.avatar = undefined
        await req.user.save()
        res.send()  

    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/users/:id/avatar", async (req, res) => {
    try {

        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
        
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/users/forgot", async (req, res) => {
    try {
        async.waterfall([
            function(done) {
              crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
              });
            },
            function(token, done) {
              User.findOne({ email: req.body.email }, function(err, user) {
                if(!user) {
                    return res.status(404).send({error: 'No account with that email address exists.'})
                }
        
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        
                user.save(function(err) {
                  done(err, token, user);
                });
              });
            },
            function(token, user, done) {
                const url = `${process.env.HOSTNAME}/reset/${token}`;
                let mailOptions = {
                    from: {
                        name: 'Task Manager',
                        address: process.env.GMAIL_USER
                    },
                    to: user.email,
                    subject: 'Password Reset',
                    html: `<h3>Hello, ${user.name}</h3>

                    A password reset event has been triggered. The password reset window is limited to one hour.

                    If you do not reset your password within one hour, you will need to submit a new request.

                    To complete the password reset process, visit the following link:

                    <a href="${url}">${url}</a>`,       
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        res.status(200).send("Success")
                        console.log('Email sent: ' + info.response);
                    }
                  });
            }
          ]);
        
          
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/reset/:token', async (req, res) => {
    try {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                const url = `${process.env.HOSTNAME}/forgotPassword`;
              return res.status(404).send(`Password reset token is invalid or has expired. Please submit a new request here 
                                           <a href="${url}">Reset Password</a>`);
            } else {                
                encodedStr = Buffer.from(req.params.token).toString('base64')
                const query = querystring.stringify({
                    "e": encodedStr,
                    "r": user.resetPasswordToken,
                });
                return res.redirect(`${process.env.HOSTNAME}/resetPassword/?` + query);
            }
          });   
    } catch (error) {
        console.log(error);
    }
})

router.patch("/resetPassword/users/me/pwd",  async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['email', 'password']
        const isvalidUpdate = updates.every(update => allowedUpdates.includes(update))

        if(!isvalidUpdate) {
            return  res.status(400).send({error: "Invalid Updates!"})
        }

        if(updates.length === 0) {
            return res.status(400).send({error: "Provide some data to update"})
        }        

        const user = await User.findOne({ email: req.body.email })

        if(!user) {
            return res.status(404).send('User not found with this email');
        }

        updates.forEach(update => user[update] = req.body[update])
        user.resetPasswordToken = ""
        user.resetPasswordExpires = ""
        await user.save()
        res.status(200).send(user)

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})
module.exports = router