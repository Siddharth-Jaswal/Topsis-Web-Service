from flask import Flask
from dotenv import load_dotenv
from api.topsis_api import topsis_api

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["UPLOAD_FOLDER"] = "backend/uploads"
    app.config["RESULT_FOLDER"] = "backend/results"

    app.register_blueprint(topsis_api)

    @app.route("/health", methods=["GET"])
    def health_check():
        return {"status": "ok"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
