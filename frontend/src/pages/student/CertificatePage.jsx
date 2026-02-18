import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Button, Card, Spinner, Alert, Row, Col } from "react-bootstrap";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const CertificatePage = () => {
  const { id: courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const certificateRef = useRef();

  useEffect(() => {
    const fetchCompletionData = async () => {
      try {
        setLoading(true);
        // Verify progress is 100%
        const progressRes = await api.get(`/progress/${courseId}`);
        if (progressRes.data.percentage < 100) {
          setError("You haven't completed this course yet. Please finish all lessons to claim your certificate.");
          setLoading(false);
          return;
        }

        const courseRes = await api.get(`/courses/${courseId}`);
        setCourse(courseRes.data);
      } catch (err) {
        console.error("Certificate error:", err);
        setError("Failed to generate certificate. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletionData();
  }, [courseId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Container className="d-flex justify-content-center py-5"><Spinner animation="border" /></Container>;
  if (error) return (
    <Container className="py-5 text-center">
      <Alert variant="warning" className="mb-4">{error}</Alert>
      <Link to={`/student/learn/${courseId}`}>
        <Button variant="primary" className="rounded-pill px-4">Return to Course</Button>
      </Link>
    </Container>
  );

  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="certificate-page py-5" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-5 no-print">
          <Link to="/student/dashboard" className="text-decoration-none text-dark fw-bold">
            &larr; Back to Dashboard
          </Link>
          <div className="d-flex gap-3">
            <Button variant="outline-primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={handlePrint}>
              🖨️ Download as PDF
            </Button>
            <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" style={{ background: '#0077b5', border: 'none' }}>
              in Share on LinkedIn
            </Button>
          </div>
        </div>

        {/* The Certificate Container */}
        <div className="certificate-outer shadow-lg mx-auto bg-white p-4 p-md-5 position-relative overflow-hidden" ref={certificateRef} style={{ maxWidth: '1000px', border: '15px solid #1a1a1a' }}>

          {/* Ornamental Border */}
          <div className="certificate-inner position-relative p-5" style={{ border: '2px solid #d4af37', minHeight: '600px' }}>

            {/* EDUlearn Logo Seal */}
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-0" style={{ color: '#1a1a1a', letterSpacing: '4px' }}>EDULearn</h2>
              <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                <div style={{ height: '2px', width: '30px', background: '#d4af37' }}></div>
                <small className="text-uppercase fw-bold" style={{ color: '#d4af37', letterSpacing: '2px' }}>Online Academy</small>
                <div style={{ height: '2px', width: '30px', background: '#d4af37' }}></div>
              </div>
            </div>

            <div className="text-center mb-5">
              <h5 className="text-uppercase mb-4" style={{ letterSpacing: '4px', opacity: 0.6 }}>Certificate of Completion</h5>
              <p className="mb-0">This is to certify that</p>
              <h1 className="display-3 fw-bold my-4" style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a1a' }}>{user?.name}</h1>
              <p className="mb-0">has successfully completed all requirements for the course</p>
              <h3 className="fw-bold mt-4 mb-5 text-primary" style={{ letterSpacing: '1px' }}>{course?.title}</h3>
            </div>

            <div className="row mt-5 align-items-end">
              <Col className="text-center">
                <div className="mb-2" style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.5rem', color: '#1a1a1a' }}>{course?.instructor?.name || 'Authorized Instructor'}</div>
                <div style={{ height: '1px', width: '150px', background: '#ccc', margin: '0 auto' }}></div>
                <small className="d-block mt-2 text-uppercase fw-bold opacity-50">Instructor</small>
              </Col>
              <Col className="text-center">
                <div className="certificate-seal mx-auto mb-3 d-flex align-items-center justify-content-center shadow" style={{ width: '100px', height: '100px', background: '#d4af37', borderRadius: '50%', border: '5px double white' }}>
                  <div className="text-white fw-bold text-center" style={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
                    EDU<br />OFFICIAL<br />SEAL
                  </div>
                </div>
              </Col>
              <Col className="text-center">
                <div className="mb-2 fw-bold" style={{ color: '#1a1a1a' }}>{completionDate}</div>
                <div style={{ height: '1px', width: '150px', background: '#ccc', margin: '0 auto' }}></div>
                <small className="d-block mt-2 text-uppercase fw-bold opacity-50">Date of Completion</small>
              </Col>
            </div>

            {/* Corner Accents */}
            <div className="position-absolute" style={{ top: '-10px', left: '-10px', fontSize: '3rem', color: '#d4af37' }}>⭐</div>
            <div className="position-absolute" style={{ top: '-10px', right: '-10px', fontSize: '3rem', color: '#d4af37' }}>⭐</div>
            <div className="position-absolute" style={{ bottom: '-10px', left: '-10px', fontSize: '3rem', color: '#d4af37' }}>⭐</div>
            <div className="position-absolute" style={{ bottom: '-10px', right: '-10px', fontSize: '3rem', color: '#d4af37' }}>⭐</div>
          </div>

          {/* Security Watermark */}
          <div className="position-absolute top-50 start-50 translate-middle opacity-05 pointer-events-none" style={{ fontSize: '15rem', transform: 'translate(-50%, -50%) rotate(-30deg)', color: '#000', zIndex: 0, pointerEvents: 'none' }}>
            VERIFIED
          </div>
        </div>

        <div className="text-center mt-5 no-print">
          <p className="text-muted small">Certificate ID: ED-{courseId?.substring(0, 8)}-{user?.id?.substring(0, 6)}</p>
          <p className="text-muted small">Verify this certificate at edulearn.com/verify</p>
        </div>
      </Container>

      <style dangerouslySetInnerHTML={{
        __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Dancing+Script:wght@700&display=swap');
                
                .certificate-outer {
                    aspect-ratio: 1.414 / 1;
                }
                
                .opacity-05 { opacity: 0.03; }
                
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                    .certificate-page { padding: 0 !important; background: white !important; }
                    .certificate-outer { box-shadow: none !important; border: 10px solid #1a1a1a !important; margin: 0 !important; }
                }

                @media (max-width: 768px) {
                    .certificate-outer { aspect-ratio: auto; }
                    .display-3 { font-size: 2.5rem; }
                }
            ` }} />
    </div>
  );
};

export default CertificatePage;