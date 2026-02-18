import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getPendingCourses, approveCourse, rejectCourse } from '../../api/adminApi';

function CourseApproval() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchPendingCourses();
    }, []);

    const fetchPendingCourses = async () => {
        try {
            const data = await getPendingCourses();
            setCourses(data.courses);
            setLoading(false);
        } catch (err) {
            setError('Failed to load pending courses');
            setLoading(false);
        }
    };

    const handleApprove = async (courseId) => {
        if (window.confirm('Are you sure you want to approve this course?')) {
            try {
                await approveCourse(courseId);
                fetchPendingCourses();
            } catch (err) {
                setError('Failed to approve course');
            }
        }
    };

    const handleReject = async () => {
        try {
            await rejectCourse(selectedCourse._id, rejectionReason);
            setShowModal(false);
            setRejectionReason('');
            fetchPendingCourses();
        } catch (err) {
            setError('Failed to reject course');
        }
    };

    const handleShowRejectModal = (course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    if (loading) {
        return (
            <Container className="mt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status"></div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex align-items-center mb-4">
                <Button variant="outline-secondary" size="sm" className="me-3" onClick={() => navigate(-1)}>
                    &larr; Go Back
                </Button>
                <h2 className="mb-0">Course Approval</h2>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            {courses.length === 0 ? (
                <Alert variant="info">No courses pending approval</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Course Title</th>
                            <th>Instructor</th>
                            <th>Category</th>
                            <th>Level</th>
                            <th>Price</th>
                            <th>Submitted</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course._id}>
                                <td>
                                    <strong>{course.title}</strong>
                                    <br />
                                    <small className="text-muted">{course.description?.substring(0, 100)}...</small>
                                </td>
                                <td>{course.instructor?.name || 'N/A'}</td>
                                <td>{course.category}</td>
                                <td>
                                    <Badge bg="secondary">{course.level}</Badge>
                                </td>
                                <td>₹{course.price}</td>
                                <td>{new Date(course.updatedAt).toLocaleDateString()}</td>
                                <td>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleApprove(course._id)}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleShowRejectModal(course)}
                                    >
                                        Reject
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Rejection Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>Course:</strong> {selectedCourse?.title}
                    </p>
                    <Form.Group>
                        <Form.Label>Rejection Reason</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Provide a reason for rejection..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleReject}>
                        Reject Course
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default CourseApproval;
