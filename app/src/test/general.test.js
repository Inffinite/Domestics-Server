const axios = require('axios')

test('get /', async () => {
    const url = 'http://app:3000'
    await axios.get(url)
})