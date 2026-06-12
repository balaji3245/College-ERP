from . import db

class Fee(db.Document):
    meta = {'collection': 'fees'}

    invoice_number = db.StringField(required=True, unique=True, max_length=30) # INV-2025-001
    student_id = db.StringField(required=True, max_length=20)
    amount = db.FloatField(required=True)
    paid_amount = db.FloatField(default=0.0)
    category = db.StringField(required=True, max_length=100) # e.g. Tuition Fee
    due_date = db.StringField()
    payment_date = db.StringField()
    payment_mode = db.StringField(max_length=50)
    status = db.StringField(default='Pending', max_length=20) # Pending, Paid, Partial, Overdue
    receipt_no = db.StringField(max_length=50)

    def to_dict(self, student_name=None):
        return {
            'id': self.invoice_number,
            'invoiceNumber': self.invoice_number,
            'studentId': self.student_id,
            'studentName': student_name,
            'amount': self.amount,
            'paidAmount': self.paid_amount,
            'pendingAmount': self.amount - self.paid_amount,
            'category': self.category,
            'dueDate': self.due_date,
            'paymentDate': self.payment_date,
            'paymentMode': self.payment_mode,
            'status': self.status,
            'receiptNo': self.receipt_no
        }
