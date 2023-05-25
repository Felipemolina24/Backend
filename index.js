const express = require('express')
require('dotenv').config()
const {dbConnection} = require('./database/config')
const cors = require('cors')
const routes = require('./routes/user')
const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')
const postRoutes = require('./routes/posts')

//crear Express App
const app = express()

app.use(bodyParser.json({ limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}))

//Base de datos

dbConnection();

app.use(
     cors({
        origin: ["http://localhost:3000"],
        method: ["GET", "POST"],
        credentials: true,
    
}))



//Lectura y parseo del body
app.use( express.json())

//Rutas
app.use('/posts', postRoutes)
app.use('/user', routes)


//puerto 4000
app.listen(process.env.PORT, () =>{
    console.log('Servidor corriendo en puerto', process.env.PORT);
})

app.use(cookieParser())

app.use("/", routes)