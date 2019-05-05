var socket = io();

var params = new URLSearchParams( window.location.search);

if( !params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre/sala es necesario');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat',usuario, function(data){
        console.log("data_entraChat",data);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//Escuchar cambios de usuarios
//cuando una persona entra o sale del Chat
socket.on('listaPersonas', function(personas) {
    console.log(personas);
});

// Mensajes privados

socket.on('mensajePrivado', function(mensaje){

    console.log('Mensaje privado',mensaje);
});

