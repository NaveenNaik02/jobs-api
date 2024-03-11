import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import rateLimiter from "express-rate-limit";
import fs from "fs";
import connectDB from "./db/connect";
import authRouter from "./routes/auth";
import jobsRouter from "./routes/jobs";
import authenticateUser from "./middleware/authentication";
import errorHandleMiddleware from "./middleware/error-handler";
import notFound from "./middleware/not-found";
import path from "path";

const app = express();

dotenv.config();
// Extra security
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());

// Serve Swagger YAML file statically
// app.use("/swagger", express.static(path.join(__dirname, "..", "swagger.yaml")));

// CDN CSS
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, "..", "swagger.yaml"));

// Serve Swagger UI assets
const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath();
// Define routes
app.get("/", (_req: Request, res: Response) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
app.use("/api-docs/swagger", express.static(swaggerUiAssetPath));

// Explicitly set the Content-Type for CSS files
app.use(
  "/api-docs/",
  (req: Request, res: Response, next: NextFunction) => {
    if (req.url.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css");
    }
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, { customCss: CSS_URL })
);

app.get("/api-docs/swagger-ui.css", (_req: Request, res: Response) => {
  // Read contents of swagger-ui.css file
  const cssPath = path.join(swaggerUiAssetPath, "swagger-ui.css");
  fs.readFile(cssPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading swagger-ui.css:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // Set Content-Type header
      res.setHeader("Content-Type", "text/css");
      // Send the CSS content
      res.send(data);
    }
  });
});

// Define API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// Middleware for handling 404 errors
app.use(notFound);

// Middleware for handling errors
app.use(errorHandleMiddleware);

// Start server
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.error(error);
  }
};

start();
