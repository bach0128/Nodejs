# Xác thực người dùng 
- Xác minh thông tin người dùng
    + Hợp lệ lưu tt vào session hoặc token (jwt)
    + Không hợp lệ: thông báo lỗi 
- Mật khẩu mã hóa 1 chiều 
    + hash bcrypt
- Đồng nhất cách xác thực: 
    + cách lưu session, cachs lấy user, cách đăng xuất v.vv
=> các thư viện hỗ trợ cho việc xác thực: passport.js


# 2 bước triển khai login vs mạng xã hội

- Tạo link chuyển hướng tới các mạng xã hội để đăng nhập 
- Xử lý lấy dữ liệu và insert dữ liệu vào database sau khi đăng nhập xong trên các mạng xã hội (Khi đăng nhập xong chuyển hương về callbach url)

# Database

Table providers 
- id 
- name

Table users: 
- id
- name
- email
- password
- status
- provider_id

# Xây dưngj quên mật khẩu

- Nhận email từ client
- Kiểm tra email có tồn tại trong data base ko 
- Tạo token (Không nên dùng jwt) md5
- Cập nhật token vào trong bảng users (field: reset_token)
- Gửi email cho user (Trong email có link để đặt lại mk) và thời gian hết hạn (Field: expired_token)

Cấu trúc link: http://tenmiencuaban/reset-password?token=abc

# Xây dưng lại form đặt lại mk 

- Kiểm tra token có khớp vs database ko và expired
- Nếu hợp lệ hiển thị form đặt lại mk 
- Xử lý cập nhật lại mk mới cho user
- Xóa token khỏi database 
- Gửi email thông báo cho user