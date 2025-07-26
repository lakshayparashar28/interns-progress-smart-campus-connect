from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
from app.models import db, User, Post, YourCart


def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='/static')

    # Basic config
    app.config['SECRET_KEY'] = 'campus_connect'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///CampusConnect_Database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Proper CORS setup for React frontend (localhost:5173)
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    @app.after_request
    def apply_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,DELETE,PUT,OPTIONS"
        return response

    # Initialize SQLAlchemy
    db.init_app(app)

    # Flask-Login setup
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = "login"

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"message": "Unauthorized"}), 401

    # Register blueprints
    from app.auth.routes import auth_bp
    from app.listings.routes import listings_bp
    from app.listings.image_utils import imagedisplay
    from app.search.search import search
    from app.checkout.buyerinfo import checkout_bp  # ✅ make sure correct path

    app.register_blueprint(auth_bp)
    app.register_blueprint(listings_bp)
    app.register_blueprint(imagedisplay)
    app.register_blueprint(search)
    app.register_blueprint(checkout_bp)

    return app


if __name__ == "__main__":
    app = create_app()

    # Ensure all DB tables exist
    with app.app_context():
        db.create_all()

    # Run the server
    app.run(debug=True)
