const user = {};


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
    console.log("Status code: " + error.response.status);
	console.log("Mensagem de erro: " + error.response.data);
}

function getMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then ((response) => {
        clear();
        response.data.map((message) => {
            if(message.to === "Todos" || message.to === user.name){
                displayMessages(message);
            }
        })
    })
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
    document.querySelector("ul").innerHTML += `<li class="status-messages"><p><span class = "time">${message.time}</span> <strong> ${message.from} <strong> entra na sala ... </p> </li>`;
}

function displayNormalMessages(message){
    document.querySelector("ul").innerHTML += `<li class="normal-messages"><p><span class = "time">${message.time}</span> <strong> ${message.from} </strong> para <strong> ${message.to}</strong>: ${message.text}</p> </li>`;
}

function displayPrivateMessages(message){
    document.querySelector("ul").innerHTML += `<li class="private-messages"><p><span class = "time">${message.time}</span> <strong> ${message.from} </strong> reservadamente para <strong> ${message.to}</strong>: ${message.text}</p> </li>`;
}


function clear(){
    document.querySelector("ul").innerHTML = "";
}


login();
getMessages();