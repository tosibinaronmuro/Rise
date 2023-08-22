"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_error_1 = __importDefault(require("errors/custom-error"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const errors_handler_1 = __importDefault(require("middleware/errors-handler"));
const not_found_1 = __importDefault(require("middleware/not-found"));
app.use(errors_handler_1.default);
app.use(not_found_1.default);
app.get('/', (req, res) => {
    res.status(200).send('testing typescript which works and testing automation ');
});
app.post('/custom-error', (req, res, next) => {
    next(new custom_error_1.default('Custom error message'));
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});
