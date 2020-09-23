const express = require('express')
require('./db/mongoose') 
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: false} ))
app.use(cookieParser())
app.use(userRouter)
app.use(taskRouter)

// The express.urlencoded() middleware parses data sent via forms from the frontend for us. Similarly, the cookie-parser middleware parses cookies sent with the forms.

app.listen(port, () => {
    console.log("Server is up on port " + port);
})
