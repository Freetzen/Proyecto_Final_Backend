import local from "passport-local";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { userManager } from "../controllers/user.controller.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import mongoose from "mongoose";
import { authToken, generateToken } from "../utils/jwt.js";
import { cartManager } from "../controllers/cart.controller.js";

// Passport como middleware
const LocalStrategy = local.Strategy; //Estrategia local de autenticación 
const JWTStrategy = jwt.Strategy; //Estrategia de JWT
const ExtractJwt = jwt.ExtractJwt; //Extractor, ya sea headers, cookies, etc...

const initializePassport = () => {
    const cookieExtractor = (req) => {
        // Si existen las cookies, verifica que sea jwt cookie
        const token = req.cookies ? req.cookies.jwtCookies : null; //Si no existe, null o undefined
        return token;
    };

    //Ruta a implementar
    passport.use( 
        'jwt',
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), //jwtFromRequest (De donde extraigo mi token)
                secretOrKey: process.env.COOKIE_SECRET, //Mismo valor que las firma de las Cookies
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        'register',
        new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email } = req.body;

            try {
                const user = await userManager.getUserByEmail(username); // username = email
                if (user) { //Usuario existente
                    return done(null, false); // null no errores y false no se creo el usuario
                } else {
                    const hashPassword = createHash(password);
                    const newCart = await cartManager.addElements()
                    const createdUser = await userManager.addElements({
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        password: hashPassword,
                        cart_id: newCart[0]._id
                    });

                    const token = generateToken(createdUser);
                    console.log(`<PASSPORT> token: ${token}`);
                    return done(null, createdUser);
                }
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.use(
        'login',
        new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
            try {
                const user = await userManager.getUserByEmail(username);
                console.log('<PASSPORT> Usuario logging-in: ', user.email);
                if (!user) {
                    //Ususario no encontrado
                    console.log('<PASSPORT> Usuario no encontrado');
                    return done(null, false);
                }
                if (validatePassword(password, user.password)) {
                    const token = generateToken(user);
                    console.log('<PASSPORT> Usuario encontrado');
                    return done(null, user);
                }
                //Contraseña incorrecta
                console.log('<PASSPORT> Contraseña incorrecta');
                return done(null, false);
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                callbackURL: 'http://localhost:8080/authSession/githubSession',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile);
                    const user = await userManager.getUserByEmail(profile._json.email);

                    if (user) { //Usuario ya existe en BDD
                        console.log('encontró user en github');
                        done(null, user);
                    } else { //Si no esta logeado, creamos el usuario
                        console.log('nuevo user desde github');
                        const hashPassword = createHash('coder1234')
                        const newCart = await cartManager.addElements()
                        const createdUser = await userManager.addElements({
                            first_name: profile._json.name, 
                            last_name: ' ',
                            email: profile._json.email,
                            password: hashPassword,
                            role: 'user',
                            cart_id: newCart[0]._id
                        });

                        done(null, createdUser);
                    }
                } catch (error) {
                    console.log(error)
                    return done(error);
                }
            }
        )
    );

    // Iniciar la sesión del usuario
    passport.serializeUser((user, done) => {
        if (!user) {
            done(null, null);
        }
        if (Array.isArray(user)) {
            done(null, user[0]._id);
        } else {
            done(null, user._id);
        }
    });

    // Eliminar la sesión
    passport.deserializeUser(async (id, done) => {
        const user = await userManager.getElementById(id);
        done(null, user);
    });
};

export default initializePassport;