import api from '../services/api';

export const getPublishedCourses = async () => {
    const res = await api.get('/courses');
    return res.data;
};

export const getCourseById = async (id) => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
};
