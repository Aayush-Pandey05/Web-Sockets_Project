import express from "express";
import { matchRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";
import http from "http";
import { securityMiddleware } from "./arcjet.js";
import { commentaryRouter } from "./routes/commentary.js";

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const server = http.createServer(app); // we wrapped the express app into a standard node http server allowing both http routes and web socket upgrades to coexist on one port

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Express server is running." });
});

app.use(securityMiddleware());

app.use("/matches", matchRouter);
app.use("/matches/:id/commentary", commentaryRouter);

const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server); // we are initializing the web socket and getting access to the broadcast function that we will use to send messages to all connected clients when a new match is created

app.locals.broadcastMatchCreated = broadcastMatchCreated; // we are attaching the broadcast function to the app.locals object so that we can access it in our routes when a new match is created and we want to notify all connected clients(the app.locals is the global context handler of express application)
app.locals.broadcastCommentary = broadcastCommentary;

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  console.log(`Server is running on ${baseUrl}`);
  console.log(
    `WebSocket server is running on ${baseUrl.replace("http", "ws")}/ws`,
  );
});
