import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, User, Phone, Users, GraduationCap, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

const steps = [
  { id: 1, label: 'Personal Details', icon: User },
  { id: 2, label: 'Contact Details', icon: Phone },
  { id: 3, label: 'Parent Details', icon: Users },
  { id: 4, label: 'Academic Details', icon: GraduationCap },
  { id: 5, label: 'Documents', icon: FileText },
];

function StepIndicator({ steps, currentStep }) {
  return (
    <div className="overflow-x-auto -mx-2 px-2 scrollbar-thin mb-6 sm:mb-8">
      <div className="flex items-end justify-start sm:justify-center gap-0 pb-2 min-w-max sm:min-w-0">
        {steps.map((step, idx) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold border-2 transition-all ${
                    done ? 'bg-primary-600 border-primary-600 text-white' :
                    active ? 'bg-white border-primary-600 text-primary-600' :
                    'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {done ? <Check size={14} /> : step.id}
                </div>
                <span className={`text-xs mt-1 whitespace-nowrap ${active ? 'text-primary-600 font-medium' : 'text-slate-400'}`}>{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-1 mb-4 ${done ? 'bg-primary-600' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormGroup({ label, children, required }) {
  return (
    <div className="form-group">
      <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

export default function AddStudentPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: '', dob: '', bloodGroup: '', nationality: 'Indian',
    phone: '', alternatePhone: '', email: '', address: '', city: '', state: '', pincode: '',
    fatherName: '', fatherOccupation: '', fatherPhone: '',
    motherName: '', motherOccupation: '', motherPhone: '',
    guardianName: '', guardianContact: '',
    departmentId: '', courseId: '', semester: '', section: '', academicYear: '',
    admissionDate: '', status: 'Active',
  });

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.getDepartments().then(setDepartments).catch(console.error);
    api.getCourses().then(setCourses).catch(console.error);
  }, []);

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const filteredCourses = formData.departmentId
    ? courses.filter((c) => c.departmentId === formData.departmentId)
    : courses;

  const handleSubmit = async () => {
    try {
      await api.addStudent(formData);
      toast.success('Student added successfully!');
      navigate('/students');
    } catch (error) {
      toast.error('Failed to add student');
    }
  };

  return (
    <div className="page-container sm:max-w-3xl sm:mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/students')} className="btn-ghost btn-sm">
          <ArrowLeft size={15} /> Back
        </button>
        <div>
          <h1 className="page-title">Add New Student</h1>
          <p className="page-subtitle">Fill in the details to register a new student</p>
        </div>
      </div>

      <div className="card p-6 md:p-8">
        <StepIndicator steps={steps} currentStep={currentStep} />

        {currentStep === 1 && (
          <div>
            <h2 className="text-base font-semibold text-slate-800 mb-6">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormGroup label="First Name" required>
                <input className="input" placeholder="Enter first name" value={formData.firstName} onChange={(e) => update('firstName', e.target.value)} />
              </FormGroup>
              <FormGroup label="Last Name" required>
                <input className="input" placeholder="Enter last name" value={formData.lastName} onChange={(e) => update('lastName', e.target.value)} />
              </FormGroup>
              <FormGroup label="Gender" required>
                <select className="select" value={formData.gender} onChange={(e) => update('gender', e.target.value)}>
                  <option value="">Select Gender</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </FormGroup>
              <FormGroup label="Date of Birth" required>
                <input type="date" className="input" value={formData.dob} onChange={(e) => update('dob', e.target.value)} />
              </FormGroup>
              <FormGroup label="Blood Group">
                <select className="select" value={formData.bloodGroup} onChange={(e) => update('bloodGroup', e.target.value)}>
                  <option value="">Select Blood Group</option>
                  {['A+','B+','O+','AB+','A-','B-','O-','AB-'].map((g) => <option key={g}>{g}</option>)}
                </select>
              </FormGroup>
              <FormGroup label="Nationality">
                <input className="input" value={formData.nationality} onChange={(e) => update('nationality', e.target.value)} />
              </FormGroup>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-base font-semibold text-slate-800 mb-6">Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormGroup label="Mobile Number" required>
                <input className="input" placeholder="Enter mobile number" value={formData.phone} onChange={(e) => update('phone', e.target.value)} />
              </FormGroup>
              <FormGroup label="Alternate Mobile">
                <input className="input" placeholder="Enter alternate mobile" value={formData.alternatePhone} onChange={(e) => update('alternatePhone', e.target.value)} />
              </FormGroup>
              <FormGroup label="Email Address" required>
                <input type="email" className="input" placeholder="Enter email address" value={formData.email} onChange={(e) => update('email', e.target.value)} />
              </FormGroup>
              <FormGroup label="Pincode">
                <input className="input" placeholder="Enter pincode" value={formData.pincode} onChange={(e) => update('pincode', e.target.value)} />
              </FormGroup>
              <div className="sm:col-span-2">
                <FormGroup label="Address" required>
                  <textarea className="input resize-none" rows={3} placeholder="Enter full address" value={formData.address} onChange={(e) => update('address', e.target.value)} />
                </FormGroup>
              </div>
              <FormGroup label="City">
                <input className="input" placeholder="Enter city" value={formData.city} onChange={(e) => update('city', e.target.value)} />
              </FormGroup>
              <FormGroup label="State">
                <input className="input" placeholder="Enter state" value={formData.state} onChange={(e) => update('state', e.target.value)} />
              </FormGroup>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-base font-semibold text-slate-800 mb-6">Parent / Guardian Details</h2>
            <div className="space-y-6">
              <div>
                <p className="section-title mb-4">Father's Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormGroup label="Father's Name">
                    <input className="input" placeholder="Father's full name" value={formData.fatherName} onChange={(e) => update('fatherName', e.target.value)} />
                  </FormGroup>
                  <FormGroup label="Occupation">
                    <input className="input" placeholder="Father's occupation" value={formData.fatherOccupation} onChange={(e) => update('fatherOccupation', e.target.value)} />
                  </FormGroup>
                  <FormGroup label="Mobile">
                    <input className="input" placeholder="Father's mobile" value={formData.fatherPhone} onChange={(e) => update('fatherPhone', e.target.value)} />
                  </FormGroup>
                </div>
              </div>
              <div className="divider" />
              <div>
                <p className="section-title mb-4">Mother's Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormGroup label="Mother's Name">
                    <input className="input" placeholder="Mother's full name" value={formData.motherName} onChange={(e) => update('motherName', e.target.value)} />
                  </FormGroup>
                  <FormGroup label="Occupation">
                    <input className="input" placeholder="Mother's occupation" value={formData.motherOccupation} onChange={(e) => update('motherOccupation', e.target.value)} />
                  </FormGroup>
                  <FormGroup label="Mobile">
                    <input className="input" placeholder="Mother's mobile" value={formData.motherPhone} onChange={(e) => update('motherPhone', e.target.value)} />
                  </FormGroup>
                </div>
              </div>
              <div className="divider" />
              <div>
                <p className="section-title mb-4">Guardian Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormGroup label="Guardian Name">
                    <input className="input" placeholder="Guardian's full name" value={formData.guardianName} onChange={(e) => update('guardianName', e.target.value)} />
                  </FormGroup>
                  <FormGroup label="Guardian Contact">
                    <input className="input" placeholder="Guardian's contact" value={formData.guardianContact} onChange={(e) => update('guardianContact', e.target.value)} />
                  </FormGroup>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-base font-semibold text-slate-800 mb-6">Academic Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormGroup label="Department" required>
                <select className="select" value={formData.departmentId} onChange={(e) => update('departmentId', e.target.value)}>
                  <option value="">Select Department</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </FormGroup>
              <FormGroup label="Course" required>
                <select className="select" value={formData.courseId} onChange={(e) => update('courseId', e.target.value)}>
                  <option value="">Select Course</option>
                  {filteredCourses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </FormGroup>
              <FormGroup label="Semester" required>
                <select className="select" value={formData.semester} onChange={(e) => update('semester', e.target.value)}>
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </FormGroup>
              <FormGroup label="Section">
                <select className="select" value={formData.section} onChange={(e) => update('section', e.target.value)}>
                  <option value="">Select Section</option>
                  {['A','B','C','D'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </FormGroup>
              <FormGroup label="Academic Year" required>
                <select className="select" value={formData.academicYear} onChange={(e) => update('academicYear', e.target.value)}>
                  <option value="">Select Academic Year</option>
                  {['2022-2023','2023-2024','2024-2025','2025-2026'].map((y) => <option key={y}>{y}</option>)}
                </select>
              </FormGroup>
              <FormGroup label="Admission Date" required>
                <input type="date" className="input" value={formData.admissionDate} onChange={(e) => update('admissionDate', e.target.value)} />
              </FormGroup>
              <FormGroup label="Student Status">
                <select className="select" value={formData.status} onChange={(e) => update('status', e.target.value)}>
                  {['Active','Inactive'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </FormGroup>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h2 className="text-base font-semibold text-slate-800 mb-6">Document Upload</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Transfer Certificate', 'Profile Photo', 'Character Certificate'].map((doc) => (
                <div key={doc} className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-primary-300 hover:bg-primary-50/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <FileText size={18} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{doc}</p>
                      <p className="text-xs text-slate-400">PDF, JPG, PNG (max 5MB)</p>
                    </div>
                    <button className="btn-secondary btn-sm">Browse</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Documents can also be uploaded later from the student's profile page. Ensure all documents are legible and original copies.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="btn-secondary"
          >
            <ArrowLeft size={15} /> Previous
          </button>
          <span className="text-sm text-slate-400">Step {currentStep} of {steps.length}</span>
          {currentStep < steps.length ? (
            <button onClick={() => setCurrentStep(currentStep + 1)} className="btn-primary">
              Next <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary">
              <Check size={15} /> Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
