const express = require("express");
const cors = require("cors");

const walletRouter = require("./routes/wallet/index");

const app = express();
const port = 3001;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use("/wallet", walletRouter);

app.set("port", port);
app.listen(app.get("port"), () => {
  console.log(`app is listening in http://localhost:${app.get("port")}`);
});

module.exports = app;
