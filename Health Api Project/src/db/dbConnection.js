const mongoose = require('mongoose')

const url = `mongodb+srv://someone:RWtI8xfikQuHBsTK@cluster0.a43ra9h.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to the DB')
    })
    .catch((e) => {
        console.log('Error', e)
    })