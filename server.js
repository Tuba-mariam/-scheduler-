import bodyParser from "body-parser";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

let products = [
  { id: "1", name: "shoes" },
  { id: "2", name: "cloths" },
];

//socket.io
io.on("connection", (socket) => {
  // GetAllProducts is a message name and products is a data.

  setInterval(() => {
    io.emit("GetAllProducts", products);
    console.log("Get all proeducts");
  }, 30000);

  app.post("/products", (req, res) => {
    try {
      const { id, name } = req.body;
      products.push({ id, name });
      res.status(201).json({ message: "product added" });
    } catch (error) {
      res.status(500).json((message = " data could not found"));
    }

    // io.emit("GetAllProducts", products);
  });

  app.delete("/products/:id", (req, res) => {
    try {
      const id = req.params.id;
      products = products.filter((item) => item.id !== id);

      // io.emit("GetAllProducts", products);

      res.status(201).json({ message: "product deleted" });
    } catch (error) {
      res.status(500).json((message = " data could not found"));
    }
  });

  app.put("/products/:id", (req, res) => {
    try {
      const id = req.params.id;
      const updateData = req.body;

      console.log({ updateData, id });

      products = products.map((item) =>
        item.id === id ? { id: item.id, ...updateData } : item
      );

      // io.emit("GetAllProducts", products);

      res.status(201).json("product updated");
    } catch (error) {
      res.status(500).json((message = " data could not found"));
    }
  });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});

server.listen(9000, () => {
  console.log("server running at  http://localhost:9000");
});
