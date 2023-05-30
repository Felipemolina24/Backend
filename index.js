const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');
const routes = require('./routes/user');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts');
const http = require('http');
const { Server } = require('socket.io');

// Crear Express App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://playconnect.netlify.app',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Conexión a la base de datos
dbConnection();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

// Configuración de CORS
app.use(cors({
  origin: ["http://localhost:3000", "https://playconnect.netlify.app"],
  methods: ["GET", "POST"],
  credentials: true
}));

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use('/posts', postRoutes);
app.use('/user', routes);

io.on("connection", (socket) => {
  console.log(socket.id);
    
  socket.on('message', (message) => {
    socket.broadcast.emit('message', {
      body: message,
      from: socket.id
    });
  });
});

// Puerto 4000
server.listen(process.env.PORT, () => {
  console.log('Servidor corriendo en puerto', process.env.PORT);
});
