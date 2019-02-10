var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var app = express();
var listaNotas= [{tituloTarea: "Por defecto", fechaCreacion: "5/2/2019 13:39:12", prioridad: "Low", completada: false, nick:"Jose"}];
const fileUpload = require('express-fileupload');

app.use(fileUpload());
// Settings for CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.static(__dirname + "/public"));
app.post('/archivosSubidos',function(req, res) {
    let EDFile = req.files.file;
    EDFile.mv(`/.archivosSubidos/${EDFile.name}`,err => {
        if(err) return res.status(500).send({ message : err })

        return res.status(200).send({ message : 'File upload' })
    })
});
var server = app.listen(3000);
var io = require("socket.io").listen(server);

io.on("connection", function (socket) {
    console.log("Conectado");
    socket.on('usuarioOn',function(){
        socket.broadcast.emit('usuarioOn');

        socket.emit("cargarNotas", JSON.stringify(listaNotas));

        socket.on('subirNotas', function(data) {
            listaNotas = JSON.parse(data);
            socket.broadcast.emit('cargarNotas',JSON.stringify(listaNotas) )
        });
        socket.on('nuevaNotaServidor',function(){
            socket.broadcast.emit('nuevaNotaServidor');
        });
        socket.on('borrarNotaServidor',function(){
            socket.broadcast.emit('borrarNotaServidor');
        });
        socket.on('usuarioOff', function(){
            socket.broadcast.emit('usuarioOff');
        });
    });
});