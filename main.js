$(function(){
    const socket = io();
    var nick = '';

    //Acceder al elemento del DOM

    const messageForm = $('#messages-form');
    const messageBox = $('#message');
    const chat = $('#chat');

    const nickForm = $("#nick-form");
    const nickError = $("#nick-error");
    const nickName = $("#nick-name");

    const userNames = $("#usernames");
    
    

    //Enviar mensaje 

    messageForm.submit(e=>{

        e.preventDefault();
        socket.emit('Enviar mensaje', messageBox.val());
        messageBox.val('');
    })

    //escuchamos respuesta del servidor 

    socket.on('nuevo mensaje',function(datos){
        //console.log(datos);

        let color = "#f4f4f4";

        if(nick == datos.username){
            color = "9ff4c5";
        }

        chat.append(`<div class="msg-area mb-2  d-flex" style="background-color:${color}"><b>${datos.userNames}  :</b><p class="msg>${datos.msg}</p></div>"`);
    });

    //Enviar nuevo usuario 

    nickForm.subnit(e =>{

        e.preventDefault();

        socket.emit('nuevo usuario',nickName.val(),datos=>{

            if(datos){
                nick = nickName.val();
                $('#nick-wrap').hide();
                $('#content-wrap').show();
            }else{
                nickError.html('<div class="alert alert-danger">El usuario ya existe</div>');
            }

            nickName.val('');
            
        });
    });

    //obtener la lista de usuarios conectados 

    socket.on('nombre usuario',datos =>{

        let html = '';
        let color = '';
        let salir = '';

        for(let i = 0; i<datos.length;i++){
            if(nick == datos[i]){
                color = "#ff0000";
                salir ='<a class="enlace-salir" href="/salir</a>';
            }else{
                color = "#000";
                salir = '';
            }

            html += `<p style="color:${color}">${datos[i]}${salir}</p>`;
            
        }

        userNames.html(html);

    })

})