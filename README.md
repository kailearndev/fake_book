# Fake Book API

Backend API cho ứng dụng mạng xã hội đơn giản, xây dựng bằng NestJS, Prisma và PostgreSQL.

## Tính năng chính

- Đăng ký, đăng nhập bằng JWT.
- Xem thông tin user hiện tại.
- Tạo, đọc, cập nhật, xóa bài viết.
- Upload nhiều ảnh cho bài viết.
- Bình luận và trả lời bình luận.
- Cập nhật, xóa bình luận của chính mình.
- Toggle reaction cho bài viết.
- Swagger UI để thử API trực tiếp.

## Công nghệ

- Node.js 22
- NestJS 11
- Prisma 7
- PostgreSQL 16
- Docker Compose
- JWT authentication
- Swagger/OpenAPI

## Yêu cầu

- Docker và Docker Compose
- Node.js 22 nếu muốn chạy trực tiếp ngoài Docker
- npm

## Cấu hình môi trường

Tạo file `.env` ở thư mục gốc nếu chưa có:

```env
POSTGRES_USER=user_fake_book
POSTGRES_PASSWORD=password_fake_book
POSTGRES_DB=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5556

JWT_SECRET=change_me
PORT=9921

CLOUDFLY_ACCESS_KEY=your_access_key
CLOUDFLY_SECRET_KEY=your_secret_key
CLOUDFLY_REGION=HN-01
CLOUDFLY_ENDPOINT=https://s3.cloudfly.vn
CLOUDFLY_BUCKET_NAME=fakebook-storage
```

Khi chạy bằng Docker Compose, backend dùng `DATABASE_URL` được khai báo trong `docker-compose.yml`:

```env
postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public
```

Không nên phụ thuộc vào biến `DATABASE_URL=postgresql://${POSTGRES_USER}:...` trong `.env` cho NestJS, vì `dotenv` không tự expand biến lồng nhau.

## Chạy bằng Docker

Khởi động database và backend:

```bash
docker compose up -d
```

Xem logs backend:

```bash
docker compose logs -f backend
```

Dừng toàn bộ service:

```bash
docker compose down
```

Xóa cả volume database:

```bash
docker compose down -v
```

Backend chạy ở:

```text
http://localhost:3000
```

Swagger UI:

```text
http://localhost:3000/api
```

## Database và Prisma

Generate Prisma client:

```bash
npm run prisma:generate
```

Chạy migration local:

```bash
npm run prisma:migrate
```

Deploy migration trong môi trường Docker:

```bash
docker compose exec backend npm run prisma:migrate:deploy
```

Nếu cần chạy migration dev từ container:

```bash
docker compose exec backend npm run prisma:migrate
```

## Chạy trực tiếp bằng npm

Cài dependency:

```bash
npm install
```

Chạy dev server:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Chạy production build:

```bash
npm run start:prod
```

## Scripts

```bash
npm run start              # chạy NestJS
npm run start:dev          # chạy watch mode
npm run build              # build dist
npm run lint               # lint và auto fix
npm run format             # format source
npm run test               # chạy unit test
npm run test:e2e           # chạy e2e test
npm run prisma:generate    # generate Prisma client
npm run prisma:migrate     # tạo/chạy migration dev
npm run prisma:migrate:deploy
```

## Xác thực

Các endpoint ngoài `auth/register` và `auth/login` yêu cầu Bearer token.

Header:

```http
Authorization: Bearer <access_token>
```

Đăng nhập sẽ trả về token để dùng cho các request tiếp theo.

## API

### Health check

```http
GET /
```

Trả về:

```text
Hello World!
```

### Auth

Đăng ký:

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "email": "john.doe@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Đăng nhập:

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

Lấy profile:

```http
GET /auth/profile
Authorization: Bearer <access_token>
```

### Uploads

Tất cả endpoint `/uploads` yêu cầu Bearer token.

Upload ảnh:

```http
POST /uploads/images
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

Form data:

```text
images=<file>
images=<file>
```

Response:

```json
{
  "urls": ["https://s3.cloudfly.vn/bucket/fakebook/image.jpg"]
}
```

### Posts

Tất cả endpoint `/posts` yêu cầu Bearer token.

Tạo bài viết:

```http
POST /posts
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "content": "Hôm nay trời đẹp quá!",
  "images": ["https://s3.cloudfly.vn/bucket/fakebook/image.jpg"]
}
```

Lấy danh sách bài viết:

```http
GET /posts
Authorization: Bearer <access_token>
```

Lấy chi tiết bài viết:

```http
GET /posts/:id
Authorization: Bearer <access_token>
```

Cập nhật bài viết:

```http
PATCH /posts/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "content": "Nội dung mới"
}
```

Xóa bài viết:

```http
DELETE /posts/:id
Authorization: Bearer <access_token>
```

### Comments

Tạo comment hoặc reply:

```http
POST /comment
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "postId": "post-id",
  "content": "Nội dung comment",
  "parentId": "comment-id-neu-la-reply"
}
```

Cập nhật comment:

```http
POST /comment/:commentId
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "content": "Nội dung comment được cập nhật"
}
```

Xóa comment:

```http
DELETE /comment/:commentId
Authorization: Bearer <access_token>
```

### Reactions

Toggle reaction cho bài viết:

```http
POST /reactions/toggle
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "postId": "post-id",
  "type": "LIKE"
}
```

Các loại reaction gợi ý:

```text
LIKE, LOVE, HAHA, WOW, SAD, ANGRY
```

## Cấu trúc thư mục

```text
src/
  auth/       # đăng ký, đăng nhập, JWT guard
  posts/      # quản lý bài viết và upload ảnh
  comment/    # comment và reply
  reaction/   # reaction bài viết
  prisma/     # PrismaService
  s3/         # upload ảnh lên S3 compatible storage
prisma/
  schema.prisma
  migrations/
docker-compose.yml
```

## Ghi chú khi phát triển

- Prisma client được generate vào `generated/prisma`.
- PostgreSQL trong Docker publish ra host ở port `5556`.
- Backend trong Docker publish ra host ở port `3000`.
- Nếu thay đổi Prisma schema, chạy migration rồi generate client lại.
- Nếu đổi biến môi trường trong `docker-compose.yml`, recreate container bằng:

```bash
docker compose up -d --force-recreate backend
```

## Kiểm tra nhanh

```bash
curl http://localhost:3000/
```

Kết quả mong đợi:

```text
Hello World!
```
