const mongoose = require('mongoose');
const chalk = require('chalk');
const secrets = require('../secrets/secrets')

const dburl = secrets.read('mongodb_url') || process.env.MONGODB_URL

mongoose.connect(dburl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

console.log(chalk.yellow('[+] Connected to database.'))