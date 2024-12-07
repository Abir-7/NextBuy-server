import express from "express";
const app = express();
const port = 3000;
import cors from "cors";
import errorHandler from "./app/middleware/globalErrorHandler";
import noRoute from "./app/utils/noRoute";
import router from "./app/routes";

// CORS options
const corsOptions = {
  origin: ["*", "https://nextmart-blue.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1", router);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(errorHandler);
app.use(noRoute);

export default app;
