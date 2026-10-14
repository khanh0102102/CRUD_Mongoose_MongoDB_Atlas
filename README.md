# CRUD Mongoose and MongoDB Atlas

Bài thực hành xây dựng REST API quản lý thực phẩm với lượng calo bằng Node.js, Express, Mongoose và MongoDB Atlas.

## Yêu cầu

- Node.js 20.19+ (khuyến nghị Node.js 24)
- Tài khoản MongoDB Atlas và một cluster đang hoạt động
- Postman hoặc công cụ tương tự để kiểm thử API

## Cài đặt

1. Clone repository và mở terminal tại thư mục dự án.
2. Cài dependencies:

   ```bash
   npm install
   ```

3. Sao chép `.env.example` thành `.env`:
   - Windows PowerShell: `Copy-Item .env.example .env`
   - macOS/Linux: `cp .env.example .env`
4. Mở `.env` và thay `MONGODB_URI` bằng connection string lấy từ MongoDB Atlas. Không commit file `.env`.
5. Khởi chạy server:

   ```bash
   npm start
   ```

Nếu kết nối thành công, terminal sẽ báo `MongoDB Atlas connected successfully.` và `Server is running at http://localhost:3000`.

Kiểm tra nhanh bằng trình duyệt: http://localhost:3000

## API endpoints

Base URL: `http://localhost:3000`

| Chức năng | Method | Endpoint | Body |
| --- | --- | --- | --- |
| Đọc toàn bộ foods | GET | `/foods` | Không cần |
| Tạo food | POST | `/food` | `{"name":"cotton candy","calories":100}` |
| Cập nhật food | PATCH | `/food/:id` | Ví dụ: `{"calories":999}` |
| Xóa food | DELETE | `/food/:id` | Không cần |

Ví dụ body khi tạo mới:

```json
{
  "name": "cotton candy",
  "calories": 100
}
```

Các endpoint trả về JSON. API có kiểm tra dữ liệu đầu vào, ID không hợp lệ, document không tồn tại và lỗi server.

## Kiểm thử gợi ý trong Postman

1. Gửi `GET http://localhost:3000/foods` để xem danh sách.
2. Gửi `POST http://localhost:3000/food` với body dạng raw JSON như ví dụ phía trên; ghi lại trường `_id` trong response.
3. Gửi `PATCH http://localhost:3000/food/<id>` với `{"calories":999}`.
4. Gửi lại GET để xác nhận dữ liệu được cập nhật.
5. Gửi `DELETE http://localhost:3000/food/<id>`.
6. Gửi lại GET để xác nhận document đã bị xóa.

## Cấu trúc thư mục

```text
.
├── models/
│   └── food.js
├── routes/
│   └── foodRoutes.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Bảo mật

- Không commit `.env` hoặc mật khẩu/connection string có thông tin xác thực.
- Trong MongoDB Atlas, chỉ thêm IP phát triển cần thiết vào Network Access.
- Chỉ cấp quyền database tối thiểu cần thiết cho database user.

## Ghi chú

Database trong Atlas sẽ được tạo tự động khi ứng dụng ghi document vào đó nếu database/collection chưa tồn tại. Nếu muốn chuẩn bị trước, có thể tạo database `crud_mongoose_db` và collection `foods` trong Atlas Data Explorer.
