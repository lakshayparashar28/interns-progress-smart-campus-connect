from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from flask_login import login_required, current_user
from app.models import db, Post, YourCart
from datetime import datetime
import os
from sqlalchemy import or_

search = Blueprint("searchitems",__name__)

@search.route("/api/search", methods=["GET"])
@login_required
def search_listings():
    search_term = request.args.get("q", "").lower()
    category = request.args.get("category", "").lower()

    query = Post.query.filter(Post.user_id != current_user.id)  # ✅ exclude self items

    if search_term:
        query = query.filter(or_(
            Post.title.ilike(f"%{search_term}%"),
            Post.description.ilike(f"%{search_term}%")
        ))

    if category:
        query = query.filter(Post.category.ilike(category))

    posts = query.order_by(Post.timestamp.desc()).all()

    results = []
    for post in posts:
        results.append({
            "id": post.id,
            "title": post.title,
            "description": post.description,
            "category": post.category,
            "price": post.price,
            "status": "available",
            "image": f"http://localhost:5000/static/uploads/{post.image}" if post.image else None
        })

    return jsonify(results), 200