import express from "express";
import bodyParser from "body-parser";
import customerRouter from "./customers/views";
import swaggerUI from "swagger-ui-express";
import spec from "../api-spec.json";
import { dbConnect } from "./database";

const app = express();

// Middleware to parse json request bodies
app.use(bodyParser.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec));

// Middleware to allow cross origin requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/**
 * Sub-routers for our main router, we should have one sub-router per "entity" in the application
 */
app.use("/customers", customerRouter);

/**
 * Some dummy routes to illustrate express syntax
 */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  res.send(req.body);
});

app.listen(process.env.PORT || 3000, async () => {
  console.log("✅ Server is up and running");
  await dbConnect();
});
