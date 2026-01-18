from flask import Flask, send_from_directory
from dotenv import load_dotenv
from api.topsis_api import topsis_api
import os

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

def create_app():
    app = Flask(
        __name__,
        static_folder="static",
        static_url_path=""
    )

    app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, "uploads")
    app.config["RESULT_FOLDER"] = os.path.join(BASE_DIR, "results")

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(app.config["RESULT_FOLDER"], exist_ok=True)

    app.register_blueprint(topsis_api)

    # Serve React frontend
    @app.route("/")
    def serve_frontend():
        return send_from_directory(app.static_folder, "index.html")

    # Catch-all route (React routing safety)
    @app.route("/<path:path>")
    def static_proxy(path):
        file_path = os.path.join(app.static_folder, path)
        if os.path.exists(file_path):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, "index.html")

    return app


if __name__ == "__main__":
    app = create_app()
    
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
