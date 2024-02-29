const authController = {
  addUser: (req, res) => {
    res.send("<h1>add user</h1>");
  },
  activeUser: (req, res) => {
    const id = req.params.id;
    res.send("<h1>active user" + id + "</h1>");
  },
};

export default authController;
