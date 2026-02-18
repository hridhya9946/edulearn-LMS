import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-premium bg-white text-dark py-5 mt-auto border-top">
            <Container className="py-4">
                <Row className="g-5">
                    {/* Brand & Mission */}
                    <Col lg={4} md={12}>
                        <div className="footer-brand-section pe-lg-5">
                            <h2 className="fw-bold mb-4 text-primary" style={{ letterSpacing: '1px' }}>EduLearn</h2>
                            <p className="text-secondary opacity-80 mb-4 lh-base">
                                Revolutionizing digital education through interactive learning experiences.
                                We empower over 15,000+ students globally to master the skills of tomorrow.
                            </p>
                            <div className="d-flex gap-3 mb-4">
                                {[
                                    { name: 'twitter', icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" /></svg> },
                                    { name: 'facebook', icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" /></svg> },
                                    { name: 'linkedin', icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" /></svg> },
                                    { name: 'instagram', icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76c-.198.509-.333 1.071-.373 1.923C.011 5.556 0 5.829 0 8s.01 2.444.048 3.297c.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.829 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.444 16 10.171 16 8s-.01-2.444-.048-3.297c-.04-.852-.175-1.433-.372-1.942a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 8 0zm0 1.44c2.136 0 2.389.008 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" /></svg> },
                                    { name: 'github', icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg> }
                                ].map((social) => (
                                    <a key={social.name} href={`#${social.name}`} className="social-pill d-flex align-items-center justify-content-center transition-all text-decoration-none">
                                        <div className="bg-light border rounded-circle p-2 d-flex align-items-center justify-content-center text-dark" style={{ width: '40px', height: '40px' }}>
                                            {social.icon}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </Col>

                    {/* Quick Navigation */}
                    <Col lg={2} md={4} sm={6}>
                        <h6 className="text-uppercase fw-bold mb-4 ls-1 text-dark">Platform</h6>
                        <ul className="list-unstyled footer-links opacity-75">
                            <li className="mb-3"><Link to="/courses" className="text-decoration-none text-secondary transition-all hover-primary">Explore Courses</Link></li>
                            <li className="mb-3"><Link to="/student/dashboard" className="text-decoration-none text-secondary transition-all hover-primary">My Learning</Link></li>
                            <li className="mb-3"><Link to="/register?role=instructor" className="text-decoration-none text-secondary transition-all hover-primary">Become Instructor</Link></li>
                            <li className="mb-3"><Link to="/profile" className="text-decoration-none text-secondary transition-all hover-primary">Student Profile</Link></li>
                            <li className="mb-3"><Link to="/admin" className="text-decoration-none text-secondary transition-all hover-primary">Administration</Link></li>
                        </ul>
                    </Col>

                    {/* Support & Legal */}
                    <Col lg={2} md={4} sm={6}>
                        <h6 className="text-uppercase fw-bold mb-4 ls-1 text-dark">Support</h6>
                        <ul className="list-unstyled footer-links opacity-75">
                            <li className="mb-3"><a href="#help" className="text-decoration-none text-secondary transition-all hover-primary">Help Center</a></li>
                            <li className="mb-3"><a href="#contact" className="text-decoration-none text-secondary transition-all hover-primary">Contact Us</a></li>
                            <li className="mb-3"><a href="#privacy" className="text-decoration-none text-secondary transition-all hover-primary">Privacy Policy</a></li>
                            <li className="mb-3"><a href="#terms" className="text-decoration-none text-secondary transition-all hover-primary">Terms of Service</a></li>
                            <li className="mb-3"><a href="#faqs" className="text-decoration-none text-secondary transition-all hover-primary">Global FAQs</a></li>
                        </ul>
                    </Col>

                    {/* Newsletter & Contact */}
                    <Col lg={4} md={4}>
                        <h6 className="text-uppercase fw-bold mb-4 ls-1 text-dark">Stay Updated</h6>
                        <p className="text-secondary small mb-4 opacity-75">Join our community for weekly tips, course updates, and exclusive student discounts.</p>
                        <div className="d-flex gap-2 mb-4">
                            <Form.Control
                                type="email"
                                placeholder="Email Address"
                                className="bg-light border text-dark px-3 rounded-pill py-2"
                                style={{ boxShadow: 'none' }}
                            />
                            <Button variant="primary" className="rounded-pill px-4 fw-bold">Sign Up</Button>
                        </div>
                        <div className="contact-details opacity-75">
                            <div className="d-flex align-items-center gap-3 mb-2">
                                <small className="text-secondary">Highland Tech Park, Block 7, Digital City</small>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <small className="text-secondary">support@edulearn.com</small>
                            </div>
                        </div>
                    </Col>
                </Row>

                <hr className="my-5 opacity-10" />

                <Row className="align-items-center py-2">
                    <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
                        <div className="text-secondary small opacity-50">
                            © {new Date().getFullYear()} EduLearn Academy Inc.
                        </div>
                    </Col>
                    <Col md={6} className="text-center text-md-end">
                        <div className="d-flex justify-content-center justify-content-md-end gap-3 opacity-50 small text-secondary">
                            <span className="cursor-pointer hover-dark">Sitemap</span>
                            <span className="cursor-pointer hover-dark">Security</span>
                            <span className="cursor-pointer hover-dark">Cookies</span>
                        </div>
                    </Col>
                </Row>
            </Container>

            <style dangerouslySetInnerHTML={{
                __html: `
                .footer-premium { border-top: 1px solid rgba(0,0,0,0.05); }
                .ls-1 { letter-spacing: 1px; }
                .transition-all { transition: all 0.3s ease; }
                .hover-primary:hover { color: #007bff !important; padding-left: 5px; }
                .hover-dark:hover { color: #000 !important; cursor: pointer; }
                .social-pill:hover { transform: translateY(-5px); }
                .social-pill:hover .bg-light { background-color: #007bff !important; border-color: #007bff !important; color: white !important; }
                .cursor-pointer { cursor: pointer; }
            ` }} />
        </footer>
    );
};

export default Footer;
