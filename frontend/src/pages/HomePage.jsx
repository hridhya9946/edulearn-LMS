import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { getPublishedCourses } from '../api/courseApi';

const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getPublishedCourses();
        setFeaturedCourses(data.slice(0, 4)); // Show first 4 courses
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const stats = [
    { label: 'Active Students', value: '15,000+' },
    { label: 'Expert Instructors', value: '1,200+' },
    { label: 'Quality Courses', value: '450+' },
    { label: 'Award Achievements', value: '25,000+' }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section text-white py-5 position-relative overflow-hidden" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)' }}>
        <div className="hero-blobs position-absolute w-100 h-100 top-0 start-0" style={{ zIndex: 0, opacity: 0.3 }}>
          <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'white', borderRadius: '50%', filter: 'blur(100px)' }}></div>
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: '#7209b7', borderRadius: '50%', filter: 'blur(150px)' }}></div>
        </div>

        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
              <Badge bg="light" text="dark" className="px-3 py-2 mb-3 rounded-pill fw-bold shadow-sm text-uppercase">
                Advanced Digital Education
              </Badge>
              <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: '1.2' }}>
                Master New Skills with <span style={{ color: '#fff', textDecoration: 'underline' }}>EduLearn</span>
              </h1>
              <p className="lead mb-5 opacity-90">
                A world-class platform designed for curious minds. Join thousands of students and instructors
                transforming their careers through interactive and comprehensive courses.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/register">
                  <Button size="lg" className="px-5 py-3 rounded-pill border-0 shadow" style={{ background: '#fff', color: '#4361ee', fontWeight: 'bold' }}>
                    Start Learning Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline-light" className="px-5 py-3 rounded-pill border-2 fw-bold">
                    Instructor Portal
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="hero-img-container p-4 rounded-4 shadow-lg ms-auto" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', width: 'fit-content' }}>
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Group Learning"
                  className="rounded-4 img-fluid"
                  style={{ maxWidth: '500px' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-bar py-4 shadow-sm position-relative" style={{ marginTop: '-50px', zIndex: 2 }}>
        <Container>
          <Row className="bg-white rounded-4 shadow p-4 text-center g-4 mx-0">
            {stats.map((stat, idx) => (
              <Col md={3} sm={6} key={idx} className={idx < 3 ? 'border-end-md' : ''}>
                <div className="p-2">
                  <h3 className="fw-bold mb-0 text-primary">{stat.value}</h3>
                  <p className="text-muted mb-0 small uppercase fw-bold ls-1">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Courses */}
      <section className="featured-courses py-5 bg-white">
        <Container className="py-5">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h6 className="text-primary fw-bold text-uppercase ls-2">Curated for you</h6>
              <h2 className="display-5 fw-bold text-dark">Explore Our <span className="text-primary">Best Courses</span></h2>
            </div>
            <Link to="/courses" className="text-primary fw-bold text-decoration-none d-none d-md-block">
              View All Courses &rarr;
            </Link>
          </div>

          <Row className="g-4">
            {loading ? (
              [1, 2, 3, 4].map(n => (
                <Col md={3} key={n}>
                  <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100 placeholder-glow">
                    <div className="placeholder bg-secondary" style={{ height: '180px', width: '100%' }}></div>
                    <Card.Body>
                      <div className="placeholder w-75 mb-3"></div>
                      <div className="placeholder w-50"></div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              featuredCourses.map(course => (
                <Col lg={3} md={6} key={course._id}>
                  <Card className="course-card border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-up">
                    <div className="position-relative">
                      <img
                        src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={course.title}
                        className="card-img-top"
                        style={{ height: '180px', objectFit: 'cover' }}
                      />
                      <Badge bg="primary" className="position-absolute top-0 end-0 m-3 shadow-sm px-3 py-2 rounded-pill">
                        ₹{course.price}
                      </Badge>
                    </div>
                    <Card.Body className="p-4">
                      <h5 className="fw-bold mb-2 line-clamp-2">{course.title}</h5>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="text-muted small">Prof. {course.instructor?.name}</span>
                      </div>
                      <Link to={`/student/course/${course._id}`} className="stretched-link"></Link>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <Badge bg="light" text="dark" className="border text-capitalize">{course.level}</Badge>
                        <span className="text-primary fw-bold">Enroll &rarr;</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>

      {/* Features/Why Us */}
      <section className="why-us py-5" style={{ background: '#f8f9fa' }}>
        <Container className="py-5">
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <h6 className="text-primary fw-bold text-uppercase ls-2">Why EduLearn?</h6>
              <h2 className="display-6 fw-bold mb-4">A Learning Experience Built Around You</h2>
              <p className="text-muted lead mb-4">We've combined the power of the MERN stack with modern teaching methodologies to provide a seamless, interactive environment.</p>
              <div className="feature-list">
                {[
                  { title: 'Learn At Your Pace', desc: 'Lifetime access to your courses and modules.' },
                  { title: 'Interactive Quizzes', desc: 'Test your knowledge with real-time feedback.' },
                  { title: 'Verified Certificates', desc: 'Showcase your achievements to the world.' },
                  { title: 'Direct Mentor Support', desc: 'Chat with instructors and fellow learners.' }
                ].map((f, i) => (
                  <div key={i} className="d-flex gap-3 mb-4">
                    <div className="feature-icon p-2 rounded-circle bg-primary text-white shadow-sm h-fit d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{f.title}</h6>
                      <p className="text-muted small mb-0">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={7}>
              <Row className="g-4">
                <Col sm={6}>
                  <div className="p-4 bg-white rounded-4 shadow-sm border-start border-primary border-5 mt-lg-5">
                    <h4 className="fw-bold mb-3">For Students</h4>
                    <p className="text-muted small">Master complex subjects with easy-to-follow video lessons and progress tracking.</p>
                    <Link to="/register" className="btn btn-sm btn-link text-primary p-0 fw-bold">Create Account &rarr;</Link>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="p-4 bg-white rounded-4 shadow-sm border-start border-success border-5">
                    <h4 className="fw-bold mb-3">For Instructors</h4>
                    <p className="text-muted small">Share your knowledge with a global audience and build your professional brand.</p>
                    <Link to="/register?role=instructor" className="btn btn-sm btn-link text-success p-0 fw-bold">Become a Mentor &rarr;</Link>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>


      <style dangerouslySetInnerHTML={{
        __html: `
        .transition-up {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .transition-up:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .ls-1 { letter-spacing: 1px; }
        .ls-2 { letter-spacing: 2px; }
        .border-end-md { border-right: 1px solid #eee; }
        @media (max-width: 768px) {
            .border-end-md { border-right: 0; }
        }
        .h-fit { height: fit-content; }
        .hero-section::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66 3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-45c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm26 26c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-1-54c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM27 46c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm21 23c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-4-48c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm34 37c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM9 45c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm29-38c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm67 71c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM82 66c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM56 14c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM14 64c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm77-40c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM65 8c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM24 28c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm44 63c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM9 22c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm20 77c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM61 25c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm29 32c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM28 61c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm40-40c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM25 81c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm14 19c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-25-7c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm93 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-3-81c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM14 26c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm81 5c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-67-4c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM87 47c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM40 91c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm41-71c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM17 10c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm67 71c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM12 51c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm76 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM2 36c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm10 46c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM99 36c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-10 46c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM82 82c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-54 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm6-68c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm40 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM66 2c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM34 2c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM93 93c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM7 93c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM93 7c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM7 7c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
            z-index: 1;
        }
      ` }} />
    </div>
  );
};

export default HomePage;
