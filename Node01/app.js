import express from "express";
import routerIndex from "./routes/index.js";
import routerUsers from "./routes/users.js";
import cookieParser from "cookie-parser";
import expressEjsLayouts from "express-ejs-layouts";
import session from "express-session";
import bodyParser from "body-parser";
import flash from "connect-flash";

const app = express();
// session
app.use(
  session({
    secret: "F8",
    name: "F8_session_id",
  })
);
// khoi tao connect-flash
app.use(flash());

// Doc url tu phia client
app.use(cookieParser());
("");
// chọn kiểu cho server đọc dữ liệu từ client
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// static file
app.use(express.static("public"));

app.set("view engine", "ejs"); // thiet lap template engine su dung
app.set("views", "./views"); // thiet lap duong dan toi folder view

app.use(expressEjsLayouts);
app.set("layout", "layouts/layout"); // doi layout mac dinh

app.use(routerIndex);
app.use("/users", routerUsers);

app.use((req, res) => {
  res.send("Page not found");
});

const port = 8080;
const hostname = "localhost";
app.listen(port, hostname, () => {
  console.log(`Server: http://${hostname}:${port}/`);
});
