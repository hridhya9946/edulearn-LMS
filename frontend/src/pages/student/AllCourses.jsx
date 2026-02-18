import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const { data } = await api.get("/courses");
                setCourses(data);
            } catch (err) {
                console.error("Fetch courses error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const categories = ["All", ...new Set(courses.map(c => c.category))];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

    return (
        <div className="all-courses-page py-5" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <Container>
                <div className="text-center mb-5">
                    <h6 className="text-primary fw-bold text-uppercase ls-2">Explore Knowledge</h6>
                    <h2 className="display-5 fw-bold">All Available Courses</h2>
                    <p className="text-muted lead">Discover your next skill with our professional courses.</p>
                </div>

                <Row className="mb-5 g-3">
                    <Col lg={8}>
                        <InputGroup className="shadow-sm rounded-pill overflow-hidden border-0">
                            <InputGroup.Text className="bg-white border-0 ps-4">🔍</InputGroup.Text>
                            <Form.Control
                                placeholder="Search courses by title..."
                                className="border-0 py-3"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col lg={4}>
                        <Form.Select
                            className="shadow-sm rounded-pill py-3 border-0 ps-4 fw-bold"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat} Category</option>)}
                        </Form.Select>
                    </Col>
                </Row>

                {filteredCourses.length > 0 ? (
                    <Row className="g-4">
                        {filteredCourses.map(course => (
                            <Col lg={4} md={6} key={course._id}>
                                <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-up" style={{ cursor: 'pointer' }} onClick={() => navigate(`/student/course/${course._id}`)}>
                                    <div className="position-relative">
                                        <Card.Img variant="top" src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} style={{ height: '200px', objectFit: 'cover' }} />
                                        <Badge bg="primary" className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm">{course.category}</Badge>
                                    </div>
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <small className="text-muted fw-bold text-uppercase">{course.level}</small>
                                            <h5 className="fw-bold mb-0 text-primary">₹{course.price}</h5>
                                        </div>
                                        <Card.Title className="fw-bold h5 mb-3">{course.title}</Card.Title>
                                        <p className="text-muted small mb-4 line-clamp-2">{course.description}</p>
                                        <div className="d-flex align-items-center gap-2 mt-auto">
                                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>👤</div>
                                            <small className="fw-bold opacity-75">{course.instructor?.name || 'Instructor'}</small>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="text-center py-5">
                        <div style={{ fontSize: '3rem' }}>🧐</div>
                        <h4 className="mt-3">No courses found matching your criteria.</h4>
                        <Button variant="outline-primary" className="mt-3 rounded-pill" onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}>Clear Filters</Button>
                    </div>
                )}
            </Container>

            <style dangerouslySetInnerHTML={{
                __html: `
                .transition-up { transition: all 0.3s ease; }
                .transition-up:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
                .ls-2 { letter-spacing: 2px; }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            ` }} />
        </div>
    );
};

export default AllCourses;
