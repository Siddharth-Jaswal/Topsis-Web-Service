import os
from flask import Blueprint, request, jsonify, current_app
from services.email_service import is_valid_email
from services.topsis_service import parse_weights, parse_impacts
from services.topsis_service import run_topsis
import uuid


topsis_api = Blueprint("topsis_api", __name__, url_prefix="/api/topsis")


@topsis_api.route("/run", methods=["POST"])
def run_topsis_api():

    # 1️⃣ File validation
    if "file" not in request.files:
        return jsonify({"status": "error", "message": "CSV file is required"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"status": "error", "message": "No file selected"}), 400

    if not file.filename.endswith(".csv"):
        return jsonify({"status": "error", "message": "Only CSV files are allowed"}), 400

    # 2️⃣ Form fields
    weights_str = request.form.get("weights")
    impacts_str = request.form.get("impacts")
    email = request.form.get("email")

    if not all([weights_str, impacts_str, email]):
        return jsonify({
            "status": "error",
            "message": "weights, impacts, and email are required"
        }), 400

    # 3️⃣ Email validation
    if not is_valid_email(email):
        return jsonify({
            "status": "error",
            "message": "Invalid email format"
        }), 400

    # 4️⃣ Parse weights & impacts
    try:
        weights = parse_weights(weights_str)
        impacts = parse_impacts(impacts_str)
    except ValueError as e:
        return jsonify({"status": "error", "message": str(e)}), 400

    if len(weights) != len(impacts):
        return jsonify({
            "status": "error",
            "message": "Number of weights must match number of impacts"
        }), 400

    # 5️⃣ Save file
    upload_path = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        file.filename
    )
    file.save(upload_path)

    # 6️⃣ Run TOPSIS
    result_filename = f"result_{uuid.uuid4().hex}.csv"
    result_path = os.path.join(
        current_app.config["RESULT_FOLDER"],
        result_filename
    )

    try:
        run_topsis(
            upload_path,
            result_path,
            weights,
            impacts
        )
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"TOPSIS failed: {str(e)}"
        }), 500

    return jsonify({
        "status": "success",
        "message": "TOPSIS completed successfully",
        "result_file": result_filename
    }), 200
