// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// const sendMessage = (mymessage) => {
//     client.messages
//         .create({
//             body: mymessage,
//             from: '+17242045582',
//             to: '+254757690940'
//         })
//         .then(message => console.log(message.sid))
//         .catch((e) => {
//             console.log(e)
//         })
// }

// const generateCode = () => {
//     const max = 100000
//     const min = 1000

//     return Math.floor(Math.random() * (max - min) + min)
// }

// module.exports = {
//     sendMessage,
//     generateCode
// }
