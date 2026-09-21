import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap'
import { COLLEGE_BRANCHES, COLLEGE_SEMESTERS } from '../data/mockListings.js'
import { saveStoredUser } from '../utils/storage.js'

function LoginPage({ onNavigateHome, onLoginSuccess }) {
  // Student Profile fields
  const [studentName, setStudentName] = useState('')
  const [email, setEmail] = useState('')
  const [studentBranch, setStudentBranch] = useState('Information Technology')
  const [studentSemester, setStudentSemester] = useState('3')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Feedback states
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const COLLEGE_DOMAIN = '@mhssce.ac.in'

  // Quick Demo Auto-fill for quick evaluation
  const handleQuickDemoFill = () => {
    setStudentName('Rahul Sharma')
    setEmail('rahul.1234@mhssce.ac.in')
    setStudentBranch('Information Technology')
    setStudentSemester('3')
    setPassword('student123')
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedName = studentName.trim()

    // 1. Student Name
    if (!trimmedName) {
      newErrors.studentName = 'Please enter your full name.'
    } else if (trimmedName.length < 2) {
      newErrors.studentName = 'Name must be at least 2 characters.'
    }

    // 2. College Email ending with @mhssce.ac.in
    if (!trimmedEmail) {
      newErrors.email = 'Please enter your college email address.'
    } else if (!trimmedEmail.endsWith(COLLEGE_DOMAIN)) {
      newErrors.email = `Access restricted: Email must end with ${COLLEGE_DOMAIN} (e.g. yourname@mhssce.ac.in).`
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@mhssce\.ac\.in$/
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Please enter a valid student email format before @mhssce.ac.in.'
      }
    }

    // 3. Student Branch & Semester
    if (!studentBranch) {
      newErrors.studentBranch = 'Please select your current branch.'
    }
    if (!studentSemester) {
      newErrors.studentSemester = 'Please select your current semester.'
    }

    // 4. Password
    if (!password) {
      newErrors.password = 'Please enter your password.'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccessMessage('')

    if (validateForm()) {
      setIsSubmitting(true)

      setTimeout(() => {
        setIsSubmitting(false)
        const userProfile = {
          name: studentName.trim(),
          email: email.trim().toLowerCase(),
          branch: studentBranch,
          semester: studentSemester
        }

        // Save active student in localStorage
        saveStoredUser(userProfile)
        setSuccessMessage(`Logged in successfully as ${userProfile.name} (${userProfile.branch}, Sem ${userProfile.semester})`)

        if (onLoginSuccess) {
          onLoginSuccess(userProfile)
        }

        // Redirect after brief delay
        setTimeout(() => {
          onNavigateHome()
        }, 800)
      }, 400)
    }
  }

  return (
    <section className="py-5 bg-light-subtle flex-grow-1 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={11} md={9} lg={7} xl={6}>
            {/* Top Back Navigation */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button
                variant="link"
                className="text-decoration-none text-secondary p-0 d-inline-flex align-items-center gap-1 small fw-medium"
                onClick={onNavigateHome}
              >
                <i className="bi bi-arrow-left"></i> Back to Marketplace
              </Button>

              <Button
                variant="outline-primary"
                size="sm"
                className="rounded-pill px-3 py-1 small"
                onClick={handleQuickDemoFill}
                title="Auto-fill demo student details"
              >
                <i className="bi bi-magic me-1"></i> Quick Demo Fill
              </Button>
            </div>

            {/* Login Card */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              {/* Header Banner */}
              <div className="bg-primary text-white p-4 text-center">
                <div className="p-3 bg-white bg-opacity-25 rounded-circle d-inline-flex mb-2">
                  <i className="bi bi-recycle fs-2 text-white"></i>
                </div>
                <h4 className="fw-bold mb-1">STUDYCYCLE</h4>
                <p className="small mb-0 text-white-50">
                  Student-to-Student Book & Equipment Exchange
                </p>
                <span className="badge bg-white text-primary mt-2 rounded-pill px-3 py-1 small">
                  🏛️ MHSSCE Student Access
                </span>
              </div>

              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h5 className="fw-bold text-dark mb-1">Student Sign In / Profile</h5>
                  <p className="text-muted small mb-0">
                    Sign in to browse, buy, or post items as a verified college student.
                  </p>
                </div>

                {/* Success Banner */}
                {successMessage && (
                  <Alert variant="success" className="d-flex align-items-center gap-2 small">
                    <i className="bi bi-check-circle-fill fs-5"></i>
                    <div>
                      <strong>Login Successful!</strong> {successMessage}
                    </div>
                  </Alert>
                )}

                {/* Important Role / Separation Notice */}
                <div className="alert alert-light border small text-secondary mb-4 py-2 px-3">
                  <i className="bi bi-person-check text-primary me-2"></i>
                  <strong>Dual Role System:</strong> Your registered account allows you to act as both a <strong>Buyer</strong> (seeking items) and a <strong>Seller</strong> (posting items).
                </div>

                <Form onSubmit={handleSubmit} noValidate>
                  {/* 1. Student Name */}
                  <Form.Group className="mb-3" controlId="studentName">
                    <Form.Label className="fw-medium small text-dark">
                      Student Full Name <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text className="bg-white text-secondary">
                        <i className="bi bi-person"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        isInvalid={!!errors.studentName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.studentName}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* 2. College Email */}
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label className="fw-medium small text-dark">
                      College Email Address <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text className="bg-white text-secondary">
                        <i className="bi bi-envelope"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="e.g. rahul.1234@mhssce.ac.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <Form.Text className="text-muted small">
                      <i className="bi bi-shield-check text-success me-1"></i>
                      Must strictly end with <strong>@mhssce.ac.in</strong>
                    </Form.Text>
                  </Form.Group>

                  {/* 3. Student's Own Branch and Semester */}
                  <Row className="g-2 mb-3">
                    <Col sm={7}>
                      <Form.Group controlId="studentBranch">
                        <Form.Label className="fw-medium small text-dark">
                          Your Branch <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={studentBranch}
                          onChange={(e) => setStudentBranch(e.target.value)}
                          isInvalid={!!errors.studentBranch}
                        >
                          {COLLEGE_BRANCHES.filter(b => b !== 'All Branches').map((branch) => (
                            <option key={branch} value={branch}>{branch}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col sm={5}>
                      <Form.Group controlId="studentSemester">
                        <Form.Label className="fw-medium small text-dark">
                          Your Semester <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={studentSemester}
                          onChange={(e) => setStudentSemester(e.target.value)}
                          isInvalid={!!errors.studentSemester}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <option key={sem} value={sem.toString()}>Sem {sem}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* 4. Password Field */}
                  <Form.Group className="mb-4" controlId="loginPassword">
                    <Form.Label className="fw-medium small text-dark">
                      Password <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text className="bg-white text-secondary">
                        <i className="bi bi-lock"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!errors.password}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        tabIndex={-1}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Submit Button */}
                  <div className="d-grid mb-3">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className="fw-semibold rounded-pill shadow-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Signing In...
                        </span>
                      ) : (
                        <span>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Log In & Start Exchanging
                        </span>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Architecture / Frontend vs Backend explanation note */}
            <div className="card border-0 bg-white shadow-xs p-3 mt-4 rounded-3 text-secondary small">
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-info-circle text-primary fs-5"></i>
                <div>
                  <strong className="text-dark">Frontend State Note:</strong>
                  <div className="text-muted mt-1">
                    Your session is saved to browser <code>localStorage</code> so you can test posting items immediately. When your teammate connects the backend, this form will connect to the real authentication API and database.
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default LoginPage
