var cron = require('node-cron');
let transporter = require('./transporter')
const User = require('../models/user')
const Task = require('../models/task')

cron.schedule(' 0 16 * * friday ', () => {
  getData()
});

async function getData() {
    const users = await User.find({})
    users.forEach(async user => {
        if(user.isEmailEnabled == "Yes") {
            const tasks = await Task.find({owner: user._id})
            sendMail(user, tasks)
        }
    })
}

async function sendMail(user, tasks) {
    const url = `${process.env.HOSTNAME}/editProfile`;
    if(tasks.length) {

        let completedCount = 0
        let incompletedCount = 0

        const completedTasks = tasks.filter(task => task.completed === true)
        if(completedTasks.length) {
            completedCount = completedTasks.length
        }
        incompletedCount = tasks.length - completedCount

        let mailOptions = {
            from: {
                name: 'Task Manager',
                address: process.env.GMAIL_USER
            },
            to: user.email,
            subject: 'Check your progress',
            html: `
            <h3 style="font-family: "Source Sans Pro", Helvetica, Arial, sans-serif;"> Hey ${user.name}, here's a quick look at your tasks</h3>
            <br>
            <h4 style="text-align: center;
                color: #ec5252;
                font-size: 35px;
                font-family: "Source Sans Pro", Helvetica, Arial, sans-serif;
                font-weight: bold;"> Completed: ${completedCount} </h4>
            <h4 style="text-align: center;
                color: #ec5252;
                font-size: 35px;
                font-family: "Source Sans Pro", Helvetica, Arial, sans-serif;
                font-weight: bold;"> Incompleted: ${incompletedCount} </h4>
            <br><br>
            <p>Don't want to receive notifications? Turn off here <a href=${url}>Edit Profile</a></p>
            `,       
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
}