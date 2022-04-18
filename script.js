const user = {};

let lastMessageSaved, lastMessage;

function login(){
    const username = prompt("Qual o seu nome de usuário?");
    user.name = username
    const promise = axios.post ("https://mock-api.driven.com.br/api/v6/uol/participants" , user);
    promise.then(checkConnection);
    promise.catch(() => {
        alert("Esse nome de usuário já foi escolhido,favor escolha outro");
        login();
    });
}

function checkConnection(){
    setInterval(() => {
    const promise = axios.post ("https://mock-api.driven.com.br/api/v6/uol/status" ,  user);
    promise.catch(handleError);
    }, 5000);
}

function handleError(error){
    console.log("Status code: " + error.status);
	console.log("Mensagem de erro: " + error.data);
}

function getMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then ((response) => {
        lastMessageSaved = document.querySelector("ul").lastElementChild;
        clear();
        response.data.map((message) => {
            if(message.to === "Todos" || message.to === user.name){
                displayMessages(message);
            }
        });
        lastMessage = document.querySelector("ul").lastElementChild;
        scrollMessages();
    });
    promise.catch(()=>{
        alert("qualquer coisa")
    })
}

function displayMessages(msg){
    switch(msg.type){
        case "status":
            displayStatusMessages(msg);
            break;
        case "message":
            displayNormalMessages(msg);
            break;
        case "private_message":
             displayPrivateMessages(msg);
             break;
        default:
            break;
    }

}

function displayStatusMessages(message){
    document.querySelector("ul").innerHTML += `<li class="status-messages"><p><span class = "time">(${message.time})</span> <strong> ${message.from} </strong> entra na sala ... </p> </li>`;
}

function displayNormalMessages(message){
    document.querySelector("ul").innerHTML += `<li class="normal-messages"><p><span class = "time">(${message.time})</span> <strong> ${message.from} </strong> para <strong> ${message.to}</strong>: ${message.text}</p> </li>`;
}

function displayPrivateMessages(message){
    document.querySelector("ul").innerHTML += `<li class="private-messages"><p><span class = "time">(${message.time})</span> <strong> ${message.from} </strong> reservadamente para <strong> ${message.to}</strong>: ${message.text}</p> </li>`;
}


function clear(){
    document.querySelector("ul").innerHTML = "";
}

function sendMessages(message){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", {from: user.name, to:"Todos", text: message.children[0].value, type: "message"});
    message.children[0].value = "";
    promise.then(getMessages);
    promise.catch(() => {
        alert("Houve algum problema na conexão, clique em OK para entrar de novo na sala.");
        window.location.reload();
    })

}

function reload(){
    setInterval(getMessages, 3000);
}

function scrollMessages(){
    const lastMessageIntoView = document.querySelector("ul").lastElementChild;
    if (lastMessageSaved !== lastMessage){
        lastMessageIntoView.scrollIntoView();
    }
}

login();
getMessages();
reload();