const fs = require('fs')

const secretRead = {}

secretRead.read = function read(secretName) {
    try {
        return fs.readFileSync(`/run/secrets/${secretName}`, 'utf8');
    } catch (e) {
        if (e.code !== 'ENOENT') {
            // console.log(`[-] Error occurred while reading ${secretName} secret`)
        } else {
            // console.log(`[-] ${secretName} secret not found`)
        }

        return false
    }
}

module.exports = secretRead;