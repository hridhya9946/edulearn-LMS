import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Container, Row, Col, Card, ProgressBar, Button, Badge, Spinner, Alert } from "react-bootstrap";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    certificates: 0,
    totalPoints: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all courses for exploration
        const coursesRes = await api.get("/courses");
        setCourses(coursesRes.data);

        // Fetch user enrollments
        const enrollRes = await api.get("/enrollments/my-courses");
        const enrollments = enrollRes.data;

        // Process enrollments with progress
        const processedCourses = [];
        let completedCount = 0;

        for (const enrollment of enrollments) {
          const progressRes = await api.get(`/progress/${enrollment.course._id}`);
          const courseWithProgress = {
            ...enrollment.course,
            progress: progressRes.data.percentage,
            isCompleted: progressRes.data.percentage === 100
          };
          processedCourses.push(courseWithProgress);
          if (courseWithProgress.isCompleted) completedCount++;
        }

        setEnrolledCourses(processedCourses);
        setStats({
          completed: completedCount,
          inProgress: processedCourses.length - completedCount,
          certificates: completedCount, // Assuming 1 per completed course
          totalPoints: completedCount * 100 + (processedCourses.length - completedCount) * 20
        });

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleResume = async (courseId) => {
    try {
      const res = await api.get(`/progress/resume/${courseId}`);
      if (res.data.lessonId) {
        navigate(`/student/learn/${courseId}?lessonId=${res.data.lessonId}`);
      } else {
        navigate(`/student/learn/${courseId}`);
      }
    } catch (err) {
      navigate(`/student/learn/${courseId}`);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const latestCourse = enrolledCourses[0];

  return (
    <div className="student-dashboard py-5" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Container>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h6 className="text-primary fw-bold text-uppercase ls-2">Learning Command Center</h6>
            <h2 className="display-6 fw-bold">Welcome back, <span className="text-primary">{user?.name}</span> 👋</h2>
          </div>
          <Link to="/profile">
            <Button variant="outline-primary" className="rounded-pill px-4 fw-bold shadow-sm">View Profile</Button>
          </Link>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          {[
            { label: 'In Progress', value: stats.inProgress, icon: '📖', color: '#4361ee' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: '#4cc9f0' },
            { label: 'Certificates', value: stats.certificates, icon: '🎓', color: '#7209b7' },
            { label: 'Learning Points', value: stats.totalPoints, icon: '⭐', color: '#f72585' }
          ].map((stat, idx) => (
            <Col lg={3} md={6} key={idx}>
              <Card className="border-0 shadow-sm rounded-4 h-100 transition-up">
                <Card.Body className="p-4 d-flex align-items-center gap-3">
                  <div className="stat-icon p-3 rounded-4" style={{ background: `${stat.color}15`, fontSize: '1.5rem' }}>{stat.icon}</div>
                  <div>
                    <h3 className="fw-bold mb-0" style={{ color: stat.color }}>{stat.value}</h3>
                    <small className="text-muted fw-bold text-uppercase">{stat.label}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          {/* Main Content: Enrolled Courses */}
          <Col lg={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">My Learning Journey</h4>
              <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-normal">{enrolledCourses.length} Enrolled</Badge>
            </div>

            {enrolledCourses.length > 0 ? (
              <Row className="g-4">
                {enrolledCourses.map((course) => (
                  <Col md={12} key={course._id}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-up">
                      <Row className="g-0">
                        <Col md={4}>
                          <img
                            src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                            alt={course.title}
                            className="img-fluid h-100"
                            style={{ objectFit: 'cover', minHeight: '180px' }}
                          />
                        </Col>
                        <Col md={8}>
                          <Card.Body className="p-4 d-flex flex-column h-100">
                            <div className="d-flex justify-content-between mb-2">
                              <Badge bg="primary" className="rounded-pill opacity-75">{course.category}</Badge>
                              {course.isCompleted && <Badge bg="success" className="rounded-pill">Completed 🏆</Badge>}
                            </div>
                            <h5 className="fw-bold mb-2">{course.title}</h5>
                            <p className="text-muted small mb-4 line-clamp-2">{course.description}</p>

                            <div className="mt-auto">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted fw-bold">{course.progress}% Complete</small>
                                <small className="text-muted">{course.isCompleted ? 'Finished' : 'Next Lesson Awaits'}</small>
                              </div>
                              <ProgressBar
                                now={course.progress}
                                className="rounded-pill mb-4"
                                style={{ height: '8px' }}
                                variant={course.isCompleted ? "success" : "primary"}
                              />
                              <div className="d-flex gap-2">
                                <Button
                                  variant={course.isCompleted ? "outline-success" : "primary"}
                                  className="rounded-pill flex-grow-1 fw-bold shadow-sm"
                                  onClick={() => handleResume(course._id)}
                                >
                                  {course.isCompleted ? 'Rewatch Course' : 'Continue Learning'}
                                </Button>
                                {course.isCompleted && (
                                  <Button variant="outline-primary" className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                    🎓
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
                <div style={{ fontSize: '3rem' }}>🔍</div>
                <h5 className="mt-3 fw-bold">No courses found</h5>
                <p className="text-muted">You haven't enrolled in any courses yet. Start your journey today!</p>
                <Link to="/">
                  <Button variant="primary" className="rounded-pill px-4 mt-2 shadow">Explore Courses</Button>
                </Link>
              </Card>
            )}
          </Col>

          {/* Sidebar: Recommended & Activity */}
          <Col lg={4}>
            {latestCourse && !latestCourse.isCompleted && (
              <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-4 bg-primary text-white position-relative">
                <div className="position-absolute w-100 h-100" style={{ background: 'linear-gradient(45deg, rgba(0,0,0,0.4), transparent)', zIndex: 0 }}></div>
                <Card.Body className="p-4 position-relative" style={{ zIndex: 1 }}>
                  <h6 className="text-uppercase ls-1 opacity-75 small fw-bold mb-3">Jump Back In</h6>
                  <h4 className="fw-bold mb-4">{latestCourse.title}</h4>
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <ProgressBar now={latestCourse.progress} className="flex-grow-1" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }} variant="white" />
                    <small className="fw-bold">{latestCourse.progress}%</small>
                  </div>
                  <Button variant="light" className="w-100 rounded-pill fw-bold text-primary shadow" onClick={() => handleResume(latestCourse._id)}>Resume Now</Button>
                </Card.Body>
              </Card>
            )}

            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Header className="bg-white border-0 pt-4 px-4 fw-bold h5">Recommended For You</Card.Header>
              <Card.Body className="p-0">
                <div className="p-2">
                  {courses.slice(0, 3).map((course, idx) => (
                    <div key={idx} className="p-3 mb-2 rounded-3 hover-bg-light transition-up d-flex align-items-center gap-3" style={{ cursor: 'pointer' }} onClick={() => navigate(`/student/course/${course._id}`)}>
                      <img src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="" className="rounded-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                      <div className="overflow-hidden">
                        <h6 className="fw-bold mb-1 text-truncate">{course.title}</h6>
                        <small className="text-muted d-block text-capitalize">₹{course.price} • {course.level}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-0 text-center pb-4">
                <Link to="/" className="small fw-bold text-decoration-none">Explore All Courses &rarr;</Link>
              </Card.Footer>
            </Card>

            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4 text-center">
                <div className="p-3 bg-light rounded-circle d-inline-block mb-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>🎁</div>
                <h6 className="fw-bold">Refer a Friend</h6>
                <p className="text-muted small mb-3">Earn 500 points for every friend who joins EduLearn.</p>
                <Button variant="outline-primary" size="sm" className="rounded-pill px-3">Share Invite</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style dangerouslySetInnerHTML={{
        __html: `
        .transition-up { transition: all 0.3s ease; }
        .transition-up:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
        .ls-2 { letter-spacing: 2px; }
        .ls-1 { letter-spacing: 1px; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .hover-bg-light:hover { background-color: #f1f3f5 !important; }
        .uppercase { text-transform: uppercase; }
      ` }} />
    </div>
  );
};

export default StudentDashboard;
