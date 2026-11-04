# seed_gamehub.py
import os
import sys
from pathlib import Path

# Thêm thư mục gốc vào sys.path để import app, models, utils
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app import app
from models import db, User, Role, Game, GameGuide, GameReview, Follow, Permission
from utils import render_markdown, REVIEW_ALLOWED_TAGS

def seed():
    with app.app_context():
        # Xoa cac bang va tao moi
        db.drop_all()
        db.create_all()

        print("[1/5] Khoi tao Roles & Permissions...")
        Role.insert_roles()
        role_admin = Role.query.filter_by(name="Admin").first()
        role_reviewer = Role.query.filter_by(name="Reviewer").first()
        role_gamer = Role.query.filter_by(name="Gamer").first()

        print("[2/5] Tao cac tai khoan gamer mau...")
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

        print("[3/5] Thiet lap quan he Follow...")
        # faker_god follow wukong_fan
        u1.follow(u2)
        # pro_gamer follow faker_god va wukong_fan
        u3.follow(u1)
        u3.follow(u2)
        db.session.commit()

        print("[4/5] Tao danh muc Game mau...")
        g1 = Game(
            title="Black Myth: Wukong",
            genre="Action RPG",
            platform="PC / PS5",
            description="Tua game hanh dong nhap vai dua tren Tay Du Ky voi do hoa Unreal Engine 5."
        )
        g2 = Game(
            title="Elden Ring",
            genre="Souls-like RPG",
            platform="PC / PS5 / Xbox",
            description="Sieu pham the gioi mo doat giai Game of the Year cua FromSoftware."
        )
        g3 = Game(
            title="Valorant",
            genre="Tactical FPS",
            platform="PC",
            description="Game ban sung chien thuat 5v5 goc nhin thu nhat tu Riot Games."
        )
        db.session.add_all([g1, g2, g3])
        db.session.commit()

        print("[5/5] Tao Cam nang va Danh gia mau...")
        guide1_md = """## Huong dan danh bai Hac Phong Dai Vuong
Day la mot trong nhung dai boss kho nhan o **Hac Phong Son**.

### Meo quan trong:
- Su dung **Dinh Than Thuat** ngay khi boss chuan bi phong hoa kiem.
- Ne don cuon loc xoay bang cach lui ve phia sau va nhay dung nhip.
- Trang bi phap bao *Ti Hoa Trao* de mien nhiem toan bo sat thuong lua!

```python
# Ti le chien thang khi dung Ti Hoa Trao
win_rate = 99.9
print(f"Chien thang: {win_rate}%")
```
"""
        guide1 = GameGuide(
            title="Cach khac che Hac Phong Dai Vuong khong mat mau",
            game_tag="Black Myth: Wukong",
            body_md=guide1_md,
            body_html=render_markdown(guide1_md),
            author_id=u2.id
        )

        guide2_md = """## Top 3 vu khi manh nhat dau game Elden Ring
Danh cho cac game thu moi buoc chan vao vung dat **Lands Between**:
1. **Bloodhound's Fang** (Dai kiem chay mau cuc manh)
2. **Uchigatana** (Katana chem nhanh)
3. **Moonveil** (Thanh kiem phep thuat ba dao he INT)

*Chuc cac Tarnished som tro thanh Elden Lord!*
"""
        guide2 = GameGuide(
            title="Cam nang chon vu khi manh nhat cho tan thu Elden Ring",
            game_tag="Elden Ring",
            body_md=guide2_md,
            body_html=render_markdown(guide2_md),
            author_id=u1.id
        )

        guide3_md = """## Huong dan Lineup Recon Dart Sova map Ascent
Hoc cach ban ten soi map tu A sang B cuc chuan xac chi voi 2 vach luc.
"""
        guide3 = GameGuide(
            title="Tuyet chieu Sova Recon Dart map Ascent dinh cao",
            game_tag="Valorant",
            body_md=guide3_md,
            body_html=render_markdown(guide3_md),
            author_id=u3.id
        )

        db.session.add_all([guide1, guide2, guide3])

        # Danh gia game mau
        rev1_md = "Do hoa **Unreal Engine 5** qua man nhan, co che bien hinh thu vi. Xung dang 10/10!"
        rev1 = GameReview(
            game_id=g1.id,
            author_id=u1.id,
            rating=5,
            body_md=rev1_md,
            body_html=render_markdown(rev1_md, allowed_tags=REVIEW_ALLOWED_TAGS)
        )
        db.session.add(rev1)

        db.session.commit()
        print("\n===> HOAN TAT SEED DU LIEU GAMEHUB THANH CONG! <===")
        print("Tai khoan demo:")
        print("  - faker_god (Admin / Follows: wukong_fan)")
        print("  - wukong_fan (Reviewer / Tac gia cam nang Wukong)")
        print("  - pro_gamer (Gamer / Follows: faker_god, wukong_fan)")

if __name__ == "__main__":
    seed()
