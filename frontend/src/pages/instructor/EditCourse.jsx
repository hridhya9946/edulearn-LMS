import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCourseById, updateCourse } from '../../api/instructorApi';

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'General',
    level: 'beginner',
    price: 0,
    thumbnail: '',
    modules: []
  });

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const data = await getCourseById(id);
      const course = data.course;

      // Ensure modules exist and have a default if empty
      const modules = course.modules && course.modules.length > 0
        ? course.modules
        : [{ title: '', description: '', lessons: [{ title: '', type: 'video', contentUrl: '', duration: 0 }] }];

      setCourseData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || 'General',
        level: course.level || 'beginner',
        price: course.price || 0,
        thumbnail: course.thumbnail || '',
        modules: modules,
        status: course.status || 'draft'
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load course details');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleModuleChange = (moduleIndex, field, value) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex][field] = value;
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const addModule = () => {
    setCourseData({
      ...courseData,
      modules: [
        ...courseData.modules,
        {
          title: '',
          description: '',
          lessons: [{ title: '', type: 'video', contentUrl: '', duration: 0 }]
        }
      ]
    });
  };

  const removeModule = (moduleIndex) => {
    const updatedModules = courseData.modules.filter((_, index) => index !== moduleIndex);
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const addLesson = (moduleIndex) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].lessons.push({
      title: '',
      type: 'video',
      contentUrl: '',
      duration: 0
    });
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter(
      (_, index) => index !== lessonIndex
    );
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const handleSubmit = async (asDraft = true) => {
    setSaving(true);
    setError('');

    try {
      await updateCourse(id, { ...courseData, status: asDraft ? 'draft' : 'pending' });
      navigate('/instructor/courses');
    } catch (err) {
      console.error('Update course error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to update course');
      setSaving(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-secondary" size="sm" className="me-3" onClick={() => navigate(-1)}>
          &larr; Go Back
        </Button>
        <h2 className="mb-0">Edit Course</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {courseData.status === 'published' && (
        <Alert variant="warning" className="shadow-sm border-start border-warning border-4">
          <h5 className="fw-bold">Notice: Published Course</h5>
          <p className="mb-0">Editing this course will temporarily unpublish it until an administrator re-approves your changes. This ensures platform quality control.</p>
        </Alert>
      )}

      {/* Progress Indicator */}
      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <span className={step >= 1 ? 'text-primary fw-bold' : 'text-muted'}>1. Basic Info</span>
          <span className={step >= 2 ? 'text-primary fw-bold' : 'text-muted'}>2. Modules & Lessons</span>
          <span className={step >= 3 ? 'text-primary fw-bold' : 'text-muted'}>3. Review & Update</span>
        </div>
        <div className="progress mt-2">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${(step / 3) * 100}% ` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <Card.Header>
            <h5>Basic Course Information</h5>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Course Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  placeholder="Enter course title"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your course"
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={courseData.category}
                      onChange={handleInputChange}
                    >
                      <option value="General">General</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Data Science">Data Science</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Level</Form.Label>
                    <Form.Select
                      name="level"
                      value={courseData.level}
                      onChange={handleInputChange}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={courseData.price}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Thumbnail URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="thumbnail"
                      value={courseData.thumbnail}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={nextStep}>
                  Next: Modules & Lessons
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Step 2: Modules & Lessons */}
      {step === 2 && (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5>Course Modules & Lessons</h5>
            <Button variant="success" size="sm" onClick={addModule}>
              + Add Module
            </Button>
          </Card.Header>
          <Card.Body>
            {courseData.modules.map((module, moduleIndex) => (
              <Card key={moduleIndex} className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>Module {moduleIndex + 1}</span>
                  {courseData.modules.length > 1 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeModule(moduleIndex)}
                    >
                      Remove Module
                    </Button>
                  )}
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Module Title *</Form.Label>
                    <Form.Control
                      type="text"
                      value={module.title}
                      onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                      placeholder="Enter module title"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Module Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={module.description}
                      onChange={(e) =>
                        handleModuleChange(moduleIndex, 'description', e.target.value)
                      }
                      placeholder="Describe this module"
                    />
                  </Form.Group>

                  <h6>Lessons</h6>
                  {module.lessons.map((lesson, lessonIndex) => (
                    <Card key={lessonIndex} className="mb-2 bg-light">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>Lesson {lessonIndex + 1}</strong>
                          {module.lessons.length > 1 && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeLesson(moduleIndex, lessonIndex)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-2">
                              <Form.Label>Lesson Title *</Form.Label>
                              <Form.Control
                                type="text"
                                value={lesson.title}
                                onChange={(e) =>
                                  handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)
                                }
                                placeholder="Lesson title"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group className="mb-2">
                              <Form.Label>Type</Form.Label>
                              <Form.Select
                                value={lesson.type}
                                onChange={(e) =>
                                  handleLessonChange(moduleIndex, lessonIndex, 'type', e.target.value)
                                }
                              >
                                <option value="video">Video</option>
                                <option value="pdf">PDF</option>
                                <option value="text">Text</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group className="mb-2">
                              <Form.Label>Duration (min)</Form.Label>
                              <Form.Control
                                type="number"
                                value={lesson.duration}
                                onChange={(e) =>
                                  handleLessonChange(
                                    moduleIndex,
                                    lessonIndex,
                                    'duration',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                min="0"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group>
                          <Form.Label>Content URL *</Form.Label>
                          <Form.Control
                            type="text"
                            value={lesson.contentUrl}
                            onChange={(e) =>
                              handleLessonChange(moduleIndex, lessonIndex, 'contentUrl', e.target.value)
                            }
                            placeholder="https://youtube.com/... or file URL"
                            required
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  ))}

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => addLesson(moduleIndex)}
                  >
                    + Add Lesson
                  </Button>
                </Card.Body>
              </Card>
            ))}

            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button variant="primary" onClick={nextStep}>
                Next: Review
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <Card>
          <Card.Header>
            <h5>Review Your Changes</h5>
          </Card.Header>
          <Card.Body>
            <h6>Basic Information</h6>
            <p>
              <strong>Title:</strong> {courseData.title}
            </p>
            <p>
              <strong>Category:</strong> {courseData.category} | <strong>Level:</strong>{' '}
              {courseData.level} | <strong>Price:</strong> ₹{courseData.price}
            </p>
            <p>
              <strong>Description:</strong> {courseData.description}
            </p>

            <hr />

            <h6>Course Structure</h6>
            {courseData.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="mb-3">
                <p className="mb-1">
                  <strong>
                    Module {moduleIndex + 1}: {module.title}
                  </strong>
                </p>
                <ul>
                  {module.lessons.map((lesson, lessonIndex) => (
                    <li key={lessonIndex}>
                      {lesson.title} ({lesson.type}, {lesson.duration} min)
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <div>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => handleSubmit(true)}
                  disabled={saving}
                >
                  Save as Draft
                </Button>
                <Button variant="success" onClick={() => handleSubmit(false)} disabled={saving}>
                  {saving ? 'Updating...' : 'Update & Submit for Approval'}
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default EditCourse;