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

## Kiểm thử bằng Postman

Có sẵn collection tại `postman/CRUD_Mongoose_MongoDB_Atlas.postman_collection.json`.

1. Mở Postman và chọn **Import**.
2. Chọn file collection nói trên.
3. Chạy request **GET - Read all foods** để xem danh sách hiện có.
4. Chạy **POST - Create a food**. Request tự lưu `_id` của document mới vào collection variable `foodId`.
5. Chạy **PATCH - Update food calories** để đổi `calories` thành `999`.
6. Chạy **DELETE - Delete food** để xóa document vừa tạo.
7. Chạy GET lại để xác nhận document đã bị xóa.

Collection đặt sẵn `baseUrl = http://localhost:3000`. Nếu muốn thử từng request riêng lẻ, hãy chạy POST trước PATCH hoặc DELETE vì các request sau dùng `foodId` được lưu từ response POST.

## Cấu trúc thư mục

```text
.
├── models/
│   └── food.js
├── routes/
│   └── foodRoutes.js
├── postman/
│   └── CRUD_Mongoose_MongoDB_Atlas.postman_collection.json
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
