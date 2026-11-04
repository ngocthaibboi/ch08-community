# models.py
import hashlib
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# 1. Định nghĩa Bitwise Permission
class Permission:
    VIEW = 1        # Xem thông tin game, bài viết
    REVIEW = 2      # Đánh giá game, bình luận
    CREATE_POST = 4 # Viết bài cẩm nang / tin tức (Reviewer, Creator)
    MODERATE = 8    # Kiểm duyệt nội dung
    ADMIN = 16      # Toàn quyền quản trị

# 2. Bảng Phân quyền Role
class Role(db.Model):
    __tablename__ = "roles"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode(30), unique=True, nullable=False)
    permissions = db.Column(db.Integer, nullable=False, default=0)
    users = db.relationship("User", back_populates="role")

    def add_permission(self, perm):
        if not self.has_permission(perm):
            self.permissions += perm

    def has_permission(self, perm):
        return (self.permissions & perm) == perm

    @staticmethod
    def insert_roles():
        roles = {
            "Gamer": (Permission.VIEW | Permission.REVIEW, True),
            "Reviewer": (Permission.VIEW | Permission.REVIEW | Permission.CREATE_POST, False),
            "Admin": (Permission.VIEW | Permission.REVIEW | Permission.CREATE_POST |
                      Permission.MODERATE | Permission.ADMIN, False),
        }
        for name, (perms, is_default) in roles.items():
            role = Role.query.filter_by(name=name).first()
            if role is None:
                role = Role(name=name)
            role.permissions = perms
            db.session.add(role)
        db.session.commit()

# 3. Bảng Người dùng & Mạng lưới Follow
class Follow(db.Model):
    __tablename__ = "follows"
    follower_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    followed_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Unicode(120), unique=True, nullable=False, index=True)
    username = db.Column(db.Unicode(50), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.Unicode(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"))
    role = db.relationship("Role", back_populates="users")

    def can(self, perm):
        return self.role is not None and self.role.has_permission(perm)

    def is_admin(self):
        return self.can(Permission.ADMIN)

    # Avatar qua Gravatar
    def gravatar_url(self, size=80):
        email_hash = hashlib.md5(self.email.strip().lower().encode("utf-8")).hexdigest()
        return f"https://www.gravatar.com/avatar/{email_hash}?d=identicon&s={size}"

    # Quan hệ Follow
    def follow(self, user):
        if not self.is_following(user) and user.id != self.id:
            db.session.add(Follow(follower_id=self.id, followed_id=user.id))

    def unfollow(self, user):
        f = Follow.query.filter_by(follower_id=self.id, followed_id=user.id).first()
        if f:
            db.session.delete(f)

    def is_following(self, user):
        return Follow.query.filter_by(follower_id=self.id, followed_id=user.id).first() is not None

    # Lọc các cẩm nang của người mình follow
    @property
    def followed_posts(self):
        return (GameGuide.query
                .join(Follow, Follow.followed_id == GameGuide.author_id)
                .filter(Follow.follower_id == self.id)
                .order_by(GameGuide.created_at.desc()))

    def set_password(self, raw_password):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password_hash, raw_password)

# 4. Bảng Tựa Game (Game)
class Game(db.Model):
    __tablename__ = "games"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Unicode(200), nullable=False, index=True)
    genre = db.Column(db.Unicode(50), nullable=False)          # RPG, FPS, MOBA, Action...
    platform = db.Column(db.Unicode(50), default="PC/Console") # PC, PS5, Switch
    description = db.Column(db.UnicodeText, nullable=True)

    reviews = db.relationship("GameReview", back_populates="game", cascade="all, delete-orphan")

# 5. Bảng Cẩm nang / Tin tức (GameGuide - CMS chính)
class GameGuide(db.Model):
    __tablename__ = "game_guides"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Unicode(200), nullable=False)
    game_tag = db.Column(db.Unicode(50), nullable=False)       # Tên game liên quan
    body_md = db.Column(db.UnicodeText, nullable=False)        # Markdown gốc
    body_html = db.Column(db.UnicodeText, nullable=False)      # HTML đã sanitize
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    author = db.relationship("User", foreign_keys=[author_id])

# 6. Bảng Bình luận dưới Cẩm nang (GuideComment - Chức năng thảo luận)
class GuideComment(db.Model):
    __tablename__ = "guide_comments"
    id = db.Column(db.Integer, primary_key=True)
    guide_id = db.Column(db.Integer, db.ForeignKey("game_guides.id"), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    body_md = db.Column(db.UnicodeText, nullable=False)
    body_html = db.Column(db.UnicodeText, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    guide = db.relationship("GameGuide", backref=db.backref("comments", order_by="GuideComment.created_at.desc()", cascade="all, delete-orphan"))
    author = db.relationship("User", foreign_keys=[author_id])

# 7. Bảng Đánh giá Game (GameReview - Comment gắn với Game)
class GameReview(db.Model):
    __tablename__ = "game_reviews"
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey("games.id"), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    rating = db.Column(db.Integer, default=5)                 # 1 - 5 sao
    body_md = db.Column(db.UnicodeText, nullable=False)
    body_html = db.Column(db.UnicodeText, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    game = db.relationship("Game", back_populates="reviews")
    author = db.relationship("User", foreign_keys=[author_id])
