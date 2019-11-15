"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../clases/token"));
exports.verificaToken = (req, resp, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.validaToken(userToken).then((decoded) => {
        console.log(decoded);
        req.user = decoded.user;
        next();
    }).catch(err => {
        resp.json({
            ok: false,
            mensaje: 'Token no valido'
        });
    });
};
