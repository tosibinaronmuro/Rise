"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const errors_handler_1 = __importDefault(require("./middleware/errors-handler"));
const not_found_1 = __importDefault(require("./middleware/not-found"));
const auth_1 = __importDefault(require("./routes/auth"));
const auth_admin_1 = __importDefault(require("./routes/auth-admin"));
const bucket_1 = __importDefault(require("./routes/bucket"));
const auth_2 = __importDefault(require("./middleware/auth"));
app.use(express_1.default.json());
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/auth/admin", auth_admin_1.default);
app.use("/api/v1/bucket", auth_2.default, bucket_1.default);
app.get('/', (req, res) => {
    res.status(200).send('testing typescript which works and testing automation ');
});
app.use(errors_handler_1.default);
app.use(not_found_1.default);
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});
