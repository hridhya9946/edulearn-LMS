import api from '../services/api';

export const enroll = async (courseId) => {
    const res = await api.post(`/enrollments/${courseId}`);
    return res.data;
};

export const checkEnrollment = async (courseId) => {
    const res = await api.get(`/enrollments/check/${courseId}`);
    return res.data;
};

export const getMyEnrollments = async () => {
    const res = await api.get('/enrollments/my-courses');
    return res.data;
};
