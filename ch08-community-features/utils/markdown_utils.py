# markdown_utils.py
import bleach
import markdown as md

# Whitelist cho bài viết cẩm nang (GameGuide)
ALLOWED_TAGS = [
    "p", "br", "strong", "em", "b", "i", "a", "ul", "ol", "li",
    "blockquote", "code", "pre", "h1", "h2", "h3", "table", "th", "tr", "td"
]
ALLOWED_ATTRS = {"a": ["href", "title", "rel"]}

# Whitelist giới hạn cho đánh giá (GameReview)
REVIEW_ALLOWED_TAGS = ["p", "br", "strong", "em", "b", "i", "code", "a"]

def render_markdown(raw_md, allowed_tags=None):
    tags = allowed_tags or ALLOWED_TAGS
    # 1. Chuyển Markdown sang HTML
    html = md.markdown(raw_md or "", extensions=["fenced_code", "tables"])
    # 2. Dùng bleach lọc bỏ triệt để các script/tag nguy hiểm
    clean_html = bleach.clean(html, tags=tags, attributes=ALLOWED_ATTRS, strip=True)
    return clean_html