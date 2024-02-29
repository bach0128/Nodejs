const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Xin chào các bạn đến với Nodejs");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
