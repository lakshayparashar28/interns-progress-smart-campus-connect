from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, CheckoutMessage, User, Post, YourCart

checkout_bp = Blueprint("checkout", __name__)

    
@checkout_bp.route("/api/checkout", methods=["POST"])
@login_required
def save_checkout():
    data = request.json
    print("Received checkout data:", data)  # Debug print

    try:
        msg = CheckoutMessage(
            post_id=data["post_id"],
            user_id=current_user.id,
            name=data["name"],
            phone=data["phone"],
            address=data["address"],
            message=data.get("message", ""),
            email=current_user.email,
            seen=False
        )
        db.session.add(msg)

        # ✅ Fix: prevent autoflush error by wrapping the query
        with db.session.no_autoflush:
            cart_item = YourCart.query.filter_by(user_id=current_user.id, post_id=data["post_id"]).first()
            if cart_item:
                db.session.delete(cart_item)

        db.session.commit()
        return jsonify({"message": "Message sent to seller and item removed from cart."}), 201

    except Exception as e:
        db.session.rollback()
        print("Checkout Error:", str(e))  # Debug print
        return jsonify({"error": str(e)}), 500

    
@checkout_bp.route("/api/yourorders", methods=["GET"])
@login_required
def get_user_orders():
    messages = CheckoutMessage.query.filter_by(user_id=current_user.id).all()

    orders = []
    for msg in messages:
        post = Post.query.get(msg.post_id)
        if post:
            orders.append({
                "id": msg.id,
                "post_id": post.id,
                "post_title": post.title,
                "post_price": post.price,
                "post_image": post.image,  # This will be used in YourOrders.jsx
                "name": msg.name,
                "phone": msg.phone,
                "address": msg.address,
                "message": msg.message,
                "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M")
            })

    return jsonify(orders), 200

@checkout_bp.route("/api/unseen-messages", methods=["GET"])
@login_required
def get_unseen_messages_count():
    post_ids = [p.id for p in Post.query.filter_by(user_id=current_user.id)]
    count = CheckoutMessage.query.filter(
        CheckoutMessage.post_id.in_(post_ids),
        CheckoutMessage.seen == False
    ).count()
    return jsonify({"count": count})


@checkout_bp.route("/api/messages-for-youritems", methods=["GET"])
@login_required
def get_messages_for_items():
    posts = Post.query.filter_by(user_id=current_user.id).all()
    data = []
    for post in posts:
        messages = CheckoutMessage.query.filter_by(post_id=post.id).all()
        data.append({
            "post_id": post.id,
            "messages": [{
                "id": m.id,
                "name": m.name,
                "phone": m.phone,
                "address": m.address,
                "message": m.message,
                "timestamp": m.timestamp.strftime("%Y-%m-%d %H:%M")
            } for m in messages]
        })
    return jsonify(data)

@checkout_bp.route("/api/messages/mark-seen", methods=["POST"])
@login_required
def mark_messages_as_seen():
    from app.models import CheckoutMessage, Post

    # Get all posts listed by this user
    post_ids = [p.id for p in Post.query.filter_by(user_id=current_user.id)]

    # Update all unseen messages
    CheckoutMessage.query.filter(
        CheckoutMessage.post_id.in_(post_ids),
        CheckoutMessage.seen == False
    ).update({CheckoutMessage.seen: True}, synchronize_session=False)

    db.session.commit()
    return jsonify({"message": "Messages marked as seen"})

@checkout_bp.route("/api/messages-for-youritems/<int:post_id>", methods=["GET"])
@login_required
def get_messages_for_single_item(post_id):
    from app.models import Post, CheckoutMessage

    # Ensure the current user owns the item
    post = Post.query.filter_by(id=post_id, user_id=current_user.id).first()
    if not post:
        return jsonify({"error": "Item not found or unauthorized"}), 404

    # Get all messages for that post
    messages = CheckoutMessage.query.filter_by(post_id=post_id).order_by(
        CheckoutMessage.timestamp.desc()
    ).all()

    return jsonify([
        {
            "id": msg.id,
            "name": msg.name,
            "phone": msg.phone,
            "address": msg.address,
            "message": msg.message,
            "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M"),
            "seen": msg.seen
        }
        for msg in messages
    ])
