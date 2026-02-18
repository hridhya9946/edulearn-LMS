import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Alert, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getMyCourses, getCourseQuizzes, deleteQuiz } from '../../api/instructorApi';

function QuizManager() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            fetchQuizzes(selectedCourseId);
        } else {
            setQuizzes([]);
        }
    }, [selectedCourseId]);

    const fetchCourses = async () => {
        try {
            const data = await getMyCourses();
            const activeCourses = data.courses.filter(c => c.status !== 'draft');
            setCourses(activeCourses);
            if (activeCourses.length > 0) {
                setSelectedCourseId(activeCourses[0]._id);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to load courses');
            setLoading(false);
        }
    };

    const fetchQuizzes = async (courseId) => {
        try {
            setLoading(true);
            const data = await getCourseQuizzes(courseId);
            setQuizzes(data.quizzes);
            setLoading(false);
        } catch (err) {
            setError('Failed to load quizzes');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await deleteQuiz(id);
                setSuccess('Quiz deleted successfully');
                fetchQuizzes(selectedCourseId);
            } catch (err) {
                setError(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    if (loading && courses.length === 0) return <div className="text-center mt-5">Loading...</div>;

    return (
        <Container className="mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <Button variant="outline-secondary" size="sm" className="me-3" onClick={() => navigate(-1)}>
                        &larr; Go Back
                    </Button>
                    <h2 className="mb-0">Quiz Management</h2>
                </div>
                <div className="d-flex gap-2">
                    <Link to={selectedCourseId ? `/instructor/quizzes/create?courseId=${selectedCourseId}` : '#'}>
                        <Button variant="primary" disabled={!selectedCourseId}>
                            Create New Quiz
                        </Button>
                    </Link>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Card className="mb-4">
                <Card.Body>
                    <Form.Group>
                        <Form.Label>Select Course</Form.Label>
                        <Form.Select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                        >
                            <option value="">Select a course to manage its quizzes</option>
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>{course.title} ({course.status})</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Card.Body>
            </Card>

            {selectedCourseId ? (
                <Card>
                    <Card.Header>
                        <h5>Quizzes for {courses.find(c => c._id === selectedCourseId)?.title}</h5>
                    </Card.Header>
                    <Card.Body>
                        {quizzes.length > 0 ? (
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Questions</th>
                                        <th>Time Limit</th>
                                        <th>Passing Score</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quizzes.map(quiz => (
                                        <tr key={quiz._id}>
                                            <td>{quiz.title}</td>
                                            <td>{quiz.questions?.length || 0}</td>
                                            <td>{quiz.timeLimit} mins</td>
                                            <td>{quiz.passingScore}%</td>
                                            <td>
                                                <Link to={`/instructor/quizzes/edit/${quiz._id}`}>
                                                    <Button variant="outline-primary" size="sm" className="me-2">Edit</Button>
                                                </Link>
                                                <Link to={`/instructor/quizzes/${quiz._id}/attempts`}>
                                                    <Button variant="outline-info" size="sm" className="me-2">Attempts</Button>
                                                </Link>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(quiz._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center py-4 text-muted">No quizzes found for this course.</div>
                        )}
                    </Card.Body>
                </Card>
            ) : (
                <Alert variant="info">Please select an active/published course to manage quizzes.</Alert>
            )}

            <div className="mt-3">
                <Link to="/instructor/dashboard">
                    <Button variant="link">← Back to Dashboard</Button>
                </Link>
            </div>
        </Container>
    );
}

export default QuizManager;
