const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const { ObjectID } = require('mongodb')
const { findById, update, findOneAndDelete } = require('../models/task')
const auth = require('../middleware/auth')

router.post("/tasks", auth, async (req,res) => {

    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)

    } catch (error) {
        res.status(400).send(error)        
    }
})

router.get("/tasks", auth, async (req, res) => {

    try {

        const match = {}
        const sort = {}

        if(req.query.completed) {
            match.completed = req.query.completed === 'true' 
        }

        if(req.query.sortBy) {
            const [filter, order] = req.query.sortBy.split("_")
            sort[filter] = order === 'desc' ? -1 : 1
        }

    await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit), 
                skip: parseInt(req.query.skip),
                sort 
            },
        }).execPopulate()
        res.send(req.user.tasks)  

    } catch (error) {
        res.status(500).send(error)   
    }
})

router.get("/tasks/:id", auth, async (req, res) => {

    try {

        const _id = req.params.id;
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task) {
            return res.status(404).send({error: "Not Found!"})
        }

        res.send(task)

    } catch (error) {
        res.status(500).send(error)   
    }
})

router.patch("/tasks/:id", auth, async (req, res) => {
    
    try {

        const _id = req.params.id;

        if(!ObjectID.isValid(_id)) {
            return res.status(400).send({error: "Invalid Id"})
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = ['description', 'completed'];
        const isvalidUpdate = updates.every(update => allowedUpdates.includes(update));
        
        if(!isvalidUpdate) {
            return res.status(400).send({error: "Invalid Updates!"})
        }

        if(updates.length === 0) {
            return res.status(400).send({error: "Provide some data to update"})
        }

        const task = await Task.findOne({_id, owner: req.user._id})
        
        if(!task) {
            return res.status(404).send({error: 'Task not found'})
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)   

    } catch (error) {
        res.status(404).send(error)
    }
    
})

router.delete("/tasks/:id", auth, async (req, res) => {
    try {

        const _id = req.params.id;

        if(!ObjectID.isValid(_id)) {
            return res.status(400).send({ error: "Invalid Id"})
        }

        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
       
        if(!task) {
            return res.status(404).send({error: "Not Found!"})
        }

        res.send(task)

    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router