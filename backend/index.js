const mongo = require("./db");
const express = require("express");
var cors = require("cors");
const app = express();
const port = 5000;
app.use(cors());
const path = require("path");
const NODE_ENV = "production";
app.use(express.json());
app.use("/api/auth/", require("./routes/auth"));
app.use("/api/notes/", require("./routes/notes"));
app.use("/api/image/", require("./routes/image"));
app.use("/api/addbankdetails/", require("./routes/addbankdetails"));
app.use("/api/payments/", require("./routes/payments"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

mongo();
const __dirname1 = path.resolve();
if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
}
