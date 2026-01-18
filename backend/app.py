from flask import Flask
from dotenv import load_dotenv
from api.topsis_api import topsis_api
from flask_cors import CORS


import os

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, "uploads")
    app.config["RESULT_FOLDER"] = os.path.join(BASE_DIR, "results")

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(app.config["RESULT_FOLDER"], exist_ok=True)

    app.register_blueprint(topsis_api)

    @app.route("/health", methods=["GET"])
    def health_check():
        return {"status": "ok"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
