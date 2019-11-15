"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const user_1 = __importDefault(require("./routes/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_1 = __importDefault(require("./routes/post"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
//body-parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//fileupload
server.app.use(express_fileupload_1.default());
//cors
server.app.use(cors_1.default({ origin: true, credentials: true }));
//rutas
server.app.use('/user', user_1.default);
server.app.use('/posts', post_1.default);
//mongo db connection
mongoose_1.default.connect('mongodb+srv://jesusmesa14:jesusxd21@cluster0-h1ffh.mongodb.net/puppy?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if (err)
        throw err;
    console.log("Conexion a la base de datos");
});
server.start(() => {
    console.log("Servidor corriendo en puerto: ", server.port);
});
