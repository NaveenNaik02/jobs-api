import express, { Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import rateLimiter from "express-rate-limit";
import connectDB from "./db/connect";
import authRouter from "./routes/auth";
import jobsRouter from "./routes/jobs";
import authenticateUser from "./middleware/authentication";
import errorHandleMiddleware from "./middleware/error-handler";
import notFound from "./middleware/not-found";
import path from "path";

const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, "..", "swagger.yaml"));

dotenv.config();
//extra security
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, //limit each IP to 100 request per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(
  "/api-docs/swagger-ui",
  express.static(path.join(__dirname, "..", "swagger-assets"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css; charset=UTF-8");
      } else if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
      }
    },
  })
);
//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
app.use(notFound);
app.use(errorHandleMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    app.listen(port, () => console.log(`server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
