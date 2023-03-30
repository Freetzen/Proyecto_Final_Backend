const socket = io()

const messageForm = document.getElementById("messageForm")
const messageSender = document.getElementById("senderName")
const messageEmail = document.getElementById("senderEmail")
const messageText = document.getElementById("senderText")
const chatBox = document.getElementById("chatBox")

window.addEventListener("load", () => {

    socket.emit("load messages")
})



socket.on("allMessages", async message => {
    chatBox.textContent = ''
    message.forEach(message => {
        let date = new Date(message.date)
        const dateOpts = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        }
        chatBox.textContent += `[${new Intl.DateTimeFormat('es-AR', dateOpts).format(date)}] ${message.name} (${message.email}): ${message.message}\n`
    })
})

messageForm.addEventListener("submit", e => {
    e.preventDefault()

    if (messageSender.value && messageEmail.value && messageText.value) {
        const newMessage = {
            name: messageSender.value,
            email: messageEmail.value,
            message: messageText.value
        }
        socket.emit("message", newMessage)
        messageText.value = ''
        scrollDown()
    } else {
        alert("Complete todos los campos para enviar un mensaje")
    }
})

function scrollDown() {
    chatBox.scrollTop = chatBox.scrollHeight
}