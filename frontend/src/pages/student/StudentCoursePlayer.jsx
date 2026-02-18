import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../services/api";
import { Container, Row, Col, Card, Nav, Tab, Button, Accordion, ListGroup, ProgressBar, Badge, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const StudentCoursePlayer = () => {
  const { id: courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ percentage: 0, completed: 0, total: 0 });
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Parse lessonId from URL query
  const query = new URLSearchParams(location.search);
  const lessonIdFromUrl = query.get('lessonId');

  useEffect(() => {
    fetchCourseAndProgress();
  }, [courseId]);

  const fetchCourseAndProgress = async () => {
    try {
      setLoading(true);
      const [courseRes, progressRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/progress/${courseId}`)
      ]);

      const courseData = courseRes.data;
      setCourse(courseData);
      setProgress(progressRes.data);

      // Fetch verified completed labels for UI markers
      const enrollRes = await api.get(`/enrollments/my-courses`);
      const myEnrollment = enrollRes.data.find(e => e.course._id === courseId);
      if (myEnrollment) {
        setCompletedLessons(myEnrollment.completedLessons || []);
      }

      // Determine starting lesson
      const allLessons = [];
      courseData.modules?.forEach(m => m.lessons?.forEach(l => allLessons.push(l)));
      courseData.lessons?.forEach(l => allLessons.push(l));

      let targetLesson = null;
      if (lessonIdFromUrl) {
        targetLesson = allLessons.find(l => l._id === lessonIdFromUrl);
      }

      if (!targetLesson) {
        // If no URL lesson or not found, find first uncompleted one
        targetLesson = allLessons.find(l => !myEnrollment?.completedLessons.includes(l._id)) || allLessons[0];
      }

      setCurrentLesson(targetLesson);
    } catch (err) {
      console.error("Player fetch error:", err);
      setError("Failed to load your learning environment.");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    navigate(`/student/learn/${courseId}?lessonId=${lesson._id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkComplete = async () => {
    if (!currentLesson || marking) return;
    try {
      setMarking(true);
      await api.post(`/progress/${courseId}/complete/${currentLesson._id}`);

      // Update local state
      setCompletedLessons([...completedLessons, currentLesson._id]);

      // Update overall progress
      const progressRes = await api.get(`/progress/${courseId}`);
      setProgress(progressRes.data);

      // Auto move to next lesson
      moveToNextLesson();
    } catch (err) {
      console.error("Complete lesson error:", err);
    } finally {
      setMarking(false);
    }
  };

  const moveToNextLesson = () => {
    const allLessons = [];
    course.modules?.forEach(m => m.lessons?.forEach(l => allLessons.push(l)));
    course.lessons?.forEach(l => allLessons.push(l));

    const currentIndex = allLessons.findIndex(l => l._id === currentLesson._id);
    if (currentIndex < allLessons.length - 1) {
      handleLessonSelect(allLessons[currentIndex + 1]);
    } else {
      // End of course! Redirect to certificate
      navigate(`/student/certificate/${courseId}`);
    }
  };

  const renderPlayer = () => {
    if (!currentLesson) return null;

    const videoSrc = currentLesson.contentUrl || currentLesson.videoUrl;

    if (!videoSrc) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-black text-center p-5">
          <div style={{ fontSize: '4rem' }}>📄</div>
          <h4 className="mt-3">Text Lesson</h4>
          <p className="text-muted small">See the content details below the player.</p>
        </div>
      );
    }

    // Detect YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const ytMatch = videoSrc.match(youtubeRegex);

    if (ytMatch) {
      return (
        <div className="ratio ratio-16x9 h-100">
          <iframe
            src={`https://www.youtube.com/embed/${ytMatch[1]}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    // Default Video Player
    return (
      <video
        src={videoSrc}
        controls
        className="w-100 h-100"
        poster={course.thumbnail}
        controlsList="nodownload"
      />
    );
  };

  if (loading) return <Container className="d-flex justify-content-center py-5"><Spinner animation="border" /></Container>;
  if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!course) return <Container className="py-5"><Alert variant="warning">Course not found.</Alert></Container>;

  return (
    <div className="course-player bg-dark text-white" style={{ minHeight: '100vh' }}>
      {/* Top Header Navigation */}
      <nav className="navbar navbar-expand navbar-dark bg-black border-bottom border-secondary px-4 py-2 sticky-top" style={{ zIndex: 1000 }}>
        <div className="container-fluid">
          <Link to="/student/dashboard" className="text-white text-decoration-none d-flex align-items-center gap-2 me-4">
            <span style={{ fontSize: '1.2rem' }}>&larr;</span>
            <span className="d-none d-md-inline fw-bold">Dashboard</span>
          </Link>
          <div className="vr bg-secondary mx-3 d-none d-md-block"></div>
          <div className="navbar-text text-truncate me-auto fw-bold opacity-90 px-2">
            {course.title}
          </div>
          <div className="d-none d-lg-flex align-items-center gap-3 ms-auto" style={{ width: '250px' }}>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between x-small mb-1 opacity-75">
                <span>Progress</span>
                <span>{progress.percentage}%</span>
              </div>
              <ProgressBar now={progress.percentage} style={{ height: '6px' }} variant="primary" className="bg-secondary" />
            </div>
            <Badge bg="success" pill>{progress.completed}/{progress.totalLessons} Lessons</Badge>
          </div>
          {progress.percentage === 100 && (
            <Link to={`/student/certificate/${courseId}`} className="ms-3 no-print">
              <Button variant="warning" size="sm" className="fw-bold rounded-pill px-3 shadow-sm border-0" style={{ background: '#d4af37', color: '#1a1a1a' }}>
                Claim Certificate 🎓
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <Row className="g-0">
        {/* Main Content Area: Video/Content Player */}
        <Col lg={9} className="player-main border-end border-secondary">
          <div className="video-container bg-black position-relative" style={{ aspectRatio: '16/9', maxHeight: '75vh' }}>
            {renderPlayer()}
          </div>

          <Container className="py-5 content-area">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="fw-bold mb-2">{currentLesson?.title}</h2>
                <Badge bg="light" text="dark" className="border text-capitalize opacity-75">{currentLesson?.type || 'lesson'}</Badge>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant={completedLessons.includes(currentLesson?._id) ? "success" : "primary"}
                  className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
                  style={{
                    background: completedLessons.includes(currentLesson?._id)
                      ? '#198754'
                      : 'linear-gradient(45deg, #4361ee, #4cc9f0)',
                    border: 'none',
                    minWidth: '160px',
                    justifyContent: 'center'
                  }}
                  onClick={handleMarkComplete}
                  disabled={completedLessons.includes(currentLesson?._id) || marking}
                >
                  {marking ? (
                    <Spinner animation="border" size="sm" />
                  ) : completedLessons.includes(currentLesson?._id) ? (
                    <><span>✓</span> Completed</>
                  ) : (
                    <><span>🔘</span> Mark as Complete</>
                  )}
                </Button>
                <Button variant="outline-light" className="rounded-pill px-4 fw-bold border-2" onClick={moveToNextLesson}>Next &rarr;</Button>
              </div>
            </div>

            {/* Tabbed Info */}
            <Tab.Container id="lesson-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav variant="tabs" className="custom-tabs border-secondary mb-4">
                <Nav.Item><Nav.Link eventKey="overview" className="bg-transparent border-0 text-white opacity-75">Overview</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="resources" className="bg-transparent border-0 text-white opacity-75">Resources</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="qanda" className="bg-transparent border-0 text-white opacity-75">Q&A</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="notes" className="bg-transparent border-0 text-white opacity-75">My Notes</Nav.Link></Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <div style={{ lineHeight: '1.8' }}>
                    <p className="opacity-75">{currentLesson?.content || "No detailed description provided for this lesson."}</p>
                    <hr className="border-secondary my-5" />
                    <h5 className="fw-bold mb-3">About This Instructor</h5>
                    <div className="d-flex align-items-center gap-3 p-4 rounded-4 bg-secondary bg-opacity-10 border border-secondary">
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#4361ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👤</div>
                      <div>
                        <h6 className="fw-bold mb-1">{course.instructor?.name}</h6>
                        <p className="small text-muted mb-0">Expert Educator at EduLearn Platform</p>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="resources">
                  <div className="text-center py-5 opacity-50">
                    <div style={{ fontSize: '3rem' }}>📁</div>
                    <h6 className="mt-3">No resources attached to this lesson.</h6>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="qanda">
                  <div className="text-center py-5 opacity-50">
                    <div style={{ fontSize: '3rem' }}>💬</div>
                    <h6 className="mt-3">Discussion board is coming soon!</h6>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="notes">
                  <div className="p-4 bg-secondary bg-opacity-10 rounded-4 border border-secondary">
                    <textarea className="form-control bg-transparent text-white border-0" rows={5} placeholder="Type your personal notes here... They will be saved locally." style={{ outline: 'none', boxShadow: 'none' }}></textarea>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Container>
        </Col>

        {/* Sidebar: Course Content / Curriculum */}
        <Col lg={3} className="bg-black vh-100-lg sticky-top-lg overflow-auto border-start border-secondary py-3">
          <div className="px-3 mb-4 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Course Content</h5>
            <small className="opacity-50">{completedLessons.length}/{progress.totalLessons} Lessons</small>
          </div>

          <Accordion defaultActiveKey="0" className="player-curriculum px-2">
            {course.modules?.map((module, mIdx) => (
              <Accordion.Item eventKey={mIdx.toString()} key={mIdx} className="bg-transparent border-0 mb-2 overflow-hidden rounded-3">
                <Accordion.Header className="bg-dark text-white rounded-3">
                  <div className="d-flex flex-column text-start py-1">
                    <span className="small text-muted fw-bold text-uppercase ls-1">Module {mIdx + 1}</span>
                    <span className="fw-bold" style={{ color: '#eee' }}>{module.title}</span>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="p-0 bg-black">
                  <ListGroup variant="flush">
                    {module.lessons?.map((lesson, lIdx) => (
                      <ListGroup.Item
                        key={lIdx}
                        action={true}
                        onClick={() => handleLessonSelect(lesson)}
                        className={`bg-transparent text-white border-0 py-3 ps-4 d-flex align-items-start gap-3 transition-bg ${currentLesson?._id === lesson._id ? 'active-lesson' : 'lesson-item text-muted'}`}
                        style={{ borderLeft: currentLesson?._id === lesson._id ? '4px solid #4361ee' : '4px solid transparent' }}
                      >
                        <div className="mt-1">
                          {completedLessons.includes(lesson._id) ? (
                            <span className="text-success">✅</span>
                          ) : (
                            <span style={{ opacity: 0.5 }}>{lesson.type === 'video' ? '▶️' : '📄'}</span>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="fw-bold small mb-1">{lesson.title}</div>
                          <small className="opacity-50 x-small">{lesson.duration} min</small>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}

            {/* Top level lessons if any (fallback) */}
            {course.lessons && course.lessons.length > 0 && (
              <Accordion.Item eventKey="toplevel" className="bg-transparent border-0 mb-2 overflow-hidden rounded-3">
                <Accordion.Header className="bg-dark text-white">General Lessons</Accordion.Header>
                <Accordion.Body className="p-0 bg-black">
                  <ListGroup variant="flush">
                    {course.lessons.map((lesson, idx) => (
                      <ListGroup.Item
                        key={idx}
                        action
                        onClick={() => handleLessonSelect(lesson)}
                        className={`bg-transparent text-white border-0 py-3 ps-4 d-flex align-items-start gap-3 ${currentLesson?._id === lesson._id ? 'active-lesson' : 'lesson-item opacity-75'}`}
                      >
                        <div className="mt-1">{completedLessons.includes(lesson._id) ? '✅' : '📄'}</div>
                        <div>{lesson.title}</div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            )}
          </Accordion>
        </Col>
      </Row>

      <style dangerouslySetInnerHTML={{
        __html: `
        .ls-1 { letter-spacing: 1px; }
        .x-small { font-size: 0.75rem; }
        .transition-bg { transition: background 0.2s ease; }
        .lesson-item:hover { background: rgba(255,255,255,0.05) !important; color: #fff !important; }
        .active-lesson { background: rgba(67, 97, 238, 0.1) !important; color: #fff !important; }
        .custom-tabs .nav-link { font-weight: bold; border-bottom: 2px solid transparent !important; border-radius: 0 !important; padding: 10px 20px; transition: all 0.3s; }
        .custom-tabs .nav-link.active { border-bottom: 2px solid #4361ee !important; color: #fff !important; opacity: 1 !important; }
        .custom-tabs .nav-link:hover { opacity: 1 !important; }
        
        .player-curriculum .accordion-button { background-color: #1a1a1a !important; color: #fff !important; box-shadow: none !important; border-radius: 8px !important; }
        .player-curriculum .accordion-button:not(.collapsed) { border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important; }
        .player-curriculum .accordion-item { background: transparent !important; }
        .player-curriculum .accordion-button::after { filter: invert(1); scale: 0.8; }
        
        @media (min-width: 992px) {
            .vh-100-lg { height: 100vh; }
            .sticky-top-lg { position: sticky; top: 0; }
        }
      ` }} />
    </div>
  );
};

export default StudentCoursePlayer;
