console.log('Hola soy el cliente')
const socket = io()

// socket.on('welcome', (data) => {
//     console.log(data)
// })
socket.on('messages-all', (data) => {
    console.log('Data: ' + data)
    render(data)
})

function render(data){
    const html = data.map(elem => {
        return (`
            <div class="px-3 py-1 my-2 border rounded" style="width: fit-content;">
                <strong>${elem.author}</strong> <small>dice:</small>
                <p class="mb-0">${elem.texto}</p>
            </div>
        `)
    }).join(' ')
    document.getElementById('caja').innerHTML = html
}


function addmessage(){
    const message = {
        author: document.getElementById('username').value,
        texto: document.getElementById('message').value
    }
    socket.emit('new-message', message)

    console.log(message)
    return false
}

