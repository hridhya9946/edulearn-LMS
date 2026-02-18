import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Tabs, Tab, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getSettings, updateSettings } from '../../api/adminApi';

function SystemSettings() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        siteName: '',
        siteDescription: '',
        logo: '',
        favicon: '',
        emailSettings: {
            smtpHost: '',
            smtpPort: '',
            smtpUser: '',
            smtpPass: ''
        },
        paymentGateway: {
            isActive: false,
            apiKey: '',
            webhookSecret: ''
        },
        maintenanceMode: false,
        allowRegistration: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await getSettings();
            if (data.settings) {
                setSettings(prev => ({ ...prev, ...data.settings }));
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to load system settings');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNestedChange = (category, field, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await updateSettings(settings);
            setSuccess('Settings updated successfully');
            setSaving(false);
        } catch (err) {
            setError('Failed to update settings');
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading Settings...</div>;

    return (
        <Container className="mt-4 mb-5">
            <div className="d-flex align-items-center mb-4">
                <Button variant="outline-secondary" size="sm" className="me-3" onClick={() => navigate(-1)}>
                    &larr; Go Back
                </Button>
                <h2 className="mb-0">System Settings</h2>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Tabs defaultActiveKey="general" className="mb-4">
                    {/* General Settings */}
                    <Tab eventKey="general" title="General">
                        <Card>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Site Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="siteName"
                                        value={settings.siteName}
                                        onChange={handleChange}
                                        placeholder="Enter LMS Name"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Site Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="siteDescription"
                                        value={settings.siteDescription}
                                        onChange={handleChange}
                                        placeholder="Enter Site Description"
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Logo URL</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="logo"
                                                value={settings.logo}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Favicon URL</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="favicon"
                                                value={settings.favicon}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Tab>

                    {/* Email Settings */}
                    <Tab eventKey="email" title="Email (SMTP)">
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={8}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>SMTP Host</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={settings.emailSettings.smtpHost}
                                                onChange={(e) => handleNestedChange('emailSettings', 'smtpHost', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>SMTP Port</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={settings.emailSettings.smtpPort}
                                                onChange={(e) => handleNestedChange('emailSettings', 'smtpPort', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>SMTP Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={settings.emailSettings.smtpUser}
                                        onChange={(e) => handleNestedChange('emailSettings', 'smtpUser', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>SMTP Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={settings.emailSettings.smtpPass}
                                        onChange={(e) => handleNestedChange('emailSettings', 'smtpPass', e.target.value)}
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Tab>

                    {/* Platform Controls */}
                    <Tab eventKey="platform" title="Platform Controls">
                        <Card>
                            <Card.Body>
                                <Form.Check
                                    type="switch"
                                    id="maintenance-mode"
                                    label="Maintenance Mode"
                                    name="maintenanceMode"
                                    checked={settings.maintenanceMode}
                                    onChange={handleChange}
                                    className="mb-3"
                                />
                                <Form.Check
                                    type="switch"
                                    id="allow-registration"
                                    label="Allow New User Registration"
                                    name="allowRegistration"
                                    checked={settings.allowRegistration}
                                    onChange={handleChange}
                                    className="mb-3"
                                />
                                <hr />
                                <h5>Payment Gateway (Stripe)</h5>
                                <Form.Check
                                    type="switch"
                                    id="payment-active"
                                    label="Enable Payments"
                                    checked={settings.paymentGateway.isActive}
                                    onChange={(e) => handleNestedChange('paymentGateway', 'isActive', e.target.checked)}
                                    className="mb-3"
                                />
                                <Form.Group className="mb-3">
                                    <Form.Label>API Key</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={settings.paymentGateway.apiKey}
                                        onChange={(e) => handleNestedChange('paymentGateway', 'apiKey', e.target.value)}
                                        disabled={!settings.paymentGateway.isActive}
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Tab>
                </Tabs>

                <div className="d-flex justify-content-end mt-4">
                    <Button variant="primary" type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save All Settings'}
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default SystemSettings;
