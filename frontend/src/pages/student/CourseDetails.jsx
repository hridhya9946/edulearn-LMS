import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, ListGroup, Placeholder, Accordion } from "react-bootstrap";
import { getCourseById } from "../../api/courseApi";
import { enroll, checkEnrollment } from "../../api/enrollmentApi"; // Need to ensure these exist
import { useAuth } from "../../context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourseAndEnrollment();
  }, [id]);

  const fetchCourseAndEnrollment = async () => {
    try {
      const courseData = await getCourseById(id);
      setCourse(courseData);

      if (user && user.role === 'student') {
        const enrollmentStatus = await checkEnrollment(id);
        setEnrolled(enrollmentStatus.enrolled);
      }
    } catch (err) {
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) return navigate("/login");
    if (user.role !== 'student') return;

    setEnrolling(true);
    try {
      await enroll(id);
      setEnrolled(true);
      navigate(`/student/learn/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Enrollment failed.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row>
          <Col lg={8}><Placeholder as="div" animation="glow"><Placeholder xs={12} style={{ height: '400px' }} /></Placeholder></Col>
          <Col lg={4}><Placeholder as="div" animation="glow"><Placeholder xs={12} style={{ height: '200px' }} /></Placeholder></Col>
        </Row>
      </Container>
    );
  }

  if (!course) return <Container className="py-5"><Alert variant="danger">Course not found.</Alert></Container>;

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="course-details-page" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Dark Header */}
      <section className="bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link to="/" className="text-primary text-decoration-none">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/courses" className="text-primary text-decoration-none">Courses</Link></li>
                  <li className="breadcrumb-item active text-white opacity-75" aria-current="page">{course.category}</li>
                </ol>
              </nav>
              <h1 className="display-4 fw-bold mb-3">{course.title}</h1>
              <p className="lead mb-4 opacity-75">{course.description.substring(0, 200)}...</p>
              <div className="d-flex flex-wrap gap-4 align-items-center mt-4">
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: '40px', height: '40px', background: '#4361ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>I</div>
                  <div>
                    <small className="d-block opacity-50">Instructor</small>
                    <span className="fw-bold">{course.instructor?.name}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="text-warning fw-bold">RAT</div>
                  <div>
                    <small className="d-block opacity-50">Rating</small>
                    <span className="fw-bold">4.8 (2.5k reviews)</span>
                  </div>
                </div>
                <Badge bg="primary" className="px-3 py-2 text-capitalize">{course.level}</Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="g-4">
          {/* Left Column: Course Content */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
              <Card.Header className="bg-white py-3 px-4 fw-bold h5">What you'll learn</Card.Header>
              <Card.Body className="p-4">
                <p style={{ lineHeight: '1.8' }}>{course.description}</p>
              </Card.Body>
            </Card>

            <h4 className="fw-bold mb-4 px-2">Course Curriculum</h4>
            <Accordion defaultActiveKey="0" className="shadow-sm rounded-4 overflow-hidden border-0">
              {course.modules?.map((module, idx) => (
                <Accordion.Item eventKey={idx.toString()} key={idx} className="border-0 border-bottom">
                  <Accordion.Header className="py-2">
                    <div className="d-flex justify-content-between w-100 pe-3 align-items-center">
                      <span className="fw-bold">{module.title}</span>
                      <small className="text-muted">{module.lessons?.length || 0} Lessons</small>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="p-0">
                    <ListGroup variant="flush">
                      {module.lessons?.map((lesson, lIdx) => (
                        <ListGroup.Item key={lIdx} className="d-flex justify-content-between align-items-center py-3 border-0 bg-light-hover">
                          <div className="d-flex align-items-center gap-3">
                            <span className="text-primary small fw-bold">{lesson.type === 'video' ? 'PLAY' : 'DOC'}</span>
                            <span>{lesson.title}</span>
                          </div>
                          <small className="text-muted">{lesson.duration} min</small>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>

          {/* Right Column: Sticky Enrollment Card */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
              <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="position-relative">
                  <img src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="Thumbnail" className="img-fluid" />
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="play-btn bg-white rounded-circle shadow d-flex align-items-center justify-content-center fw-bold" style={{ width: '60px', height: '60px', cursor: 'pointer', color: '#4361ee' }}>PLAY</div>
                  </div>
                </div>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-end gap-2 mb-4">
                    <h2 className="fw-bold mb-0 text-primary">₹{course.price}</h2>
                    <small className="text-muted text-decoration-line-through mb-1">₹{course.price * 2}</small>
                    <Badge bg="success" className="mb-1">50% OFF</Badge>
                  </div>

                  {enrolled ? (
                    <Button variant="success" size="lg" className="w-100 rounded-pill mb-3 fw-bold" onClick={() => navigate(`/student/learn/${id}`)}>
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100 rounded-pill mb-3 fw-bold shadow-sm"
                      style={{ background: 'linear-gradient(45deg, #4361ee, #4cc9f0)', border: 'none' }}
                      onClick={handleEnroll}
                      disabled={enrolling || (user && user.role !== 'student')}
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )}

                  <div className="text-center mb-4">
                    <small className="text-muted">30-Day Money-Back Guarantee</small>
                  </div>

                  <h6 className="fw-bold mb-3">This course includes:</h6>
                  <ul className="list-unstyled d-flex flex-column gap-2 small">
                    <li><span className="fw-bold me-2">Video</span> {totalLessons} On-demand lessons</li>
                    <li><span className="fw-bold me-2">Access</span> Full lifetime access</li>
                    <li><span className="fw-bold me-2">Mobile</span> Access on mobile and TV</li>
                    <li><span className="fw-bold me-2">Verify</span> Certificate of completion</li>
                  </ul>

                  <hr className="my-4" />

                  <div className="d-flex justify-content-center gap-4">
                    <div className="text-center" style={{ cursor: 'pointer' }}>
                      <small className="d-block fw-bold text-primary">SHARE</small>
                    </div>
                    <div className="text-center" style={{ cursor: 'pointer' }}>
                      <small className="d-block fw-bold text-danger">WISHLIST</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      <style dangerouslySetInnerHTML={{
        __html: `
                .bg-light-hover:hover {
                    background-color: #f1f3f5 !important;
                }
                .play-btn {
                    transition: transform 0.2s ease;
                }
                .play-btn:hover {
                    transform: translate(-50%, -50%) scale(1.1) !important;
                    position: absolute !important;
                }
            ` }} />
    </div>
  );
};

export default CourseDetails;
