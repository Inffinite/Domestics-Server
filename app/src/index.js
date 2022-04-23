const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/Users')
const adminRouter = require('./routers/Admin')
const feedbackRouter = require('./routers/Feedback')
const chalk = require('chalk')
const secrets = require('./secrets/secrets')

const port = secrets.read('port') || process.env.PORT

const app = express()
// const port = process.env.port

app.use(express.json())
app.use(userRouter)
app.use(adminRouter)
app.use(feedbackRouter)

app.listen(port, () => {
    console.log(chalk.yellow('[+] Server is up on port ' + port))
})