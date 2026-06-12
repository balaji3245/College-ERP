from app import create_app
from models.user import User
from models.department import Department
from models.course import Course
from models.student import Student
from models.teacher import Teacher
from models.attendance import Attendance
from models.fee import Fee
from models.result import Result
from models.document import Document
import random
from datetime import datetime, timedelta

app = create_app()

def seed_data():
    with app.app_context():
        # Clear existing data (for clean seed)
        User.objects.delete()
        Department.objects.delete()
        Course.objects.delete()
        Student.objects.delete()
        Teacher.objects.delete()
        Attendance.objects.delete()
        Fee.objects.delete()
        Result.objects.delete()
        Document.objects.delete()

        print("Seeding Users...")
        admin = User(email="admin@college.edu", name="System Admin", role="admin")
        admin.set_password("admin123")
        admin.save()
        
        teacher_user = User(email="teacher@college.edu", name="Teacher User", role="teacher", linked_id="TCH001")
        teacher_user.set_password("teacher123")
        teacher_user.save()
        
        student_user = User(email="student@college.edu", name="Student User", role="student", linked_id="STU001")
        student_user.set_password("student123")
        student_user.save()

        print("Seeding Departments...")
        depts = [
            Department(dept_id="D001", name="Computer Science & Engineering", short_name="CSE", hod="Dr. Alan Turing"),
            Department(dept_id="D002", name="Mechanical Engineering", short_name="MECH", hod="Dr. Henry Ford"),
            Department(dept_id="D003", name="Electrical Engineering", short_name="EEE", hod="Dr. Nikola Tesla"),
            Department(dept_id="D004", name="Civil Engineering", short_name="CIVIL", hod="Dr. Karl Terzaghi"),
            Department(dept_id="D005", name="Information Technology", short_name="IT", hod="Dr. Tim Berners-Lee"),
        ]
        for d in depts: d.save()

        print("Seeding Courses...")
        courses = [
            Course(course_id="C001", name="B.Tech Computer Science", department_id="D001", duration="4 Years"),
            Course(course_id="C002", name="B.Tech Mechanical", department_id="D002", duration="4 Years"),
            Course(course_id="C003", name="B.Tech Electrical", department_id="D003", duration="4 Years"),
            Course(course_id="C004", name="B.Tech Civil", department_id="D004", duration="4 Years"),
            Course(course_id="C005", name="B.Tech Information Tech", department_id="D005", duration="4 Years"),
            Course(course_id="C006", name="M.Tech Computer Science", department_id="D001", duration="2 Years"),
        ]
        for c in courses: c.save()

        print("Seeding Teachers...")
        teachers_data = [
            ("TCH001", "Alan", "Turing", "D001", "Professor", "Ph.D in CS", "AI & Computing"),
            ("TCH002", "Ada", "Lovelace", "D001", "Associate Professor", "Ph.D in CS", "Algorithms"),
            ("TCH003", "Nikola", "Tesla", "D003", "Professor", "Ph.D in EE", "Power Systems"),
            ("TCH004", "Henry", "Ford", "D002", "Professor", "Ph.D in Mech", "Automobile"),
            ("TCH005", "Karl", "Terzaghi", "D004", "Professor", "Ph.D in Civil", "Geotech"),
            ("TCH006", "Tim", "Berners-Lee", "D005", "Professor", "Ph.D in IT", "Web Technologies"),
            ("TCH007", "Grace", "Hopper", "D001", "Assistant Professor", "M.Tech in CS", "Compilers"),
            ("TCH008", "Marie", "Curie", "D003", "Professor", "Ph.D in Science", "Materials")
        ]
        for tid, fn, ln, did, desig, qual, spec in teachers_data:
            t = Teacher(teacher_id=tid, first_name=fn, last_name=ln, department_id=did, designation=desig, qualification=qual, specialization=spec, email=f"{fn.lower()}@college.edu", phone="9876543210")
            t.save()

        print("Seeding Students...")
        students_data = [
            ("STU001", "2025001", "Rahul", "Sharma", "D001", "C001", 3),
            ("STU002", "2025002", "Priya", "Patel", "D002", "C002", 3),
            ("STU003", "2025003", "Amit", "Kumar", "D003", "C003", 1),
            ("STU004", "2025004", "Neha", "Singh", "D004", "C004", 5),
            ("STU005", "2025005", "Rohan", "Gupta", "D005", "C005", 7),
            ("STU006", "2025006", "Anjali", "Desai", "D001", "C001", 3),
            ("STU007", "2025007", "Vikram", "Malhotra", "D002", "C002", 1),
            ("STU008", "2025008", "Sneha", "Reddy", "D001", "C006", 1),
            ("STU009", "2025009", "Karan", "Joshi", "D003", "C003", 3),
            ("STU010", "2025010", "Pooja", "Verma", "D004", "C004", 5),
            ("STU011", "2025011", "Arjun", "Nair", "D001", "C001", 5),
            ("STU012", "2025012", "Meera", "Chauhan", "D005", "C005", 3),
        ]
        students_objects = []
        for sid, rn, fn, ln, did, cid, sem in students_data:
            s = Student(student_id=sid, roll_number=rn, first_name=fn, last_name=ln, email=f"{fn.lower()}@college.edu", department_id=did, course_id=cid, semester=sem)
            s.save()
            students_objects.append(s)

        print("Seeding Attendance...")
        statuses = ["Present", "Present", "Present", "Present", "Absent", "Late"]
        for student in students_objects:
            for day in range(1, 15):
                date_str = (datetime.now() - timedelta(days=day)).strftime("%Y-%m-%d")
                a = Attendance(student_id=student.student_id, date=date_str, status=random.choice(statuses), subject="Data Structures", marked_by="TCH001")
                a.save()

        print("Seeding Fees...")
        for i, student in enumerate(students_objects):
            amount = 50000.0 if student.course_id != "C006" else 75000.0
            paid = amount if i % 3 == 0 else (amount / 2 if i % 2 == 0 else 0)
            status = "Paid" if paid == amount else ("Partial" if paid > 0 else "Unpaid")
            f = Fee(invoice_number=f"INV-2025-{student.student_id}", student_id=student.student_id, amount=amount, paid_amount=paid, category="Tuition Fee", status=status, due_date="2025-12-31")
            f.save()

        print("Seeding Results...")
        subjects = ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "Database Systems"]
        for student in students_objects:
            if student.department_id == "D001":
                for sub in subjects:
                    internal = random.randint(15, 30)
                    external = random.randint(30, 70)
                    total = internal + external
                    grade = "A+" if total >= 90 else ("A" if total >= 80 else ("B+" if total >= 70 else ("B" if total >= 60 else ("C" if total >= 50 else "F"))))
                    r = Result(student_id=student.student_id, semester=student.semester, subject=sub, internal_marks=internal, external_marks=external, total_marks=total, grade=grade, status="Pass" if total >= 40 else "Fail", academic_year="2024-2025")
                    r.save()

        print("Seeding Documents...")
        doc_types = ["Aadhaar Card", "10th Marksheet", "12th Marksheet"]
        for student in students_objects:
            for dt in doc_types:
                d = Document(student_id=student.student_id, name=dt, type=dt, file_path=f"/uploads/{student.student_id}_{dt.replace(' ', '_')}.pdf", status="Verified")
                d.save()

        print("Database Seeded Successfully with Rich Data!")

if __name__ == '__main__':
    seed_data()
