# Chapter 8 — Cộng đồng độc giả BookNest

**Buổi học:** 34–39 | **CLO2 / CLO5 / CLO8**

> Dùng **SQL Server** qua `pyodbc` (mặc định: `localhost\TAMSQL`, Windows Authentication,
> database `BookNest_Ch08` tự tạo).

## Mục tiêu demo

- Avatar qua **Gravatar** (hash MD5 từ email — minh hoạ nguyên tắc data privacy/minimal disclosure)
- **Follow** (self-referential many-to-many trên `User`) + `followed_posts` (JOIN)
- Trang chủ cá nhân hoá dùng **cookie** `show_followed`
- **Comment** gắn sách với Markdown giới hạn + sanitize (`bleach`) chống XSS
- **Blog CMS** + phân trang (`paginate()`)
- Giao diện dùng **Flask-Bootstrap** (nhất quán với Chapter 3/4/6) — panel, navbar, pager
- Nhật ký sử dụng AI tool (`ai_demo/copilot_log.md`) — đúng nội dung Buổi 39

## Chạy độc lập

```bash
pip install -r requirements.txt
python seed_community.py   # tự tạo database BookNest_Ch08 trên SQL Server + 3 user, quan hệ follow chéo, 3 bài blog
python app.py
```

Đăng nhập nhanh (không cần mật khẩu, chỉ dùng để demo): `/quick-login/an_bookworm`,
`/quick-login/tam_reader`, `/quick-login/binh_writer`.

## Kịch bản demo trên lớp

1. `/quick-login/an_bookworm` rồi vào `/` — mặc định thấy **tất cả** bài viết. Bấm "Chỉ xem người tôi follow" → chỉ còn bài của `tam_reader`/`binh_writer` (2 người An đang follow) — reload lại trang vẫn giữ lựa chọn nhờ cookie.
2. `/users/tam_reader` — xem avatar Gravatar, số follower, nút Theo dõi/Bỏ theo dõi.
3. `/blog` — phân trang 3 bài/trang; `/blog/new` (cần đăng nhập) để viết bài Markdown mới, có hỗ trợ tiêu đề `##`.
4. `/books/1/comments` — viết review có `<script>alert(1)</script>` trộn với `**đậm**`: script bị loại bỏ hoàn toàn, chỉ phần in đậm được render — minh hoạ whitelist sanitize khác với auto-escape ở Chapter 3.
5. Mở `http://127.0.0.1:5000/ai-log` (nội dung file `ai_demo/copilot_log.md`) để thảo luận ranh giới đạo đức khi dùng AI + ví dụ lỗ hổng bảo mật AI sinh ra ban đầu.

## Liên kết với chương trước/sau

- `User` được thêm `username` + `gravatar_url()`; `Book` (từ Chapter 5–7) được gắn `Comment`.
- Chương 9 sẽ expose toàn bộ `Book`/`BlogPost` này qua REST API (`/api/v1/...`).


## Lưu ý tiếng Việt
Model dùng `db.Unicode` / `db.UnicodeText` (NVARCHAR) để SQL Server lưu đúng dấu tiếng Việt. Nếu DB cũ đã tạo với VARCHAR (chữ hiện `?`), chạy lại `python seed_community.py` để drop và tạo lại bảng.
