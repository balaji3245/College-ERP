from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models.student import Student
from models.teacher import Teacher
from models.department import Department
from models.course import Course

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    total_students = Student.objects.count()
    total_teachers = Teacher.objects.count()
    total_departments = Department.objects.count()
    total_courses = Course.objects.count()

    stats = {
        'totalStudents': total_students,
        'totalTeachers': total_teachers,
        'totalDepartments': total_departments,
        'totalCourses': total_courses,
        'activeClasses': 42, # Mock for now
        'todayAttendance': 92, # Mock for now
    }

    return jsonify(stats)
