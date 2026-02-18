import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSubmissions, gradeSubmission } from '../../api/instructorApi';

function AssignmentGrade() {
    const navigate = useNavigate();
    const { id } = useParams(); // Assignment ID
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Grading Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradingData, setGradingData] = useState({
        grade: 0,
        feedback: ''
    });

    useEffect(() => {
        fetchSubmissions();
    }, [id]);

    const fetchSubmissions = async () => {
        try {
            const data = await getSubmissions(id);
            setSubmissions(data.submissions);
            setLoading(false);
        } catch (err) {
            setError('Failed to load submissions');
            setLoading(false);
        }
    };

    const handleOpenGradingModal = (submission) => {
        setSelectedSubmission(submission);
        setGradingData({
            grade: submission.grade || 0,
            feedback: submission.feedback || ''
        });
        setShowModal(true);
    };

    const handleGradeChange = (e) => {
        setGradingData({ ...gradingData, [e.target.name]: e.target.value });
    };

    const handleSubmitGrade = async (e) => {
        e.preventDefault();
        try {
            await gradeSubmission(selectedSubmission._id, gradingData);
            setSuccess('Submission graded successfully');
            setShowModal(false);
            fetchSubmissions(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Grading failed');
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <Container className="mt-4 mb-5">
            <div className="d-flex align-items-center mb-4">
                <Button variant="outline-secondary" size="sm" className="me-3" onClick={() => navigate(-1)}>
                    &larr; Go Back
                </Button>
                <h2 className="mb-0">Grade Submissions</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Card>
                <Card.Body>
                    {submissions.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Submitted At</th>
                                    <th>Status</th>
                                    <th>Grade</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map(sub => (
                                    <tr key={sub._id}>
                                        <td>{sub.student?.name || 'Unknown Student'}</td>
                                        <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                                        <td>
                                            <Badge bg={sub.status === 'graded' ? 'success' : 'warning'}>
                                                {sub.status}
                                            </Badge>
                                        </td>
                                        <td>{sub.grade !== undefined ? `${sub.grade}/${sub.assignment?.maxScore || 100}` : '-'}</td>
                                        <td>
                                            <Button variant="primary" size="sm" onClick={() => handleOpenGradingModal(sub)}>
                                                {sub.status === 'graded' ? 'Re-grade' : 'Grade'}
                                            </Button>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                as="a"
                                                href={sub.content}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ms-2"
                                            >
                                                View Content
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-5 text-muted">No submissions yet for this assignment.</div>
                    )}
                </Card.Body>
            </Card>

            {/* Grading Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Grade Submission: {selectedSubmission?.student?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <strong>Submission Content:</strong>
                        <p className="border p-2 bg-light mt-1" style={{ whiteSpace: 'pre-wrap' }}>
                            {selectedSubmission?.content}
                        </p>
                    </div>
                    <Form onSubmit={handleSubmitGrade}>
                        <Form.Group className="mb-3">
                            <Form.Label>Grade (Max: {selectedSubmission?.assignment?.maxScore || 100})</Form.Label>
                            <Form.Control
                                type="number"
                                name="grade"
                                value={gradingData.grade}
                                onChange={handleGradeChange}
                                max={selectedSubmission?.assignment?.maxScore || 100}
                                min="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Feedback</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="feedback"
                                value={gradingData.feedback}
                                onChange={handleGradeChange}
                                placeholder="Good work!..."
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Submit Grade
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default AssignmentGrade;
