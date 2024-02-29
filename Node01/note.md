session 
- phiên làm việc của trình duyệt
- Dữ liệu nằm ở server
để server biết được phiên làm việc -> dùng cookie 
request -> cookie (sessionId) -> server đọc -> lấy nội dung của session -> response (cookie chỉ chứa id)

cách làm việc với request response
- View (giao diện) -> Http get
- logic cần xử lý -> Thêm vào post, put, patch, delete

Vi du: 
- Xu ly login ==> logic login ==> redirect ve home (get)
- Xu ly validate ==> failed ==> redirect ve

Cách gửi thông báo giữa các request

- Cách 1: dùng search param
- Cách 2: dùng flash session (session chỉ hiển thị 1 lần)