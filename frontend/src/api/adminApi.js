import api from "../services/api";

/* ===============================
   USER MANAGEMENT
================================= */

export const getAllUsers = async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
};

export const getUserById = async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
};

export const createUser = async (userData) => {
    const response = await api.post("/admin/users", userData);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
};

export const changeUserRole = async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
};

/* ===============================
   COURSE APPROVAL
================================= */

export const getPendingCourses = async () => {
    const response = await api.get("/admin/courses/pending");
    return response.data;
};

export const approveCourse = async (courseId) => {
    const response = await api.put(`/admin/courses/${courseId}/approve`, {});
    return response.data;
};

export const rejectCourse = async (courseId, reason) => {
    const response = await api.put(`/admin/courses/${courseId}/reject`, { reason });
    return response.data;
};

/* ===============================
   ANALYTICS
================================= */

export const getDashboardStats = async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
};

export const getRevenueReport = async () => {
    const response = await api.get("/admin/reports/revenue");
    return response.data;
};

export const getUserGrowth = async () => {
    const response = await api.get("/admin/reports/user-growth");
    return response.data;
};

export const getCourseStats = async () => {
    const response = await api.get("/admin/reports/courses");
    return response.data;
};

/* ===============================
   SYSTEM SETTINGS
================================= */

export const getSettings = async () => {
    const response = await api.get("/admin/settings");
    return response.data;
};

export const updateSettings = async (settingsData) => {
    const response = await api.put("/admin/settings", settingsData);
    return response.data;
};
