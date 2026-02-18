import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Badge, Spinner, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../api/instructorApi';
import { useAuth } from '../../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [chartWidth, setChartWidth] = useState(0);
  const containerRef = useRef(null);

  // Mock time-series data for advanced analytics
  const chartData = [
    { name: 'Jan', revenue: 4000, students: 24 },
    { name: 'Feb', revenue: 3000, students: 13 },
    { name: 'Mar', revenue: 2000, students: 98 },
    { name: 'Apr', revenue: 2780, students: 39 },
    { name: 'May', revenue: 1890, students: 48 },
    { name: 'Jun', revenue: 2390, students: 38 },
    { name: 'Jul', revenue: 3490, students: 43 },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsMounted(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useLayoutEffect(() => {
    if (isMounted && containerRef.current) {
      const updateWidth = () => {
        if (containerRef.current) {
          setChartWidth(containerRef.current.offsetWidth);
        }
      };

      const observer = new ResizeObserver(updateWidth);
      observer.observe(containerRef.current);
      updateWidth();

      return () => observer.disconnect();
    }
  }, [isMounted]);

  const fetchDashboardStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.stats);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard stats');
      setLoading(false);
    }
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  return (
    <div className="instructor-command-center py-5" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <Container>
        {/* Hero Section */}
        <div className="hero-section mb-5 p-5 rounded-5 shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', position: 'relative', overflow: 'hidden' }}>
          <div className="position-relative" style={{ zIndex: 2 }}>
            <h6 className="text-uppercase fw-bold opacity-75 ls-2 mb-3">Instructor Command Center</h6>
            <h1 className="display-4 fw-bold mb-3">Welcome Back, {user?.name.split(' ')[0]}!</h1>
            <p className="lead opacity-75 mb-4 max-w-600">Your courses are reaching <span className="text-info fw-bold">{stats?.totalStudents || 0}</span> students globally. Here's your impact overview for today.</p>
            <div className="d-flex gap-3">
              <Button variant="info" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => navigate('/instructor/courses/create')}>+ Create New Course</Button>
              <Button variant="outline-light" className="rounded-pill px-4 fw-bold" onClick={() => navigate('/instructor/courses')}>Course Portfolio</Button>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="position-absolute top-0 end-0 opacity-10" style={{ fontSize: '15rem', transform: 'translate(20%, -20%)' }}>👨‍🏫</div>
        </div>

        {error && <Alert variant="danger" className="rounded-4 mb-5 shadow-sm border-0">{error}</Alert>}

        {/* KPI Grid */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total Earnings', value: `₹${stats?.totalRevenue || 0}`, icon: '💰', color: '#10b981' },
            { label: 'Total Students', value: stats?.totalStudents || 0, icon: '🎓', color: '#6366f1' },
            { label: 'Active Courses', value: stats?.activeCourses || 0, icon: '📚', color: '#f59e0b' },
            { label: 'Avg. Completion', value: `${stats?.avgCompletionRate || 0}%`, icon: '📈', color: '#3b82f6' }
          ].map((kpi, idx) => (
            <Col lg={3} md={6} key={idx}>
              <Card className="border-0 shadow-sm rounded-4 h-100 kpi-card overflow-hidden">
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="p-3 rounded-4" style={{ background: `${kpi.color}15`, color: kpi.color, fontSize: '1.5rem' }}>{kpi.icon}</div>
                    <Badge bg="light" text="dark" className="border opacity-75 text-uppercase x-small">Today</Badge>
                  </div>
                  <h3 className="fw-bold mb-1">{kpi.value}</h3>
                  <p className="text-muted small mb-0 fw-bold text-uppercase opacity-75">{kpi.label}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Advanced Analytics */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Earnings Performance</h5>
                  <Form.Select size="sm" style={{ width: '120px' }} className="rounded-pill border-0 bg-light fw-bold">
                    <option>Last 7 Months</option>
                  </Form.Select>
                </div>
                <div
                  ref={containerRef}
                  style={{ width: '100%', minHeight: '300px', position: 'relative', minWidth: 0, overflow: 'hidden' }}
                >
                  {(isMounted && chartWidth > 0) && (
                    <ResponsiveContainer width={chartWidth} aspect={2.5} debounce={0}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Quick Action Hub</h5>
                <div className="d-grid gap-3">
                  <Link to="/instructor/courses" className="text-decoration-none">
                    <div className="p-3 rounded-4 action-item transition-all d-flex align-items-center gap-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '1.2rem' }}>📂</div>
                      <div>
                        <div className="fw-bold mb-0">Course Central</div>
                        <small className="text-muted">Manage your content</small>
                      </div>
                    </div>
                  </Link>
                  <Link to="/instructor/assignments" className="text-decoration-none">
                    <div className="p-3 rounded-4 action-item transition-all d-flex align-items-center gap-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '1.2rem' }}>📝</div>
                      <div>
                        <div className="fw-bold mb-0">Assignment Suite</div>
                        <small className="text-muted">Review student work</small>
                      </div>
                    </div>
                  </Link>
                  <Link to="/instructor/quizzes" className="text-decoration-none">
                    <div className="p-3 rounded-4 action-item transition-all d-flex align-items-center gap-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '1.2rem' }}>⚡</div>
                      <div>
                        <div className="fw-bold mb-0">Quiz Engine</div>
                        <small className="text-muted">Assess knowledge</small>
                      </div>
                    </div>
                  </Link>
                </div>
                <hr className="my-4 opacity-10" />
                <div className="p-4 rounded-4 text-white text-center shadow-sm" style={{ background: 'linear-gradient(45deg, #6366f1, #8b5cf6)' }}>
                  <h6 className="fw-bold mb-2">Need Expert Help?</h6>
                  <p className="x-small mb-3">Book a 1-on-1 session with our pedagogy experts.</p>
                  <Button variant="light" size="sm" className="rounded-pill px-3 fw-bold">Consult Now</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Activity Feed */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <Card.Header className="bg-white p-4 border-bottom border-light d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Real-time Activity Pulse</h5>
                <Badge bg="light" text="dark" className="border px-3 rounded-pill opacity-75 fw-normal">Latest 10 Events</Badge>
              </Card.Header>
              <Card.Body className="p-0">
                {stats?.recentEnrollments && stats.recentEnrollments.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                      <thead className="bg-light">
                        <tr className="border-0">
                          <th className="px-4 py-3 border-0 x-small text-uppercase fw-bold opacity-50">Student</th>
                          <th className="py-3 border-0 x-small text-uppercase fw-bold opacity-50">Enrolled Course</th>
                          <th className="py-3 border-0 x-small text-uppercase fw-bold opacity-50">Enrollment Date</th>
                          <th className="py-3 border-0 x-small text-uppercase fw-bold opacity-50">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentEnrollments.map((enrollment, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                                  {enrollment.student?.name?.charAt(0) || 'S'}
                                </div>
                                <div>
                                  <div className="fw-bold mb-0">{enrollment.student?.name || 'Anonymous Student'}</div>
                                  <div className="x-small text-muted">{enrollment.student?.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 fw-bold text-primary opacity-75">{enrollment.course?.title || 'N/A'}</td>
                            <td className="py-3 text-muted">{new Date(enrollment.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 text-success"><Badge bg="success" pill className="bg-opacity-10 text-success fw-bold">Success</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-5 opacity-50">
                    <div style={{ fontSize: '3rem' }}>💤</div>
                    <h5 className="mt-3">No recent activities to show.</h5>
                    <p className="small">Your student activity will appear here once they enroll in your courses.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style dangerouslySetInnerHTML={{
        __html: `
                .ls-2 { letter-spacing: 2px; }
                .max-w-600 { max-width: 600px; }
                .x-small { font-size: 0.7rem; }
                .kpi-card { transition: all 0.3s ease; }
                .kpi-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1) !important; }
                .action-item:hover { background: #fff !important; transform: scale(1.02); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border-color: #6366f1 !important; }
                .transition-all { transition: all 0.2s ease; }
            ` }} />
    </div>
  );
}

export default InstructorDashboard;
