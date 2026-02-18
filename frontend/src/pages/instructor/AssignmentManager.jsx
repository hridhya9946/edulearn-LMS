import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getMyCourses, getCourseAssignments, createAssignment, updateAssignment, deleteAssignment } from '../../api/instructorApi';

function AssignmentManager() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAssignmentId, setCurrentAssignmentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        maxScore: 100
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            fetchAssignments(selectedCourseId);
        } else {
            setAssignments([]);
        }
    }, [selectedCourseId]);

    const fetchCourses = async () => {
        try {
            const data = await getMyCourses();
            setCourses(data.courses.filter(c => c.status !== 'draft')); // Only manage assignments for non-drafts
            if (data.courses.length > 0) {
                // Find first non-draft course
                const firstActive = data.courses.find(c => c.status !== 'draft');
                if (firstActive) setSelectedCourseId(firstActive._id);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to load courses');
            setLoading(false);
        }
    };

    const fetchAssignments = async (courseId) => {
        try {
            setLoading(true);
            const data = await getCourseAssignments(courseId);
            setAssignments(data.assignments);
            setLoading(false);
        } catch (err) {
            setError('Failed to load assignments');
            setLoading(false);
        }
    };

    const handleOpenModal = (assignment = null) => {
        if (assignment) {
            setIsEditing(true);
            setCurrentAssignmentId(assignment._id);
            setFormData({
                title: assignment.title,
                description: assignment.description,
                dueDate: new Date(assignment.dueDate).toISOString().split('T')[0],
                maxScore: assignment.maxScore
            });
        } else {
            setIsEditing(false);
            setCurrentAssignmentId(null);
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                maxScore: 100
            });
        }
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (isEditing) {
                await updateAssignment(currentAssignmentId, formData);
                setSuccess('Assignment updated successfully');
            } else {
                await createAssignment(selectedCourseId, formData);
                setSuccess('Assignment created successfully');
            }
            setShowModal(false);
            fetchAssignments(selectedCourseId);
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await deleteAssignment(id);
                setSuccess('Assignment deleted successfully');
                fetchAssignments(selectedCourseId);
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
                    <h2 className="mb-0">Assignment Management</h2>
                </div>
                <Button variant="primary" onClick={() => setShowCreateModal(true)} disabled={!selectedCourseId}>
                    Create New Assignment
                </Button>
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
                            <option value="">Select a course to manage its assignments</option>
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
                        <h5>Assignments for {courses.find(c => c._id === selectedCourseId)?.title}</h5>
                    </Card.Header>
                    <Card.Body>
                        {assignments.length > 0 ? (
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Due Date</th>
                                        <th>Max Score</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map(assignment => (
                                        <tr key={assignment._id}>
                                            <td>{assignment.title}</td>
                                            <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                                            <td>{assignment.maxScore}</td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleOpenModal(assignment)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    className="me-2"
                                                    as="a"
                                                    href={`/instructor/assignments/${assignment._id}/grade`}
                                                >
                                                    Grade Submissions
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(assignment._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center py-4 text-muted">No assignments found for this course.</div>
                        )}
                    </Card.Body>
                </Card>
            ) : (
                <Alert variant="info">Please select an active/published course to manage assignments.</Alert>
            )}

            {/* Assignment Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Assignment' : 'Create New Assignment'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Max Score</Form.Label>
                            <Form.Control
                                type="number"
                                name="maxScore"
                                value={formData.maxScore}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {isEditing ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default AssignmentManager;
