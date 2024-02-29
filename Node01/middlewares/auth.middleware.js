// là 1 hàm để lọc req trước khi cho req tiếp tục đi
const isLogin = true;
const authMiddleware = (req, res, next) => {
  if (!isLogin) {
    res.redirect("/login");
    return;
  }
  next();
};

export default authMiddleware;
