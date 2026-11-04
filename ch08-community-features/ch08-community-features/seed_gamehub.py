# seed_gamehub.py
import os
import sys
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app import app
from models import db, User, Role, Game, GameGuide, GameReview, GuideComment, Follow, Permission
from markdown_utils import render_markdown, REVIEW_ALLOWED_TAGS

def seed():
    with app.app_context():
        # Xoa cac bang va tao moi
        db.drop_all()
        db.create_all()

        print("[1/6] Khoi tao Roles & Permissions...")
        Role.insert_roles()
        role_admin = Role.query.filter_by(name="Admin").first()
        role_reviewer = Role.query.filter_by(name="Reviewer").first()
        role_gamer = Role.query.filter_by(name="Gamer").first()

        print("[2/6] Tao cac tai khoan gamer mau...")
        # 1. faker_god (Admin / Pro Player)
        u1 = User(username="faker_god", email="faker@t1.gg", role=role_admin)
        u1.set_password("password123")

        # 2. wukong_fan (Reviewer / Content Creator)
        u2 = User(username="wukong_fan", email="wukong@gamehub.vn", role=role_reviewer)
        u2.set_password("password123")

        # 3. pro_gamer (Gamer thong thuong)
        u3 = User(username="pro_gamer", email="progamer@gmail.com", role=role_gamer)
        u3.set_password("password123")

        db.session.add_all([u1, u2, u3])
        db.session.commit()

        print("[3/6] Thiet lap quan he Follow...")
        # faker_god follow wukong_fan
        u1.follow(u2)
        # pro_gamer follow faker_god va wukong_fan
        u3.follow(u1)
        u3.follow(u2)
        db.session.commit()

        print("[4/6] Tao danh muc Game mau...")
        g1 = Game(
            title="Black Myth: Wukong",
            genre="Action RPG",
            platform="PC / PS5",
            description="Tua game hanh dong nhap vai dua tren Tay Du Ky voi do hoa Unreal Engine 5 dinh cao, dua nguoi choi vao vai Thien Menh Nhan di tim lai luc can cua Dai Thanh."
        )
        g2 = Game(
            title="Elden Ring",
            genre="Souls-like RPG",
            platform="PC / PS5 / Xbox",
            description="Sieu pham the gioi mo doat giai Game of the Year cua FromSoftware, boi canh the gioi huyen bi do George R. R. Martin dong sang tao."
        )
        g3 = Game(
            title="Valorant",
            genre="Tactical FPS",
            platform="PC",
            description="Game ban sung chien thuat 5v5 goc nhin thu nhat tu Riot Games, noi chien thuat dau sung ket hop hoan hao cung bo ky nang dac vu."
        )
        db.session.add_all([g1, g2, g3])
        db.session.commit()

        print("[5/6] Tao Cam nang choi game...")
        guide1_md = """## Hướng dẫn đánh bại Hắc Phong Đại Vương
Đây là một trong những đại boss khó nhằn ở **Hắc Phong Sơn**.

### Mẹo quan trọng để vượt ải:
- Sử dụng **Định Thân Thuật** ngay khi boss chuẩn bị phóng hỏa kiếm để ngắt combo.
- Né đòn cuộn lốc xoáy bằng cách lùi về phía sau và bấm nhào lộn theo nhịp thở.
- **Bắt buộc:** Trang bị pháp bảo *Tị Hỏa Tráo* (lấy từ nhiệm vụ Kim Trì Trưởng Lão) để miễn nhiễm 100% sát thương lửa!

```python
# Tỉ lệ hạ gục khi dùng Tị Hỏa Tráo
win_rate = 99.9
print(f"Khả năng qua ải: {win_rate}%")
```
"""
        guide1 = GameGuide(
            title="Cách khắc chế Hắc Phong Đại Vương không mất một giọt máu",
            game_tag="Black Myth: Wukong",
            body_md=guide1_md,
            body_html=render_markdown(guide1_md),
            author_id=u2.id
        )

        guide2_md = """## Top 3 vũ khí mạnh nhất đầu game Elden Ring
Dành cho các game thủ mới bước chân vào vùng đất **Lands Between**:
1. **Bloodhound's Fang** (Đại kiếm nhảy chém gây xuất huyết cực mạnh)
2. **Uchigatana** (Katana tốc độ đánh nhanh, có sẵn chiêu rút kiếm bạt đao)
3. **Moonveil** (Thanh kiếm phép thuật bắn sóng kiếm tầm xa bá đạo cho hệ Pháp sư)

> *Lời khuyên:* Nâng cấp vũ khí bằng đá Somber Smithing Stone để tối đa hóa sát thương sớm nhất.
"""
        guide2 = GameGuide(
            title="Cẩm nang chọn vũ khí mạnh nhất cho tân thủ Elden Ring",
            game_tag="Elden Ring",
            body_md=guide2_md,
            body_html=render_markdown(guide2_md),
            author_id=u1.id
        )

        guide3_md = """## Tuyệt chiêu Sova Recon Dart map Ascent
Học cách bắn tên soi map từ A Main bay thẳng sang B Site cực chuẩn xác:
- Đứng sát góc cửa gỗ A Main.
- Canh mũi tên vào đỉnh tòa tháp đôi.
- Kéo đúng **2 vạch lực** và thả chuột!
"""
        guide3 = GameGuide(
            title="Tuyệt chiêu Sova Recon Dart map Ascent đỉnh cao",
            game_tag="Valorant",
            body_md=guide3_md,
            body_html=render_markdown(guide3_md),
            author_id=u3.id
        )

        db.session.add_all([guide1, guide2, guide3])
        db.session.commit()

        print("[6/6] Tao Binh luan duoi Cam nang & Danh gia Game...")
        # Bình luận cẩm nang Wukong
        c1_md = "Cảm ơn tác giả nhiều! Nhờ lấy cái **Tị Hỏa Tráo** mà mình đánh qua boss ngay lần đầu thử!"
        c1 = GuideComment(
            guide_id=guide1.id,
            author_id=u3.id,
            body_md=c1_md,
            body_html=render_markdown(c1_md, allowed_tags=REVIEW_ALLOWED_TAGS)
        )
        c2_md = "Bài viết rất chi tiết, vote 10/10 cho idol `wukong_fan`!"
        c2 = GuideComment(
            guide_id=guide1.id,
            author_id=u1.id,
            body_md=c2_md,
            body_html=render_markdown(c2_md, allowed_tags=REVIEW_ALLOWED_TAGS)
        )

        # Đánh giá game Black Myth Wukong
        rev1_md = "Đồ họa **Unreal Engine 5** quá mãn nhãn, cơ chế biến hình thú vị. Xứng đáng 10/10!"
        rev1 = GameReview(
            game_id=g1.id,
            author_id=u1.id,
            rating=5,
            body_md=rev1_md,
            body_html=render_markdown(rev1_md, allowed_tags=REVIEW_ALLOWED_TAGS)
        )
        rev2_md = "Cốt truyện giàu cảm xúc, âm nhạc truyền thống kết hợp rock xuất sắc."
        rev2 = GameReview(
            game_id=g1.id,
            author_id=u3.id,
            rating=5,
            body_md=rev2_md,
            body_html=render_markdown(rev2_md, allowed_tags=REVIEW_ALLOWED_TAGS)
        )

        db.session.add_all([c1, c2, rev1, rev2])
        db.session.commit()

        print("\n===> HOAN TAT SEED DU LIEU GAMEHUB THANH CONG! <===")
        print("Tai khoan demo:")
        print("  - faker_god (Admin / Follows: wukong_fan)")
        print("  - wukong_fan (Reviewer / Tac gia cam nang Wukong)")
        print("  - pro_gamer (Gamer / Follows: faker_god, wukong_fan)")

if __name__ == "__main__":
    seed()
