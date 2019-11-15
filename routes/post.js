"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auntenticar_1 = require("../middlewares/auntenticar");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../clases/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
postRoutes.get('/', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    //se recibe el numero de la pagina para hacer la paginacion
    let pagina = Number(req.query.pagina);
    let skip = pagina - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .limit(10).sort({ _id: -1 }).skip(skip).populate('user', '-password').exec();
    resp.json({
        ok: true,
        pagina: pagina,
        posts
    });
}));
postRoutes.post('/', auntenticar_1.verificaToken, (req, resp) => {
    const data = req.body;
    data.user = req.user._id;
    const imgs = fileSystem.imagenesDeTempHaciaPost(req.user._id);
    data.imgs = imgs;
    post_model_1.Post.create(data).then((postdb) => __awaiter(void 0, void 0, void 0, function* () {
        yield postdb.populate('user', '-password').execPopulate();
        resp.json({
            ok: true,
            post: postdb
        });
    })).catch((err) => {
        resp.json(err);
    });
});
postRoutes.post('/upload', auntenticar_1.verificaToken, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return resp.json({
            ok: false,
            mensaje: 'No se subio archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return resp.json({
            ok: false,
            mensaje: 'No se subio archivo image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return resp.json({
            ok: false,
            mensaje: 'Lo que subio no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.user._id);
    return resp.json({
        ok: true,
        file: file.mimetype
    });
}));
postRoutes.get('/imagen/:user_id/:img', (req, resp) => {
    const user_id = req.params.user_id;
    const img = req.params.img;
    const pathImagen = fileSystem.getFotoUrl(user_id, img);
    resp.sendFile(pathImagen);
});
exports.default = postRoutes;
