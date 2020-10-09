const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
var cors = require('cors')
require('./db/mongoose') 
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT

var corsOptions = {
    origin: 'http://localhost:8080',
    //methods: ['GET', 'PUT', 'POST', 'DELETE'],
    //allowedHeaders: ['Origin','X-Requested-With','contentType','Content-Type','Accept','Authorization'],
    credentials: true,
    //optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

//app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: false} ))
app.use(cookieParser())
// app.use(session({
//     secret: 'taskManager',
//     resave: false,
//     saveUninitialized: true,
//     store: new MongoStore({ mongooseConnection: mongoose.connection})
// }))
app.use(userRouter)
app.use(taskRouter)

// The express.urlencoded() middleware parses data sent via forms from the frontend for us. Similarly, the cookie-parser middleware parses cookies sent with the forms.

app.listen(port, () => {
    console.log("Server is up on port " + port);
})
