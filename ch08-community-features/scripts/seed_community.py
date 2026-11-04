# Chapter 8: seed User (co username) + Role + Follow cheo + BlogPost mau
import sys
import os
from pathlib import Path

# Thêm thư mục gốc vào sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app import app, DB_NAME
from models import db, Role, User, Follow, BlogPost
from utils import render_markdown
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "shared"))
from db_config import ensure_database_exists  # noqa: E402


def run():
    ensure_database_exists(DB_NAME)
    with app.app_context():
        db.drop_all()
        db.create_all()
        Role.insert_roles()
        admin_role = Role.query.filter_by(name="Admin").first()
        customer_role = Role.query.filter_by(name="Customer").first()

        tam = User(email="tam@booknest.vn", username="tam_reader", is_verified=True, role=admin_role)
        tam.set_password("pass123")
        an = User(email="an@booknest.vn", username="an_bookworm", is_verified=True, role=customer_role)
        an.set_password("pass123")
        binh = User(email="binh@booknest.vn", username="binh_writer", is_verified=True, role=customer_role)
        binh.set_password("pass123")
        db.session.add_all([tam, an, binh])
        db.session.flush()

        # An follow Tam va Binh; Binh follow Tam -> trang chu ca nhan hoa khac nhau theo tung nguoi
        db.session.add_all([
            Follow(follower_id=an.id, followed_id=tam.id),
            Follow(follower_id=an.id, followed_id=binh.id),
            Follow(follower_id=binh.id, followed_id=tam.id),
        ])

        posts_data = [
            ("5 cuốn sách lập trình nên đọc năm 2026", "## Giới thiệu\n\nDưới đây là **5 cuốn sách** lập trình viên nào cũng nên đọc...\n\n- Clean Code\n- Fluent Python", tam),
            ("Mẹo đọc sách hiệu quả hơn", "Đọc sách *chủ động* bằng cách ghi chú lại ý chính sau mỗi chương.", tam),
            ("Vì sao Sapiens đáng đọc?", "Cuốn sách mở ra góc nhìn mới về lịch sử loài người...", binh),
        ]
        for title, body_md, author in posts_data:
            db.session.add(BlogPost(title=title, body_md=body_md,
                                     body_html=render_markdown(body_md), author=author))

        db.session.commit()
        print("Seeded 3 users (tam_reader/an_bookworm/binh_writer, password: pass123),")
        print("Follow: an->tam, an->binh, binh->tam; 3 blog posts.")


if __name__ == "__main__":
    run()
