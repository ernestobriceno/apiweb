const express = require('express')
const authRouter = require('./routers/auth')
const userRouter = require('./routers/user')
const fileRouter = require('./routers/file')
const cors = require('cors')


//Data Base
require('./db/dbConnection')

const app = express()
const port = 3080

//Config Express
app.use(cors())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(authRouter)
app.use(userRouter)
app.use(fileRouter)

app.listen(port, () => console.log('server running http://localhost:' + port))