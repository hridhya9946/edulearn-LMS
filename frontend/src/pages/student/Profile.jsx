import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab, Form, Badge, Modal, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('about');
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        title: user?.title || '',
        bio: user?.bio || '',
        phoneNumber: user?.phoneNumber || '',
        location: user?.location || '',
        skills: user?.skills?.join(', ') || '',
        github: user?.socialLinks?.github || '',
        linkedin: user?.socialLinks?.linkedin || '',
        twitter: user?.socialLinks?.twitter || '',
        website: user?.socialLinks?.website || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await api.get('/enrollments/my-courses');
                setEnrollments(res.data);
            } catch (err) {
                console.error("Failed to fetch enrollments:", err);
            }
        };

        if (user && user.role !== 'admin') {
            fetchEnrollments();
        }
    }, [user]);

    const isAdmin = user?.role === 'admin';

    // Different stats based on role
    const stats = isAdmin ? [
        { label: 'Platform Users', value: '2,450', color: '#6366f1' },
        { label: 'Active Courses', value: '184', color: '#10b981' },
        { label: 'Pending Approvals', value: '12', color: '#f59e0b' },
        { label: 'System Health', value: '99.9%', color: '#ec4899' }
    ] : [
        { label: 'Courses Enrolled', value: enrollments.length.toString(), color: '#4cc9f0' },
        { label: 'Completed', value: enrollments.filter(e => e.completed).length.toString(), color: '#4361ee' },
        { label: 'Certificates', value: enrollments.filter(e => e.completed).length.toString(), color: '#7209b7' },
        { label: 'Points', value: (enrollments.filter(e => e.completed).length * 250).toLocaleString(), color: '#f72585' }
    ];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
            const updateData = {
                name: formData.name,
                title: formData.title,
                bio: formData.bio,
                phoneNumber: formData.phoneNumber,
                location: formData.location,
                skills: skillsArray,
                socialLinks: {
                    github: formData.github,
                    linkedin: formData.linkedin,
                    twitter: formData.twitter,
                    website: formData.website
                }
            };

            const res = await api.put('/auth/profile', updateData);

            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setMessage({ type: 'success', text: 'Profile updated successfully! Refreshing...' });
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
            setShowEditModal(false);
        }
    };

    const coverImageUrl = isAdmin
        ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // High-tech earth
        : "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"; // Abstract blue

    const profilePlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=${isAdmin ? '1e293b' : 'random'}&color=fff&size=256`;

    return (
        <div className="profile-page py-5" style={{ minHeight: '100vh', background: isAdmin ? '#f1f5f9' : '#f8f9fa' }}>
            <Container>
                {/* Profile Card */}
                <Card className={`border-0 shadow-lg overflow-hidden position-relative mb-5 ${isAdmin ? 'admin-card-glow' : ''}`} style={{ borderRadius: '20px' }}>
                    {/* Cover Photo */}
                    <div
                        style={{
                            height: '350px',
                            backgroundImage: `url(${user?.coverImage || coverImageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '150px',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))'
                        }}></div>
                        {isAdmin && (
                            <Badge bg="danger" className="position-absolute top-0 end-0 m-4 px-3 py-2 rounded-pill shadow-lg border border-2 border-white" style={{ fontSize: '0.9rem', zIndex: 10 }}>
                                SUPER ADMIN PRIVILEGES
                            </Badge>
                        )}
                    </div>

                    <Card.Body className="px-5 pb-5 pt-0">
                        <Row className="align-items-end" style={{ marginTop: '-100px' }}>
                            <Col xs="auto" className="position-relative">
                                <div style={{
                                    padding: '5px',
                                    background: 'white',
                                    borderRadius: '30px',
                                    display: 'inline-block',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                                }}>
                                    <img
                                        src={user?.profilePicture || profilePlaceholder}
                                        alt="Profile"
                                        style={{
                                            width: '180px',
                                            height: '180px',
                                            borderRadius: '25px',
                                            objectFit: 'cover',
                                            border: isAdmin ? '4px solid #1e293b' : 'none'
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col className="pb-3 ms-md-3">
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-4">
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <h1 className="mb-0 fw-bold text-dark">{user?.name}</h1>
                                        </div>
                                        <p className="text-muted mb-0 d-flex align-items-center gap-2">
                                            <span style={{ fontSize: '1.2rem', fontWeight: 500 }} className={isAdmin ? 'text-primary' : ''}>
                                                {isAdmin ? 'System Architect' : (user?.title || 'Learning Enthusiast')}
                                            </span>
                                            {user?.location && <span>• {user.location}</span>}
                                        </p>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <Button
                                            variant="outline-dark"
                                            className="px-4 py-2 rounded-pill fw-bold"
                                            onClick={() => setShowEditModal(true)}
                                        >
                                            Update Profile
                                        </Button>
                                        {isAdmin && (
                                            <Button
                                                variant="dark"
                                                className="px-4 py-2 rounded-pill shadow-sm fw-bold border-0"
                                                style={{ background: '#1e293b' }}
                                                onClick={() => navigate('/admin/dashboard')}
                                            >
                                                Go to Terminal
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {message.text && <Alert variant={message.type} className="mb-4 rounded-4 shadow-sm">{message.text}</Alert>}

                <Row className="g-4">
                    {/* Left Column: Stats & Socials */}
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4">{isAdmin ? 'Platform Vitality' : 'Learning Snapshot'}</h5>
                                <Row className="g-3">
                                    {stats.map((stat, idx) => (
                                        <Col xs={6} key={idx}>
                                            <div className="p-3 text-center rounded-4 transition-all hover-scale" style={{ background: `${stat.color}08`, border: `1px solid ${stat.color}15` }}>
                                                <h3 className="fw-bold mb-0" style={{ color: stat.color, letterSpacing: '-0.5px' }}>{stat.value}</h3>
                                                <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem', opacity: 0.8 }}>{stat.label}</small>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4">Network & Identity</h5>
                                <div className="d-flex flex-column gap-3">
                                    {(user?.socialLinks?.github || isAdmin) && (
                                        <a href={user?.socialLinks?.github || "#"} className="text-decoration-none d-flex align-items-center gap-3 p-3 rounded-4 bg-light hover-bg-light transition-all">
                                            <div className="p-2 rounded-circle bg-dark text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                                                <span style={{ fontSize: '1.2rem' }}>GitHub</span>
                                            </div>
                                            <span className="text-dark fw-bold">System Repository</span>
                                        </a>
                                    )}
                                    {(user?.socialLinks?.linkedin || isAdmin) && (
                                        <a href={user?.socialLinks?.linkedin || "#"} className="text-decoration-none d-flex align-items-center gap-3 p-3 rounded-4 bg-light hover-bg-light transition-all">
                                            <div className="p-2 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                                                <span style={{ fontSize: '1.2rem' }}>in</span>
                                            </div>
                                            <span className="text-dark fw-bold">Professional Network</span>
                                        </a>
                                    )}
                                    <div className="p-3 rounded-4 bg-opacity-10 bg-info mt-2">
                                        <small className="text-info d-block fw-bold mb-1">REGISTRATION IDENTITY</small>
                                        <p className="text-dark mb-0 small font-monospace truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Right Column: bio & Content */}
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                            <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                                <Tab.Container id="profile-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                                    <Nav variant="pills" className="custom-pills gap-3">
                                        <Nav.Item>
                                            <Nav.Link eventKey="about" className="rounded-pill px-4 py-2 fw-bold">{isAdmin ? 'Overview' : 'About'}</Nav.Link>
                                        </Nav.Item>
                                        {isAdmin && (
                                            <Nav.Item>
                                                <Nav.Link eventKey="controls" className="rounded-pill px-4 py-2 fw-bold">System Control</Nav.Link>
                                            </Nav.Item>
                                        )}
                                        {!isAdmin && (
                                            <>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="journey" className="rounded-pill px-4 py-2 fw-bold">Journey</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="certificates" className="rounded-pill px-4 py-2 fw-bold">Certificates</Nav.Link>
                                                </Nav.Item>
                                            </>
                                        )}
                                    </Nav>
                                </Tab.Container>
                            </Card.Header>
                            <Card.Body className="p-4 mt-3">
                                {activeTab === 'about' && (
                                    <div>
                                        <h5 className="fw-bold mb-3">{isAdmin ? 'Operational Mission' : 'Biography'}</h5>
                                        <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                                            {user?.bio || (isAdmin ? "Primary system overseer responsible for platform integrity, content moderation, and administrative workflows." : "No biography provided yet. Tell the world about your learning journey!")}
                                        </p>

                                        <h5 className="fw-bold mt-5 mb-3">{isAdmin ? 'Administrative Clusters' : 'Skills & Expertise'}</h5>
                                        <div className="d-flex flex-wrap gap-2">
                                            {user?.skills && user.skills.length > 0 ? (
                                                user.skills.map((skill, idx) => (
                                                    <Badge key={idx} bg="white" text="dark" className="px-4 py-2 border rounded-pill fw-bold shadow-sm">
                                                        {skill}
                                                    </Badge>
                                                ))
                                            ) : (
                                                isAdmin ? (
                                                    ['User Governance', 'Content Strategy', 'API Orchestration', 'Database Management'].map((skill, idx) => (
                                                        <Badge key={idx} bg="white" text="dark" className="px-4 py-2 border rounded-pill fw-bold shadow-sm">
                                                            {skill}
                                                        </Badge>
                                                    ))
                                                ) : <p className="text-muted small">No skills added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'controls' && isAdmin && (
                                    <div className="admin-controls py-2">
                                        <h5 className="fw-bold mb-4">Command Shortcuts</h5>
                                        <Row className="g-4">
                                            {[
                                                { title: 'User Governance', desc: 'Manage access levels and profiles.', icon: 'Account', link: '/admin/users' },
                                                { title: 'Content Engine', desc: 'Approve or moderate new courses.', icon: 'Layers', link: '/admin/courses/pending' },
                                                { title: 'System Analytics', desc: 'Inspect platform vitality data.', icon: 'Chart', link: '/admin/analytics' },
                                                { title: 'Global Settings', desc: 'Configure core platform params.', icon: 'Settings', link: '/admin/settings' }
                                            ].map((ctrl, idx) => (
                                                <Col md={6} key={idx}>
                                                    <Card className="border shadow-none rounded-4 hover-bg-light transition-all cursor-pointer" onClick={() => navigate(ctrl.link)}>
                                                        <Card.Body className="d-flex gap-3 align-items-center">
                                                            <div className="bg-light rounded-circle p-2 px-3 shadow-small fw-bold text-primary" style={{ fontSize: '0.9rem' }}>{ctrl.icon}</div>
                                                            <div>
                                                                <h6 className="fw-bold mb-0">{ctrl.title}</h6>
                                                                <small className="text-muted">{ctrl.desc}</small>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                )}

                                {activeTab === 'journey' && !isAdmin && (
                                    <div className="py-2">
                                        <h5 className="fw-bold mb-4">Your Progress Engine</h5>
                                        {enrollments.length > 0 ? (
                                            <div className="d-flex flex-column gap-4">
                                                {enrollments.map((enrollment, idx) => {
                                                    const totalLessons = enrollment.course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
                                                    const completedCount = enrollment.completedLessons?.length || 0;
                                                    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

                                                    return (
                                                        <Card key={idx} className="border-0 shadow-sm rounded-4 overflow-hidden bg-light transition-all hover-scale">
                                                            <Card.Body className="p-4">
                                                                <Row className="align-items-center">
                                                                    <Col md={2} className="d-none d-md-block">
                                                                        <img
                                                                            src={enrollment.course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80"}
                                                                            alt="Course"
                                                                            className="rounded-3 shadow-sm"
                                                                            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                                                                        />
                                                                    </Col>
                                                                    <Col md={10}>
                                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                                            <div>
                                                                                <Badge bg={enrollment.completed ? "success" : "primary"} className="mb-2 px-3 py-2 rounded-pill shadow-small">
                                                                                    {enrollment.completed ? 'COMPLETED' : 'IN PROGRESS'}
                                                                                </Badge>
                                                                                <h5 className="fw-bold mb-1">{enrollment.course?.title}</h5>
                                                                                <p className="text-muted small mb-3">Enrolled on {new Date(enrollment.createdAt).toLocaleDateString()}</p>
                                                                            </div>
                                                                            <h4 className="fw-bold text-primary mb-0">{progress}%</h4>
                                                                        </div>

                                                                        <div className="progress rounded-pill mb-3" style={{ height: '8px' }}>
                                                                            <div
                                                                                className={`progress-bar rounded-pill ${enrollment.completed ? 'bg-success' : 'bg-primary'}`}
                                                                                role="progressbar"
                                                                                style={{ width: `${progress}%` }}
                                                                            ></div>
                                                                        </div>

                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <small className="text-muted fw-bold">
                                                                                {completedCount} / {totalLessons} Lessons Mastered
                                                                            </small>
                                                                            <Button
                                                                                variant={enrollment.completed ? "outline-dark" : "dark"}
                                                                                size="sm"
                                                                                className="rounded-pill px-4 fw-bold shadow-sm"
                                                                                onClick={() => navigate(`/student/learn/${enrollment.course?._id}`)}
                                                                            >
                                                                                {enrollment.completed ? 'Review Material' : 'Resume Learning'}
                                                                            </Button>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </Card.Body>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <div className="mb-3 opacity-25 display-4">🛤️</div>
                                                <p className="text-muted mx-auto" style={{ maxWidth: '400px' }}>You haven't embarked on any learning journeys yet. Start a course to begin your path to mastery!</p>
                                                <Button variant="primary" className="rounded-pill px-5 py-2 mt-3 fw-bold shadow-sm" onClick={() => navigate('/courses')}>Explore Courses</Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'certificates' && !isAdmin && (
                                    <div className="py-2">
                                        <h5 className="fw-bold mb-4">Your Achievement Vault</h5>
                                        {enrollments.filter(e => e.completed).length > 0 ? (
                                            <Row className="g-4">
                                                {enrollments.filter(e => e.completed).map((enrollment, idx) => (
                                                    <Col md={6} key={idx}>
                                                        <Card className="border shadow-none rounded-4 hover-scale transition-all overflow-hidden h-100">
                                                            <div className="p-4 text-center bg-light border-bottom position-relative overflow-hidden">
                                                                <div className="certificate-icon display-4 mb-2">📜</div>
                                                                <h6 className="fw-bold mb-1">Certificate of Completion</h6>
                                                                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Verified Achievement</small>
                                                            </div>
                                                            <Card.Body className="p-4 d-flex flex-column justify-content-between">
                                                                <div>
                                                                    <h6 className="fw-bold text-dark mb-1">{enrollment.course?.title}</h6>
                                                                    <p className="small text-muted mb-3">Issued on {new Date(enrollment.completedAt || enrollment.updatedAt).toLocaleDateString()}</p>
                                                                </div>
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    className="w-100 rounded-pill fw-bold py-2 border-0 shadow-sm"
                                                                    style={{ background: 'linear-gradient(45deg, #4361ee, #4cc9f0)' }}
                                                                    onClick={() => navigate(`/student/certificate/${enrollment.course?._id}`)}
                                                                >
                                                                    View Full Certificate
                                                                </Button>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        ) : (
                                            <div className="text-center py-5 w-100">
                                                <div className="mb-3 opacity-25 display-4">🏆</div>
                                                <p className="text-muted">Certificates will appear here once you've successfully completed a course.</p>
                                                <Button variant="outline-primary" className="rounded-pill px-4" onClick={() => navigate('/courses')}>Start Learning</Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Edit Profile Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                <Modal.Header closeButton className="border-0 px-4 pt-4">
                    <Modal.Title className="fw-bold">Master Profile Update</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form onSubmit={handleUpdateProfile}>
                        {/* same form fields as before */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-uppercase opacity-75">Public Identity</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Full Name"
                                        className="rounded-4 py-2 bg-light border-0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-uppercase opacity-75">Designation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Senior Software Engineer"
                                        className="rounded-4 py-2 bg-light border-0"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-uppercase opacity-75">Identity Bio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Describe your expertise..."
                                className="rounded-4 py-2 bg-light border-0"
                                style={{ resize: 'none' }}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button variant="link" onClick={() => setShowEditModal(false)} className="text-dark fw-bold text-decoration-none px-4">Close</Button>
                            <Button
                                variant="dark"
                                type="submit"
                                disabled={loading}
                                className="rounded-pill px-5 fw-bold shadow-sm"
                                style={{ background: '#1e293b' }}
                            >
                                {loading ? 'Synchronizing...' : 'Save Configuration'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-pills .nav-link {
          color: #64748b;
          background: #f8fafc;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e2e8f0;
        }
        .custom-pills .nav-link.active {
          background: ${isAdmin ? '#1e293b' : 'linear-gradient(45deg, #4361ee, #4cc9f0)'} !important;
          color: white !important;
          border-color: transparent !important;
          box-shadow: 0 10px 20px -5px ${isAdmin ? 'rgba(30,41,59,0.3)' : 'rgba(67, 97, 238, 0.3)'};
        }
        .admin-card-glow {
            border-top: 5px solid #1e293b !important;
        }
        .hover-scale:hover {
            transform: translateY(-5px);
        }
        .transition-all { transition: all 0.3s ease; }
        .cursor-pointer { cursor: pointer; }
      ` }} />
        </div>
    );
};

export default Profile;
