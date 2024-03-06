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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const connect_1 = __importDefault(require("./db/connect"));
const auth_1 = __importDefault(require("./routes/auth"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const authentication_1 = __importDefault(require("./middleware/authentication"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const not_found_1 = __importDefault(require("./middleware/not-found"));
const app = (0, express_1.default)();
dotenv_1.default.config();
//extra security
app.set("trust proxy", 1);
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, //limit each IP to 100 request per windowMs
}));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.get("/", (_req, res) => {
    res.send("<h1>Jobs API</h1>");
});
//routes
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/jobs", authentication_1.default, jobs_1.default);
app.use(not_found_1.default);
app.use(error_handler_1.default);
const port = process.env.PORT || 3000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.default)(process.env.MONGO_URI);
        app.listen(port, () => console.log(`server is listening on port ${port}`));
    }
    catch (error) {
        console.log(error);
    }
});
start();
//# sourceMappingURL=app.js.map