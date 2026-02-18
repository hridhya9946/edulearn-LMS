import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getMyCourses, deleteCourse } from '../../api/instructorApi';

function InstructorCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getMyCourses();
            setCourses(data.courses);
            setLoading(false);
        } catch (err) {
            setError('Failed to load courses');
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this draft course?')) {
            try {
                await deleteCourse(courseId);
                setSuccess('Course deleted successfully');
                fetchCourses(); // Refresh list
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete course');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'published': return <Badge bg="success">Published</Badge>;
            case 'pending': return <Badge bg="warning" text="dark">Pending Approval</Badge>;
            case 'rejected': return <Badge bg="danger">Rejected</Badge>;
            case 'draft': return <Badge bg="secondary">Draft</Badge>;
            default: return <Badge bg="info">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <Button variant="outline-secondary" size="sm" className="me-3" onClick={() => navigate(-1)}>
                        &larr; Go Back
                    </Button>
                    <h2 className="mb-0">My Courses</h2>
                </div>
                <Link to="/instructor/courses/create">
                    <Button variant="primary">Create New Course</Button>
                </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Card>
                <Card.Body>
                    {courses.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Thumbnail</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Students</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course._id}>
                                        <td>
                                            <img
                                                src={course.thumbnail || 'https://via.placeholder.com/50'}
                                                alt={course.title}
                                                style={{ width: '50px', height: '30px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>{course.title}</td>
                                        <td>{course.category}</td>
                                        <td>{getStatusBadge(course.status)}</td>
                                        <td>{course.enrollmentCount}</td>
                                        <td>₹{course.price}</td>
                                        <td>
                                            <Link to={`/instructor/courses/edit/${course._id}`}>
                                                <Button variant="outline-primary" size="sm" className="me-2">Edit</Button>
                                            </Link>
                                            {course.status === 'draft' && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(course._id)}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-muted">You haven't created any courses yet.</p>
                            <Link to="/instructor/courses/create">
                                <Button variant="primary">Create Your First Course</Button>
                            </Link>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <div className="mt-3">
                <Link to="/instructor/dashboard">
                    <Button variant="link">← Back to Dashboard</Button>
                </Link>
            </div>
        </Container>
    );
}

export default InstructorCourses;
