// * Server
import 'dotenv/config'
import router from './routes/index.routes.js'
import express from 'express'
import multer from 'multer'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from "./path.js";
import * as path from 'path'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import session from 'express-session';
import initializePassport from './config/passport.js'
import passport from 'passport'
import { messageManager } from './controllers/message.controller.js'

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URLMONGODB,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 120
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: false
}))

// Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'))

// Port setting
app.set("port", process.env.PORT || 5000)

// Router
app.use('/', router)

// Path
app.use('/', express.static(__dirname + '/public'))

// Server
const server = app.listen(app.get("port"), () => {
    console.log(`Server ready on http://localhost:${app.get("port")}`)
})

// ServerIO (chat)
const io = new Server(server)

// const data = await getManagerMessages();
// export const managerMessages = new data();

io.on("connection", async (socket) => {
    console.log("Connection detected")

    socket.on("message", async newMessage => {
        await messageManager.addElements([newMessage])
        const messages = await messageManager.getElements()
        console.log(messages)
        io.emit("allMessages", messages)
    })

    socket.on("load messages", async () => {
        const messages = await messageManager.getElements()
        console.log(messages)
        io.emit("allMessages", messages)
    })
})