import api from "../services/api";

/* ===============================
   COURSE MANAGEMENT
================================= */

export const getMyCourses = async () => {
    const response = await api.get("/instructor/courses");
    return response.data;
};

export const createCourse = async (courseData) => {
    const response = await api.post("/instructor/courses", courseData);
    return response.data;
};

export const getCourseById = async (courseId) => {
    const response = await api.get(`/instructor/courses/${courseId}`);
    return response.data;
};

export const updateCourse = async (courseId, courseData) => {
    const response = await api.put(`/instructor/courses/${courseId}`, courseData);
    return response.data;
};

export const deleteCourse = async (courseId) => {
    const response = await api.delete(`/instructor/courses/${courseId}`);
    return response.data;
};

export const publishCourse = async (courseId) => {
    const response = await api.put(`/instructor/courses/${courseId}/publish`, {});
    return response.data;
};

/* ===============================
   ASSIGNMENT MANAGEMENT
================================= */

export const getCourseAssignments = async (courseId) => {
    const response = await api.get(`/instructor/courses/${courseId}/assignments`);
    return response.data;
};

export const createAssignment = async (courseId, assignmentData) => {
    const response = await api.post(`/instructor/courses/${courseId}/assignments`, assignmentData);
    return response.data;
};

export const updateAssignment = async (assignmentId, assignmentData) => {
    const response = await api.put(`/instructor/assignments/${assignmentId}`, assignmentData);
    return response.data;
};

export const deleteAssignment = async (assignmentId) => {
    const response = await api.delete(`/instructor/assignments/${assignmentId}`);
    return response.data;
};

export const getSubmissions = async (assignmentId) => {
    const response = await api.get(`/instructor/assignments/${assignmentId}/submissions`);
    return response.data;
};

export const gradeSubmission = async (submissionId, gradeData) => {
    const response = await api.put(`/instructor/submissions/${submissionId}/grade`, gradeData);
    return response.data;
};

/* ===============================
   QUIZ MANAGEMENT
================================= */

export const getCourseQuizzes = async (courseId) => {
    const response = await api.get(`/instructor/courses/${courseId}/quizzes`);
    return response.data;
};

export const getQuizById = async (quizId) => {
    const response = await api.get(`/instructor/quizzes/${quizId}`);
    return response.data;
};

export const createQuiz = async (courseId, quizData) => {
    const response = await api.post(`/instructor/courses/${courseId}/quizzes`, quizData);
    return response.data;
};

export const updateQuiz = async (quizId, quizData) => {
    const response = await api.put(`/instructor/quizzes/${quizId}`, quizData);
    return response.data;
};

export const deleteQuiz = async (quizId) => {
    const response = await api.delete(`/instructor/quizzes/${quizId}`);
    return response.data;
};

export const getQuizAttempts = async (quizId) => {
    const response = await api.get(`/instructor/quizzes/${quizId}/attempts`);
    return response.data;
};

/* ===============================
   ANALYTICS
================================= */

export const getDashboardStats = async () => {
    const response = await api.get("/instructor/dashboard");
    return response.data;
};

export const getCourseAnalytics = async (courseId) => {
    const response = await api.get(`/instructor/courses/${courseId}/analytics`);
    return response.data;
};
