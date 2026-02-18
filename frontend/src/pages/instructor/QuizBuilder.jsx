import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Badge, Accordion } from 'react-bootstrap';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { getQuizById, createQuiz, updateQuiz } from '../../api/instructorApi';

function QuizBuilder() {
    const { id } = useParams(); // For Edit
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId'); // For Create
    const navigate = useNavigate();

    const [loading, setLoading] = useState(id ? true : false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        passingScore: 70,
        timeLimit: 30,
        questions: [
            {
                questionText: '',
                type: 'multiple-choice',
                options: ['', '', '', ''],
                correctAnswer: 0,
                points: 1
            }
        ]
    });

    useEffect(() => {
        if (id) {
            fetchQuizDetails();
        }
    }, [id]);

    const fetchQuizDetails = async () => {
        try {
            const data = await getQuizById(id);
            setQuizData(data.quiz);
            setLoading(false);
        } catch (err) {
            setError('Failed to load quiz details');
            setLoading(false);
        }
    };

    const handleQuizChange = (e) => {
        setQuizData({ ...quizData, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...quizData.questions];
        updatedQuestions[index][field] = value;
        setQuizData({ ...quizData, questions: updatedQuestions });
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...quizData.questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuizData({ ...quizData, questions: updatedQuestions });
    };

    const addQuestion = () => {
        setQuizData({
            ...quizData,
            questions: [
                ...quizData.questions,
                {
                    questionText: '',
                    type: 'multiple-choice',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                    points: 1
                }
            ]
        });
    };

    const removeQuestion = (index) => {
        const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
        setQuizData({ ...quizData, questions: updatedQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (id) {
                await updateQuiz(id, quizData);
                setSuccess('Quiz updated successfully');
            } else {
                if (!courseId) throw new Error("Course ID is missing");
                await createQuiz(courseId, quizData);
                setSuccess('Quiz created successfully');
            }
            setTimeout(() => navigate('/instructor/quizzes'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Action failed');
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <Container className="mt-4 mb-5">
            <div className="d-flex align-items-center mb-4">
                <Button variant="outline-secondary" size="sm" className="me-3" onClick={() => navigate(-1)}>
                    &larr; Go Back
                </Button>
                <h2 className="mb-0">{id ? 'Edit Quiz' : 'Create New Quiz'}</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Card className="mb-4">
                    <Card.Header><h5>Quiz Settings</h5></Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Quiz Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={quizData.title}
                                onChange={handleQuizChange}
                                required
                                placeholder="e.g., Final Exam, Unit 1 Quiz"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="description"
                                value={quizData.description}
                                onChange={handleQuizChange}
                                placeholder="Tell students what to expect"
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Passing Score (%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="passingScore"
                                        value={quizData.passingScore}
                                        onChange={handleQuizChange}
                                        min="0"
                                        max="100"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Time Limit (minutes)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="timeLimit"
                                        value={quizData.timeLimit}
                                        onChange={handleQuizChange}
                                        min="1"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <h4 className="mb-3">Questions ({quizData.questions.length})</h4>

                <Accordion defaultActiveKey="0" className="mb-4">
                    {quizData.questions.map((q, qIndex) => (
                        <Accordion.Item eventKey={qIndex.toString()} key={qIndex} className="mb-3">
                            <Accordion.Header>
                                <div className="d-flex justify-content-between w-100 pe-3">
                                    <span>Question {qIndex + 1}: {q.questionText || '(Empty Question)'}</span>
                                    <Badge bg="info">{q.points} pts</Badge>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row className="mb-3">
                                    <Col md={9}>
                                        <Form.Group>
                                            <Form.Label>Question Text</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={q.questionText}
                                                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Points</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={q.points}
                                                onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value) || 0)}
                                                min="1"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Question Type</Form.Label>
                                    <Form.Select
                                        value={q.type}
                                        onChange={(e) => {
                                            const type = e.target.value;
                                            const questions = [...quizData.questions];
                                            questions[qIndex].type = type;
                                            if (type === 'true-false') {
                                                questions[qIndex].options = ['True', 'False'];
                                                questions[qIndex].correctAnswer = 'True';
                                            } else {
                                                questions[qIndex].options = ['', '', '', ''];
                                                questions[qIndex].correctAnswer = 0;
                                            }
                                            setQuizData({ ...quizData, questions });
                                        }}
                                    >
                                        <option value="multiple-choice">Multiple Choice</option>
                                        <option value="true-false">True/False</option>
                                    </Form.Select>
                                </Form.Group>

                                {q.type === 'multiple-choice' ? (
                                    <div>
                                        <h6>Options (Select the correct one)</h6>
                                        {q.options.map((opt, optIndex) => (
                                            <Row key={optIndex} className="mb-2 align-items-center">
                                                <Col xs={1}>
                                                    <Form.Check
                                                        type="radio"
                                                        name={`correct-${qIndex}`}
                                                        checked={q.correctAnswer == optIndex}
                                                        onChange={() => handleQuestionChange(qIndex, 'correctAnswer', optIndex)}
                                                    />
                                                </Col>
                                                <Col xs={11}>
                                                    <Form.Control
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                                        placeholder={`Option ${optIndex + 1}`}
                                                        required
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <h6>Correct Answer</h6>
                                        <Form.Check
                                            type="radio"
                                            label="True"
                                            name={`tf-${qIndex}`}
                                            checked={q.correctAnswer === 'True'}
                                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', 'True')}
                                            inline
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="False"
                                            name={`tf-${qIndex}`}
                                            checked={q.correctAnswer === 'False'}
                                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', 'False')}
                                            inline
                                        />
                                    </div>
                                )}

                                <div className="d-flex justify-content-end mt-3">
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removeQuestion(qIndex)}
                                        disabled={quizData.questions.length === 1}
                                    >
                                        Remove Question
                                    </Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>

                <div className="d-grid gap-2 mb-4">
                    <Button variant="outline-primary" onClick={addQuestion}>
                        + Add Another Question
                    </Button>
                </div>

                <div className="d-flex justify-content-center">
                    <Button variant="success" size="lg" type="submit" disabled={saving}>
                        {saving ? 'Saving Quiz...' : (id ? 'Update Quiz' : 'Save Quiz')}
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default QuizBuilder;
