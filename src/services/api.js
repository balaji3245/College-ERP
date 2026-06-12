const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('erp_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Login failed');
    }
    return response.json();
  },

  getDashboardAnalytics: async () => {
    const response = await fetch(`${BASE_URL}/analytics/dashboard`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard analytics');
    return response.json();
  },

  getReportAnalytics: async (type) => {
    const response = await fetch(`${BASE_URL}/analytics/reports/${type}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error(`Failed to fetch ${type} reports`);
    return response.json();
  },

  getStudents: async () => {
    const response = await fetch(`${BASE_URL}/students/`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  addStudent: async (studentData) => {
    const response = await fetch(`${BASE_URL}/students/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData)
    });
    if (!response.ok) throw new Error('Failed to add student');
    return response.json();
  },

  deleteStudent: async (id) => {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete student');
    return response.json();
  },

  getDepartments: async () => {
    const response = await fetch(`${BASE_URL}/departments/`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch departments');
    return response.json();
  },

  addDepartment: async (data) => {
    const response = await fetch(`${BASE_URL}/departments/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.msg || 'Failed to add department');
    }
    return response.json();
  },

  updateDepartment: async (id, data) => {
    const response = await fetch(`${BASE_URL}/departments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update department');
    return response.json();
  },

  deleteDepartment: async (id) => {
    const response = await fetch(`${BASE_URL}/departments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete department');
    return response.json();
  },

  getTeachers: async () => {
    const response = await fetch(`${BASE_URL}/teachers/`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch teachers');
    return response.json();
  },

  addTeacher: async (data) => {
    const response = await fetch(`${BASE_URL}/teachers/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.msg || 'Failed to add teacher');
    }
    return response.json();
  },

  deleteTeacher: async (id) => {
    const response = await fetch(`${BASE_URL}/teachers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete teacher');
    return response.json();
  },

  getCourses: async () => {
    const response = await fetch(`${BASE_URL}/courses/`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  getFees: async () => {
    const response = await fetch(`${BASE_URL}/fees/`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch fees');
    return response.json();
  },

  getAttendance: async () => {
    const response = await fetch(`${BASE_URL}/attendance/`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch attendance');
    return response.json();
  },

  getResults: async () => {
    const response = await fetch(`${BASE_URL}/results/`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch results');
    return response.json();
  },

  getDocuments: async () => {
    const response = await fetch(`${BASE_URL}/documents/`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
  }
};
