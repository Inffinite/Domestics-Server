const axios = require('axios')

test('get /', async () => {
    const url = 'http://10.5.0.5:3000'
    await axios.get(url)
})