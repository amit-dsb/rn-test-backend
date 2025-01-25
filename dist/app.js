"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const handleResponse_1 = require("./utils/handleResponse");
dotenv_1.default.config({ path: '.env' });
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
var corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(handleResponse_1.setInterface);
app.use('/api/v1/test', (req, res) => { res.status(200).json({ message: "working" }); });
app.use('/api/v1/auth', auth_route_1.default);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
let PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});
