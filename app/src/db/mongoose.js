const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

console.log(chalk.yellow('[+] Connected to database.'))