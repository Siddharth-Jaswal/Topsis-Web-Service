from flask import Blueprint, request, jsonify

topsis_api = Blueprint("topsis_api", __name__, url_prefix="/api/topsis")


@topsis_api.route("/run", methods=["POST"])
def run_topsis():
    return jsonify({
        "status": "success",
        "message": "TOPSIS API placeholder"
    }), 200
