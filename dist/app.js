"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.status(200).send('testing typescript which works and testing automation ');
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});
