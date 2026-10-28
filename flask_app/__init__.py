import os
from flask import Flask, render_template  # <-- Thêm render_template vào đây
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret')
    
    # Kết nối Database Supabase qua SQLAlchemy
    db_url = os.getenv('DATABASE_URL')
    if db_url and db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    # ROUTE TRANG CHỦ (Landing Page)
    @app.route('/')
    def index():
        return render_template('index.html')

    # Đăng ký Blueprint cho Thành viên 1
    from flask_app.blueprints.auth.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    with app.app_context():
        from . import models
        db.create_all()

    return app