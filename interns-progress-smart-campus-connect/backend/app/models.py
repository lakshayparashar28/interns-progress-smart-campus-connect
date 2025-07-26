from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from flask_login import current_user
from PIL import Image
import os
from datetime import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__="Users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100),unique=False, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

    def __repr__(self):
        return f'<User {self.email}>'
    
class Post(UserMixin, db.Model):
    __tablename__ = "AllPost"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String, nullable=False)
    image = db.Column(db.String(300), nullable=True)  # relative path e.g. "uploads/img.jpg"
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    rent = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('posts', lazy=True))

    def __init__(self, title, description, timestamp, image, rent, price, category, user_id=None):
        self.title = title
        self.description = description
        self.category = category
        self.timestamp = datetime.utcnow()
        self.image = image
        self.rent = rent
        self.price = price
        if user_id is not None:
            self.user_id = user_id
        elif hasattr(current_user, "id") and current_user.is_authenticated:
            self.user_id = current_user.id

    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'static', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

    @classmethod
    def allowed_file(cls, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in cls.ALLOWED_EXTENSIONS

    @classmethod
    def save_image(cls, file, filename):
        if cls.allowed_file(filename):
            os.makedirs(cls.UPLOAD_FOLDER, exist_ok=True)
            filepath = os.path.join(cls.UPLOAD_FOLDER, filename)
            image = Image.open(file)
            image.save(filepath)
            return os.path.join("uploads", filename)  
        return None


class YourCart(db.Model):
    __tablename__ = "YourCart"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("Users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("AllPost.id"), nullable=False)

    user = db.relationship("User", backref=db.backref("cart_items", lazy=True))
    post = db.relationship("Post", backref=db.backref("in_carts", lazy=True))


from datetime import datetime

class CheckoutMessage(db.Model):
    __tablename__ = "checkout_messages"

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey("AllPost.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("Users.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.Text, nullable=False)
    message = db.Column(db.Text)
    email = db.Column(db.String(120)) 
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    seen = db.Column(db.Boolean, default=False)

    post = db.relationship("Post", backref="checkout_messages")
    user = db.relationship("User", backref="checkout_messages")

    def __repr__(self):
        return f"<CheckoutMessage from {self.name} for Post {self.post_id}>"

