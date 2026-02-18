import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Container, Row, Col, Card, Alert, Table, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { getRevenueReport, getUserGrowth, getCourseStats } from '../../api/adminApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function PlatformAnalytics() {
    const navigate = useNavigate();
    const [revenueData, setRevenueData] = useState(null);
    const [growthData, setGrowthData] = useState([]);
    const [courseStats, setCourseStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [growthWidth, setGrowthWidth] = useState(0);
    const [categoryWidth, setCategoryWidth] = useState(0);
    const [revWidth, setRevWidth] = useState(0);

    const growthRef = useRef(null);
    const categoryRef = useRef(null);
    const revRef = useRef(null);

    useEffect(() => {
        fetchAllAnalytics();
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
                if (growthRef.current) setGrowthWidth(growthRef.current.offsetWidth);
                if (categoryRef.current) setCategoryWidth(categoryRef.current.offsetWidth);
                if (revRef.current) setRevWidth(revRef.current.offsetWidth);
            };

            const observer = new ResizeObserver(updateWidths);
            if (growthRef.current) observer.observe(growthRef.current);
            if (categoryRef.current) observer.observe(categoryRef.current);
            if (revRef.current) observer.observe(revRef.current);

            updateWidths();
            return () => observer.disconnect();
        }
    }, [isMounted]);

    const fetchAllAnalytics = async () => {
        try {
            setLoading(true);
            const [revRes, growthRes, statsRes] = await Promise.all([
                getRevenueReport(),
                getUserGrowth(),
                getCourseStats()
            ]);

            setRevenueData(revRes.report);

            // Transform monthly growth data for Recharts
            const transformedGrowth = Object.entries(growthRes.growth).map(([month, data]) => ({
                name: month,
                ...data
            })).sort((a, b) => a.name.localeCompare(b.name));
            setGrowthData(transformedGrowth);

            setCourseStats(statsRes.stats);
            setLoading(false);
        } catch (err) {
            setError('Failed to load platform analytics');
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading Analytics...</div>;

    const categoryPieData = courseStats ? Object.entries(courseStats.byCategory).map(([name, value]) => ({ name, value })) : [];

    return (
        <Container className="mt-4 mb-5">
            <div className="d-flex align-items-center mb-4">
                <Button variant="outline-secondary" size="sm" className="me-3" onClick={() => navigate(-1)}>
                    &larr; Go Back
                </Button>
                <h2 className="mb-0">Platform Analytics</h2>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4">
                {/* User Growth Chart */}
                <Col lg={8}>
                    <Card className="h-100">
                        <Card.Header><h5>User Growth (Last 12 Months)</h5></Card.Header>
                        <Card.Body>
                            <div
                                ref={growthRef}
                                style={{ width: '100%', minHeight: '300px', position: 'relative', minWidth: 0, overflow: 'hidden' }}
                            >
                                {(isMounted && growthWidth > 0) && (
                                    <ResponsiveContainer width={growthWidth} aspect={2.5} debounce={0}>
                                        <AreaChart data={growthData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Area type="monotone" dataKey="students" stackId="1" stroke="#8884d8" fill="#8884d8" name="Students" />
                                            <Area type="monotone" dataKey="instructors" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Instructors" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Categories Distribution */}
                <Col lg={4}>
                    <Card className="h-100">
                        <Card.Header><h5>Courses by Category</h5></Card.Header>
                        <Card.Body className="d-flex justify-content-center align-items-center">
                            <div
                                ref={categoryRef}
                                style={{ width: '100%', minHeight: '300px', position: 'relative', minWidth: 0, overflow: 'hidden' }}
                            >
                                {(isMounted && categoryWidth > 0) && (
                                    <ResponsiveContainer width={categoryWidth} aspect={1.5} debounce={0}>
                                        <PieChart>
                                            <Pie
                                                data={categoryPieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                label
                                            >
                                                {categoryPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                {/* Revenue by Course */}
                <Col lg={12}>
                    <Card>
                        <Card.Header><h5>Revenue by Course</h5></Card.Header>
                        <Card.Body>
                            <div
                                ref={revRef}
                                style={{ width: '100%', minHeight: '350px', position: 'relative', minWidth: 0, overflow: 'hidden' }}
                            >
                                {(isMounted && revWidth > 0) && (
                                    <ResponsiveContainer width={revWidth} aspect={3} debounce={0}>
                                        <BarChart data={revenueData?.revenueByCourse || []}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="courseTitle" />
                                            <YAxis label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft' }} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="revenue" fill="#4e73df" name="Total Revenue (₹)" />
                                            <Bar dataKey="enrollments" fill="#1cc88a" name="Enrollment Count" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Most Popular Courses Table */}
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Header><h5>Top Performing Courses (by Enrollment)</h5></Card.Header>
                        <Card.Body>
                            <Table striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>Course Title</th>
                                        <th>Category</th>
                                        <th>Enrollments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseStats?.mostPopular.map(course => (
                                        <tr key={course._id}>
                                            <td>{course.title}</td>
                                            <td>{course.category}</td>
                                            <td>{course.enrollmentCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Highest Rated Courses Table */}
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Header><h5>Highest Rated Courses</h5></Card.Header>
                        <Card.Body>
                            <Table striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>Course Title</th>
                                        <th>Instructor</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseStats?.highestRated.map(course => (
                                        <tr key={course._id}>
                                            <td>{course.title}</td>
                                            <td>{course.instructor?.name || 'Unknown'}</td>
                                            <td>
                                                <Badge bg="warning" text="dark">⭐ {course.rating.toFixed(1)}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PlatformAnalytics;
