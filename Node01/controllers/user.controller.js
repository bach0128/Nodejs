const userController = {
  listCourse: (req, res) => {
    res.send("<h1>danh sach courses</h1>");
  },
  activeCourses: (req, res) => {
    res.send("<h1>add courses</h1>");
  },
  pendingCourses: (req, res) => {
    res.send("<h1>active courses</h1>");
  },
};

export default userController;
