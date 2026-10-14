from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from . import db, login_manager

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Bảng người dùng & phân quyền (Thành viên 1 - Chapter 6 & 7)
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='MEMBER')  # ADMIN, STAFF, MEMBER
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Quan hệ 1-1 với Ví tiền
    wallet = db.relationship('Wallet', backref='user', uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Bảng Ví tiền (Thành viên 1)
class Wallet(db.Model):
    __tablename__ = 'wallets'
    id = db.Column(db.Integer, primary_key=True)
    balance = db.Column(db.Float, default=0.0)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)

# Bảng Dàn máy Cyber (Thành viên 2)
class Computer(db.Model):
    __tablename__ = 'computers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    zone = db.Column(db.String(50), nullable=False)  # VIP, Standard, Stream
    cpu = db.Column(db.String(100))
    vga = db.Column(db.String(100))
    hourly_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='AVAILABLE')  # AVAILABLE, OCCUPIED, MAINTENANCE