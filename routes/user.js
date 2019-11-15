"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../clases/token"));
const auntenticar_1 = require("../middlewares/auntenticar");
const userRoutes = express_1.Router();
userRoutes.post('/create', (req, resp) => {
    const data = req.body;
    const user = {
        nombre: data.nombre,
        email: data.email,
        password: bcrypt_1.default.hashSync(data.password, 10),
        avatar: data.avatar,
    };
    user_model_1.User.create(user).then(userdb => {
        const tokenUser = token_1.default.getToken({
            _id: userdb._id,
            nombre: userdb.nombre,
            email: userdb.email,
            avatar: userdb.avatar
        });
        return resp.json({
            ok: true,
            mensaje: "Bienvenido",
            token: tokenUser
        });
    }).catch(err => {
        if (err.code == 11000) {
            resp.json({
                ok: false,
                mensaje: "El email ya esta registrado"
            });
        }
    });
});
userRoutes.post('/login', (req, resp) => {
    console.log("Login");
    const data = req.body;
    user_model_1.User.findOne({ email: data.email }, (err, userdb) => {
        if (err)
            throw err;
        if (!userdb) {
            return resp.json({
                ok: false,
                mensaje: "Usuario/Contraseña no son correctos"
            });
        }
        if (userdb.validaPassword(data.password)) {
            const tokenUser = token_1.default.getToken({
                _id: userdb._id,
                nombre: userdb.nombre,
                email: userdb.email,
                avatar: userdb.avatar
            });
            return resp.json({
                ok: true,
                mensaje: "Bienvenido",
                token: tokenUser
            });
        }
        else {
            return resp.json({
                ok: false,
                mensaje: "Usuario/Contraseña no son correctos"
            });
        }
    });
});
userRoutes.post('/update', auntenticar_1.verificaToken, (req, resp) => {
    const data = req.body;
    const user = {
        nombre: data.nombre,
        email: data.email,
        avatar: data.avatar
    };
    user_model_1.User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userdb) => {
        if (err)
            throw err;
        if (!userdb) {
            resp.json({
                ok: false,
                mensaje: err
            });
        }
        const tokenUser = token_1.default.getToken({
            _id: userdb._id,
            nombre: userdb.nombre,
            email: userdb.email,
            avatar: userdb.avatar
        });
        resp.json({
            ok: true,
            token: tokenUser
        });
    });
});
userRoutes.get('/', auntenticar_1.verificaToken, (req, resp) => {
    const user = req.user;
    if (user) {
        resp.json({
            ok: true,
            user: user
        });
    }
    else {
        resp.json({
            ok: false,
            mensaje: 'Token no valido'
        });
    }
});
exports.default = userRoutes;
