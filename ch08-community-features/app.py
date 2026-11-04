# app.py
import os
from flask import Flask, render_template, redirect, url_for, request, flash, make_response
from flask_bootstrap import Bootstrap
from flask_login import LoginManager, login_required, current_user, login_user, logout_user

from models import db, User, Role, Game, GameGuide, GameReview, GuideComment, Follow, Permission
from utils import render_markdown, REVIEW_ALLOWED_TAGS
from decorators import permission_required

basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "instance", "gamehub.db")

app = Flask(__name__)
Bootstrap(app)
app.config["SECRET_KEY"] = "gamehub-secret-key-2026"
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- Đăng nhập / Đăng ký riêng ---
@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("home"))
    if request.method == "POST":
        username_or_email = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()
        if user and user.check_password(password):
            login_user(user)
            flash(f"Đăng nhập thành công! Chào mừng {user.username}.")
            return redirect(url_for("home"))
        else:
            flash("Tên đăng nhập hoặc mật khẩu không chính xác!")
    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("home"))
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        role_name = request.form.get("role", "Gamer")
        
        if not username or not email or not password:
            flash("Vui lòng điền đầy đủ tất cả các trường!")
            return redirect(url_for("register"))
            
        if User.query.filter_by(username=username).first():
            flash("Tên tài khoản này đã được sử dụng!")
            return redirect(url_for("register"))
            
        if User.query.filter_by(email=email).first():
            flash("Email này đã được đăng ký tài khoản khác!")
            return redirect(url_for("register"))
            
        role = Role.query.filter_by(name=role_name).first()
        if not role:
            role = Role.query.filter_by(name="Gamer").first()
            
        new_user = User(username=username, email=email, role=role)
        new_user.set_password(password)
        db.session.add(new_user)
        try:
            db.session.commit()
            login_user(new_user)
            flash(f"Tạo tài khoản thành công! Chào mừng game thủ {username}.")
            return redirect(url_for("home"))
        except Exception:
            db.session.rollback()
            flash("Có lỗi khi lưu tài khoản vào cơ sở dữ liệu.")
            return redirect(url_for("register"))
            
    return render_template("register.html")

# --- Quick login phục vụ demo (như bài lớp) ---
@app.route("/quick-login/<username>")
def quick_login(username):
    user = User.query.filter_by(username=username).first_or_404()
    login_user(user)
    flash(f"Đã đăng nhập nhanh với tài khoản game thủ: {username}")
    return redirect(request.referrer or url_for("home"))

@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Bạn đã đăng xuất khỏi GameHub.")
    return redirect(url_for("home"))

# --- 1. Trang chủ cá nhân hóa bằng Cookie ---
@app.route("/")
def home():
    show_param = request.args.get("show")
    if show_param in ("followed", "all"):
        show_followed = (show_param == "followed")
    else:
        show_followed = request.cookies.get("show_followed", "0") == "1"

    if current_user.is_authenticated and show_followed:
        guides = current_user.followed_posts.all()
    else:
        guides = GameGuide.query.order_by(GameGuide.created_at.desc()).all()

    recent_games = Game.query.limit(4).all()
    resp = make_response(render_template("home.html", guides=guides, show_followed=show_followed, recent_games=recent_games))
    if show_param in ("followed", "all"):
        resp.set_cookie("show_followed", "1" if show_followed else "0", max_age=30 * 24 * 3600)
    return resp

# --- 2. Profile & Follow game thủ khác ---
@app.route("/gamers/<username>")
def profile(username):
    user = User.query.filter_by(username=username).first_or_404()
    is_following = current_user.is_authenticated and current_user.is_following(user)
    followers_count = Follow.query.filter_by(followed_id=user.id).count()
    following_count = Follow.query.filter_by(follower_id=user.id).count()
    user_guides = GameGuide.query.filter_by(author_id=user.id).order_by(GameGuide.created_at.desc()).all()
    return render_template("profile.html", user=user, is_following=is_following,
                           followers_count=followers_count, following_count=following_count,
                           user_guides=user_guides)

@app.route("/gamers/<username>/follow", methods=["POST"])
@login_required
def toggle_follow(username):
    user = User.query.filter_by(username=username).first_or_404()
    if user.id == current_user.id:
        flash("Bạn không thể tự follow chính mình.")
        return redirect(url_for("profile", username=username))
    if current_user.is_following(user):
        current_user.unfollow(user)
        flash(f"Đã hủy theo dõi {username}.")
    else:
        current_user.follow(user)
        flash(f"Đã theo dõi {username}!")
    db.session.commit()
    return redirect(url_for("profile", username=username))

# --- 3. CMS Cẩm nang / Tin tức Game (Phân trang) ---
@app.route("/guides")
def guide_list():
    page = request.args.get("page", 1, type=int)
    tag = request.args.get("tag")
    query = GameGuide.query
    if tag:
        query = query.filter_by(game_tag=tag)
    guides = query.order_by(GameGuide.created_at.desc()).paginate(page=page, per_page=4, error_out=False)
    all_tags = db.session.query(GameGuide.game_tag).distinct().all()
    all_tags = [t[0] for t in all_tags]
    return render_template("guide_list.html", guides=guides, current_tag=tag, all_tags=all_tags)

@app.route("/guides/<int:id>")
def guide_detail(id):
    guide = GameGuide.query.get_or_404(id)
    return render_template("guide_detail.html", guide=guide)

# --- 4. Bình luận dưới cẩm nang (Comment System) ---
@app.route("/guides/<int:id>/comments", methods=["POST"])
@login_required
def add_guide_comment(id):
    guide = GameGuide.query.get_or_404(id)
    body_md = request.form.get("body_md", "").strip()
    if not body_md:
        flash("Nội dung bình luận không được để trống!")
        return redirect(url_for("guide_detail", id=id))
    # Sanitize Markdown với whitelist an toàn chống XSS
    body_html = render_markdown(body_md, allowed_tags=REVIEW_ALLOWED_TAGS)
    comment = GuideComment(guide_id=guide.id, author_id=current_user.id, body_md=body_md, body_html=body_html)
    db.session.add(comment)
    db.session.commit()
    flash("Đã đăng bình luận thành công!")
    return redirect(url_for("guide_detail", id=id))

@app.route("/guides/new", methods=["GET", "POST"])
@login_required
@permission_required(Permission.CREATE_POST)
def guide_new():
    if request.method == "POST":
        title = request.form.get("title")
        game_tag = request.form.get("game_tag")
        body_md = request.form.get("body_md", "")
        body_html = render_markdown(body_md)
        guide = GameGuide(title=title, game_tag=game_tag, body_md=body_md, body_html=body_html, author_id=current_user.id)
        db.session.add(guide)
        db.session.commit()
        flash("Đã đăng tải cẩm nang game mới thành công!")
        return redirect(url_for("guide_detail", id=guide.id))
    games = Game.query.all()
    return render_template("guide_new.html", games=games)

# --- 5. Danh sách Game & Đánh giá Game (Sanitize Markdown) ---
@app.route("/games")
def game_list():
    games = Game.query.all()
    return render_template("game_list.html", games=games)

@app.route("/games/<int:game_id>/reviews", methods=["GET", "POST"])
def game_reviews(game_id):
    game = Game.query.get_or_404(game_id)
    if request.method == "POST":
        if not current_user.is_authenticated:
            flash("Vui lòng đăng nhập để gửi đánh giá!")
            return redirect(url_for("quick_login", username="faker_god"))
        body_md = request.form.get("body_md", "").strip()
        if not body_md:
            flash("Nội dung đánh giá không được để trống!")
            return redirect(url_for("game_reviews", game_id=game.id))
        rating = int(request.form.get("rating", 5))
        # Sanitize với thẻ giới hạn
        body_html = render_markdown(body_md, allowed_tags=REVIEW_ALLOWED_TAGS)
        review = GameReview(game_id=game.id, author_id=current_user.id, rating=rating, body_md=body_md, body_html=body_html)
        db.session.add(review)
        db.session.commit()
        flash("Đã đăng đánh giá game thành công!")
        return redirect(url_for("game_reviews", game_id=game.id))

    reviews = GameReview.query.filter_by(game_id=game.id).order_by(GameReview.created_at.desc()).all()
    return render_template("game_reviews.html", game=game, reviews=reviews)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        Role.insert_roles()
    app.run(debug=True)
