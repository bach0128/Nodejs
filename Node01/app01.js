/*
Client -> HTTP (request, Rsponse) -> Server
*/
// Import 1 file, thu vien khac -> Su dung require -> CommonJs
/*
Có thư viện có sẵn
+ http
+ fs
+ path
*/

// const { getName } = require("./utils/funtions");
import { getName, getEmail } from "./utils/funtions.js";
console.log(getName);

import http from "http";
import parse from "url-parse";

const hostname = "localhost";
const port = 8080;
const server = http.createServer((req, res) => {
  // req: yeu cau tu client gui len
  // res: phan hoi server ve client
  const url = parse(req.url, true);
  const method = req.method;
  const path = url.pathname;
  let content;
  if (path === "/") {
    content = "<h1>Học lập trinh trình không khó</h1>";
  } else if (path === "/san-pham") {
    const { status, keyword } = url.query;
    content = `
    <h1>Danh sách sản phẩm</h1>
    <h2>Status: ${status}</h2>
    <h3>Keyword: ${keyword}</h3>
    `;
  } else if (path === "/khoa-hoc") {
    content = "<h1>Danh sách Khóa học/h1>";
  } else {
    content = "<h1>Page not found </h1>";
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(content);
  //   res.setHeader("Set-Cookie", "name=bach;path=/;max-age=86400;HttpOnly");
  //   const cookie = req.headers["cookie"];
  //   console.log(cookie);
});

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
