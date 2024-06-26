import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import http from "http";
// import morgan from "morgan";
import connectDB from "./config/db";
import errorMiddleware from "./middlewares/error";
import routes from "./routes/v1";

const app: Application = express();

// cors options
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://nextjs-blog-blond-ten-86.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
// Apply CORS middleware
app.use(cors(corsOptions));
// app.use(morgan("dev"));

// Connect to Database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

app.use("/api/v1/", routes);
app.get("/test", (req, res) => res.send("hey tester"));
// Middleware for Errors
app.use(errorMiddleware);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

const port: any = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(
    `App is running on port: ${port}. Run with http://localhost:${port}`
  );
});
