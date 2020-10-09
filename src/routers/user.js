const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const { ObjectID } = require('mongodb')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')

router.post("/users", async (req, res) => {
    
    try {

        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        //res.sendFile(path.resolve(__dirname, '..', 'views', 'private.html'))
        res.status(201).send(user)

    } catch (error) {
        res.status(400).send(error)
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
        res.send(req.user) 
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch("/users/me", auth, async (req, res) => {
    try {
        
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'age', 'email', 'password']
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
        fileSize: 1000000
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

module.exports = router