const express = require('express')
const path = require('path')
var cors = require('cors')
require('./db/mongoose') 
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cookieParser = require('cookie-parser')
require('./middleware/sendMails')

const app = express()
const port = process.env.PORT


app.use(cors())

app.use(express.static(path.join(__dirname,'../public')))
app.use(express.json())
app.use(express.urlencoded( {extended: false} ))
app.use(cookieParser())

app.use(userRouter)
app.use(taskRouter)

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
  });

app.listen(port, () => {
    console.log("Server is up on port " + port);
})
