// Simple chat server using Node.js and Socket.IO
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(__dirname));

// Función para generar color aleatorio
function getRandomColor() {
  const colors = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
    '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
    '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

const users = {};

io.on('connection', (socket) => {
  let user = { name: 'Anónimo', color: getRandomColor() };

  socket.on('set username', (username) => {
    user.name = username || 'Anónimo';
    user.color = getRandomColor();
    users[socket.id] = user;
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', {
      user: user.name,
      color: user.color,
      text: msg
    });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
  });
});

// Servir index.html en la raíz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
