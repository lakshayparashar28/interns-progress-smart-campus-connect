from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from app.models import db, User


auth_bp = Blueprint("auth", __name__)

def has_required_fields(data, required_fields):
    return all(field in data and data[field] for field in required_fields)


@auth_bp.route("/api/register", methods=["GET","POST"])
def api_register():

    data = request.get_json()
    required_fields = ("name", "email", "password", "confirmPassword")
    if not has_required_fields(data, required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    if data["password"] != data["confirmPassword"]:
        return jsonify({"message": "Passwords do not match"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already registered"}), 409
    
    else:
        hashed_pw = generate_password_hash(data["password"])
        new_user = User(name=data["name"], email=data["email"], password=hashed_pw)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201
    
@auth_bp.route("/api/login", methods=['GET' ,'POST'])
def api_login():
    data = request.get_json()
    required_fields = ("email", "password")
    if not has_required_fields(data, required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    email = data["email"]
    password = data["password"]
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials, please try again."}), 401

@auth_bp.route("/api/logout", methods=["POST"])
@login_required
def api_logout():
    print("User is being logged out:", current_user.id)
    logout_user()
    return jsonify({"message": "Logout successful"}), 200


@auth_bp.route("/api/home", methods=["GET"])
@login_required
def api_home():
    return jsonify({"message": f"Welcome, {current_user.id}!"}), 200


@auth_bp.before_app_request
def session_timeout():
    session.permanent = False