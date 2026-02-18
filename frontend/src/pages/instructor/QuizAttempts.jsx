import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizAttempts } from '../../api/instructorApi';

function QuizAttempts() {
    const navigate = useNavigate();
    const { id } = useParams(); // Quiz ID
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAttempts();
    }, [id]);

    const fetchAttempts = async () => {
        try {
            const data = await getQuizAttempts(id);
            setAttempts(data.attempts);
            setLoading(false);
        } catch (err) {
            setError('Failed to load quiz attempts');
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <Container className="mt-4 mb-5">
            <div className="d-flex align-items-center mb-4">
                <Button variant="outline-secondary" size="sm" className="me-3" onClick={() => navigate(-1)}>
                    &larr; Go Back
                </Button>
                <h2 className="mb-0">Quiz Attempts</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card>
                <Card.Body>
                    {attempts.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Completed At</th>
                                    <th>Score</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.map(attempt => (
                                    <tr key={attempt._id}>
                                        <td>
                                            <div><strong>{attempt.student?.name}</strong></div>
                                            <small className="text-muted">{attempt.student?.email}</small>
                                        </td>
                                        <td>{new Date(attempt.completedAt).toLocaleString()}</td>
                                        <td>
                                            <div className="fw-bold">{attempt.score}%</div>
                                            <small className="text-muted">({attempt.earnedPoints} / {attempt.totalPoints} pts)</small>
                                        </td>
                                        <td>
                                            <Badge bg={attempt.passed ? 'success' : 'danger'}>
                                                {attempt.passed ? 'Passed' : 'Failed'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-5 text-muted">No students have attempted this quiz yet.</div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default QuizAttempts;
