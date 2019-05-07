const { io } = require('../server');

const { Usuarios} = require('../classes/usuarios');

const { crearMensaje } = require('../utils/utils')

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat',(data, callback)=>{

        console.log(data);

        if( !data.nombre || !data.sala ){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(data.sala);
        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas',usuarios.getPersonaPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', 
           crearMensaje('Administrador', 
                        `${data.nombre} se unió `)
        );

        callback(usuarios.getPersonaPorSala(data.sala));
    });

    client.on('crearMensaje',(data, callback) => {
        console.log('crear mensaje:',data);
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        console.log('mensaje a sala:',persona.sala);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje );



        callback( mensaje );

    }); 

    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

    client.on('disconnect',()=>{

        let personaBorrada=usuarios.borrarPersona(client.id);
        console.log("Se desconecta:",personaBorrada);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', 
           crearMensaje('Administrador', 
                        `${personaBorrada.nombre} salio `)
        );
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas',usuarios.getPersonaPorSala(personaBorrada.sala));


    });

});