from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from flask_login import login_required, current_user
from app.models import db, Post, YourCart
from datetime import datetime
import os

listings_bp = Blueprint("listings", __name__)

UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/uploads'))
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Create a new listing
@listings_bp.route("/api/listings", methods=["POST"])
@login_required
def create_listing():
    title = request.form.get("title")
    description = request.form.get("description")
    category = request.form.get("category")
    rent = request.form.get("rent")
    price = request.form.get("price")
    image_file = request.files.get("image")

    if not all([title, description, category, price]):
        return jsonify({"message": "Missing required fields"}), 400

    filename = None
    if image_file and allowed_file(image_file.filename):
        try:
            filename = secure_filename(image_file.filename)
            image_path = os.path.join(UPLOAD_FOLDER, filename)
            image_file.save(image_path)
        except Exception as e:
            print("UPLOAD ERROR:", e)
            return jsonify({"message": f"Failed to save image: {str(e)}"}), 500
    

    new_post = Post(
        title=title,
        description=description,
        category=category,
        rent=rent,
        price=price,
        image=filename,
        timestamp=datetime.utcnow(),
        user_id=current_user.id
    )

    db.session.add(new_post)
    db.session.commit()

    return jsonify({"message": "Post created", "id": new_post.id}), 201

#  Get all listings for the logged-in user
@listings_bp.route("/api/youritems", methods=["GET"])
@login_required
def get_your_items():
    user_id = current_user.id
    posts = Post.query.filter_by(user_id=current_user.id).order_by(Post.timestamp.desc()).all()
    
    result = []
    for post in posts:
        result.append({
            "id": post.id,
            "title": post.title,
            "description": post.description,
            "price": post.price,
            "image": post.image,  
        })

    return jsonify(result), 200

#  Get a single listing

@listings_bp.route("/api/listings/<int:listing_id>", methods=["GET"])
@login_required
def get_listing(listing_id):
    post = Post.query.filter_by(id=listing_id).first() 
    if not post:
        return jsonify({"message": "Listing not found"}), 404

    return jsonify({
        "id": post.id,
        "title": post.title,
        "description": post.description,
        "category": post.category,
        "rent": post.rent,
        "price": post.price,
        "image": post.image
    }), 200





# Update an existing listing
@listings_bp.route("/api/listings/<int:listing_id>", methods=["PUT"])
@login_required
def update_listing(listing_id):
    post = Post.query.filter_by(id=listing_id, user_id=current_user.id).first()
    if not post:
        return jsonify({"message": "Listing not found"}), 404

    post.title = request.form.get("title")
    post.description = request.form.get("description")
    post.category = request.form.get("category")
    post.rent = request.form.get("rent")
    post.price = request.form.get("price")

    image_file = request.files.get("image")
    if image_file and allowed_file(image_file.filename):
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(image_path)
        post.image = filename

    db.session.commit()
    return jsonify({"message": "Listing updated"}), 200


# Delete a listing
@listings_bp.route("/api/listings/<int:listing_id>", methods=["DELETE"])
@login_required
def delete_listing(listing_id):
    post = Post.query.filter_by(id=listing_id, user_id=current_user.id).first()
    if not post:
        return jsonify({"message": "Listing not found"}), 404

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Listing deleted"}), 200



@listings_bp.route("/api/yourcart", methods=["GET"])
@login_required
def get_your_cart():
    cart_items = YourCart.query.filter_by(user_id=current_user.id).all()
    result = []
    for item in cart_items:
        post = item.post
        result.append({
            "id": post.id,
            "title": post.title,
            "description": post.description,
            "price": post.price,
            "image": f"http://localhost:5000/static/uploads/{post.image}" if post.image else None,
        })
    return jsonify(result), 200

@listings_bp.route("/api/yourcart/add", methods=["POST"])
@login_required
def add_to_your_cart():
    post_id = request.json.get("post_id")
    if not post_id:
        return jsonify({"message": "post_id is required"}), 400

    # Prevent duplicates
    existing = YourCart.query.filter_by(user_id=current_user.id, post_id=post_id).first()
    if existing:
        return jsonify({"message": "Item already in cart"}), 200

    item = YourCart(user_id=current_user.id, post_id=post_id)
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Item added to cart"}), 201


@listings_bp.route("/api/yourcart/remove", methods=["POST"])
@login_required
def remove_from_your_cart():
    post_id = request.json.get("post_id")
    item = YourCart.query.filter_by(user_id=current_user.id, post_id=post_id).first()
    if not item:
        return jsonify({"message": "Item not found in cart"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed from cart"}), 200
