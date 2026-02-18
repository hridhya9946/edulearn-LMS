import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { getDashboardStats, getUserGrowth, getRevenueReport } from '../../api/adminApi';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [growthWidth, setGrowthWidth] = useState(0);
  const [revenueWidth, setRevenueWidth] = useState(0);
  const containerRef = useRef(null);
  const revenueRef = useRef(null);

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
    if (isMounted) {
      const updateWidths = () => {
        if (containerRef.current) setGrowthWidth(containerRef.current.offsetWidth);
        if (revenueRef.current) setRevenueWidth(revenueRef.current.offsetWidth);
      };

      const observer = new ResizeObserver(updateWidths);
      if (containerRef.current) observer.observe(containerRef.current);
      if (revenueRef.current) observer.observe(revenueRef.current);

      updateWidths();
      return () => observer.disconnect();
    }
  }, [isMounted]);

  const fetchDashboardStats = async () => {
    try {
      const [statsRes, growthRes, revRes] = await Promise.all([
        getDashboardStats(),
        getUserGrowth(),
        getRevenueReport()
      ]);

      setStats(statsRes.stats);

      // Transform growth data
      const transformedGrowth = Object.entries(growthRes.growth).map(([month, data]) => ({
        name: month,
        total: data.total
      })).sort((a, b) => a.name.localeCompare(b.name)).slice(-6); // Last 6 months
      setGrowthData(transformedGrowth);

      // Transform revenue data (by course)
      const transformedRev = revRes.report.revenueByCourse
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5); // Top 5 courses
      setRevenueData(transformedRev);

      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard stats');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* User Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center bg-primary text-white h-100">
            <Card.Body>
              <h3>{stats?.users?.total || 0}</h3>
              <p className="mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-success text-white h-100">
            <Card.Body>
              <h3>{stats?.users?.students || 0}</h3>
              <p className="mb-0">Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-info text-white h-100">
            <Card.Body>
              <h3>{stats?.users?.instructors || 0}</h3>
              <p className="mb-0">Instructors</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-warning text-white h-100">
            <Card.Body>
              <h3>{stats?.users?.admins || 0}</h3>
              <p className="mb-0">Admins</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Growth Chart */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">User Growth Trend</h5>
            </Card.Header>
            <Card.Body>
              <div
                ref={containerRef}
                style={{ width: '100%', minHeight: '250px', position: 'relative', minWidth: 0, overflow: 'hidden' }}
              >
                {(isMounted && growthWidth > 0) && (
                  <ResponsiveContainer width={growthWidth} aspect={3} debounce={0}>
                    <AreaChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="total" stroke="#4e73df" fill="#4e73df" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Course & Enrollment Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3>{stats?.courses?.total || 0}</h3>
              <p className="text-muted mb-0">Total Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3>{stats?.courses?.published || 0}</h3>
              <p className="text-muted mb-0">Published</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning h-100">
            <Card.Body>
              <h3>{stats?.courses?.pending || 0}</h3>
              <p className="text-muted mb-0">Pending Approval</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3>{stats?.enrollments?.total || 0}</h3>
              <p className="text-muted mb-0">Total Enrollments</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Revenue by Course (₹)</h5>
            </Card.Header>
            <Card.Body>
              <div
                ref={revenueRef}
                style={{ width: '100%', minHeight: '250px', position: 'relative', minWidth: 0, overflow: 'hidden' }}
              >
                {(isMounted && revenueWidth > 0) && (
                  <ResponsiveContainer width={revenueWidth} aspect={2.5} debounce={0}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="courseTitle" hide />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#1cc88a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Platform Health</h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center">
              <div className="text-center mb-4">
                <h2 className="text-success mb-0">₹{stats?.revenue?.total || 0}</h2>
                <p className="text-muted small">Total Revenue</p>
              </div>
              <div className="text-center">
                <h2 className="text-info mb-0">{stats?.enrollments?.completionRate || 0}%</h2>
                <p className="text-muted small">Avg. Completion Rate</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Link to="/admin/users">
                <Button variant="primary" className="me-2">Manage Users</Button>
              </Link>
              <Link to="/admin/courses/pending">
                <Button variant="warning" className="me-2">
                  Approve Courses ({stats?.courses?.pending || 0})
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="info" className="me-2">View Analytics</Button>
              </Link>
              <Link to="/admin/settings">
                <Button variant="secondary">System Settings</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Recent Users</h5>
            </Card.Header>
            <Card.Body>
              {stats?.recentActivity?.users && stats.recentActivity.users.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentActivity.users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge bg-${user.role === 'admin' ? 'danger' : user.role === 'instructor' ? 'info' : 'success'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No recent users</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Recent Enrollments</h5>
            </Card.Header>
            <Card.Body>
              {stats?.recentActivity?.enrollments && stats.recentActivity.enrollments.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentActivity.enrollments.map((enrollment, index) => (
                      <tr key={index}>
                        <td>{enrollment.student?.name || 'N/A'}</td>
                        <td>{enrollment.course?.title || 'N/A'}</td>
                        <td>{new Date(enrollment.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No recent enrollments</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
