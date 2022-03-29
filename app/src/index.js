const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/Users')
const chalk = require('chalk')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log(chalk.yellow('[+] Server is up on port ' + port))
})