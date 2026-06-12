import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import init_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Extensions
    CORS(app)
    init_db(app)
    jwt = JWTManager(app)

    # Import and Register Blueprints (Routes)
    from routes.auth import auth_bp
    from routes.students import students_bp
    from routes.dashboard import dashboard_bp
    from routes.departments import departments_bp
    from routes.teachers import teachers_bp
    from routes.courses import courses_bp
    from routes.fees import fees_bp
    from routes.attendance import attendance_bp
    from routes.results import results_bp
    from routes.documents import documents_bp
    from routes.analytics import analytics_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(departments_bp, url_prefix='/api/departments')
    app.register_blueprint(teachers_bp, url_prefix='/api/teachers')
    app.register_blueprint(courses_bp, url_prefix='/api/courses')
    app.register_blueprint(fees_bp, url_prefix='/api/fees')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    app.register_blueprint(results_bp, url_prefix='/api/results')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
