import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Badge } from 'react-bootstrap'
import {
  FORM_CATEGORIES,
  COLLEGE_BRANCHES,
  COLLEGE_SEMESTERS,
  RESOURCE_TYPES,
  ITEM_CONDITIONS,
  AVAILABILITY_STATUSES
} from '../data/mockListings.js'
import { addStoredListing } from '../utils/storage.js'

function PostListingPage({ currentUser, onNavigateHome, onListingCreated }) {
  // Form input states
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Book')
  const [itemBranch, setItemBranch] = useState('Common / 1st Year')
  const [itemSemester, setItemSemester] = useState('Semester 1')
  const [subject, setSubject] = useState('')
  const [resourceType, setResourceType] = useState('Textbook')
  const [condition, setCondition] = useState('Good Condition')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState('Available')
  const [exchangeAvailable, setExchangeAvailable] = useState(true)
  const [description, setDescription] = useState('')

  // Photo upload state (Base64 data URL)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoName, setPhotoName] = useState('')

  // Validation & feedback
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successAlert, setSuccessAlert] = useState(false)

  // Handle image file selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Limit file size to 2MB to keep localStorage manageable
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'Image size must be less than 2MB.' }))
      return
    }

    setPhotoName(file.name)
    setErrors((prev) => ({ ...prev, photo: '' }))

    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setPhotoName('')
  }

  const validateForm = () => {
    const newErrors = {}

    // 1. Item Title
    if (!title.trim()) {
      newErrors.title = 'Item title is required.'
    } else if (title.trim().length < 3) {
      newErrors.title = 'Item title must be at least 3 characters long.'
    }

    // 2. Subject
    if (!subject.trim()) {
      newErrors.subject = 'Subject or course name is required (e.g., Engineering Mathematics).'
    }

    // 3. Price Validation
    if (price === '' || price === null || price === undefined) {
      newErrors.price = 'Please enter a price (enter 0 for Free / Donation).'
    } else {
      const numericPrice = Number(price)
      if (isNaN(numericPrice) || numericPrice < 0) {
        newErrors.price = 'Price must be a valid positive number or 0.'
      } else if (numericPrice > 50000) {
        newErrors.price = 'Price seems unusually high for college study items (max ₹50,000).'
      }
    }

    // 4. Description (optional, but check if too short when entered)
    if (description.trim() && description.trim().length < 5) {
      newErrors.description = 'Description should be at least 5 characters if provided.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccessAlert(false)

    if (validateForm()) {
      setIsSubmitting(true)

      const listingData = {
        title: title.trim(),
        category,
        itemBranch,
        itemSemester,
        subject: subject.trim(),
        resourceType,
        condition,
        price: Number(price),
        status,
        exchangeAvailable,
        description: description.trim() || 'No additional notes provided.',
        photo: photoPreview,
        icon: category === 'Book' ? 'bi-book' : category === 'Instrument' ? 'bi-rulers' : 'bi-box'
      }

      // Add to localStorage with the current student profile
      const newListing = addStoredListing(listingData, currentUser)

      setIsSubmitting(false)
      setSuccessAlert(true)

      if (onListingCreated) {
        onListingCreated(newListing)
      }

      // Automatically redirect to homepage after 1.2 seconds so student sees their new listing
      setTimeout(() => {
        onNavigateHome()
      }, 1200)
    }
  }

  return (
    <section className="py-5 bg-light-subtle flex-grow-1">
      <Container>
        <Row className="justify-content-center">
          <Col lg={9} xl={8}>
            {/* Navigation Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <Button
                variant="link"
                className="text-decoration-none text-secondary p-0 d-inline-flex align-items-center gap-1 small fw-medium"
                onClick={onNavigateHome}
              >
                <i className="bi bi-arrow-left"></i> Cancel & Back to Marketplace
              </Button>

              <Badge bg="primary-subtle" text="primary" className="px-3 py-2 rounded-pill fw-medium">
                <i className="bi bi-plus-circle me-1"></i> New Marketplace Listing
              </Badge>
            </div>

            {/* Success Alert */}
            {successAlert && (
              <Alert variant="success" className="d-flex align-items-center gap-2 mb-4 rounded-4 shadow-sm">
                <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                <div>
                  <h6 className="mb-0 fw-bold">Listing Published Successfully!</h6>
                  <small>Your item is now saved in localStorage and live on the homepage. Redirecting...</small>
                </div>
              </Alert>
            )}

            {/* SELLER IDENTITY BADGE (Explicit Student vs Item separation) */}
            <div className="card border-0 bg-primary bg-opacity-10 rounded-4 p-3 mb-4 border border-primary border-opacity-25">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-primary text-white rounded-circle">
                    <i className="bi bi-person-badge fs-4"></i>
                  </div>
                  <div>
                    <div className="text-uppercase text-primary fw-bold small tracking-wider">
                      Posting as Student Seller:
                    </div>
                    <h6 className="fw-bold mb-0 text-dark">
                      {currentUser?.name || 'Rahul Sharma'}
                    </h6>
                    <small className="text-secondary">
                      {currentUser?.email || 'student@mhssce.ac.in'} • Student Branch: <strong>{currentUser?.branch || 'IT'}</strong> (Sem {currentUser?.semester || '3'})
                    </small>
                  </div>
                </div>
                <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill small align-self-sm-center">
                  Seller Profile Verified
                </Badge>
              </div>
            </div>

            {/* Main Listing Form Card */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <Card.Header className="bg-white border-bottom p-4">
                <h5 className="fw-bold text-dark mb-1">List a Book or Equipment</h5>
                <p className="text-secondary small mb-0">
                  Help junior or batchmate students save money by cycling your unused syllabus items.
                </p>
              </Card.Header>

              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit} noValidate>
                  {/* SECTION 1: BASIC ITEM DETAILS */}
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-info-circle"></i> 1. Item Overview
                  </h6>

                  {/* Item Name */}
                  <Form.Group className="mb-3" controlId="itemTitle">
                    <Form.Label className="fw-medium small text-dark">
                      Item Name / Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Higher Engineering Mathematics by B.S. Grewal (44th Edition)"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value)
                        if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
                      }}
                      isInvalid={!!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Category & Resource Type */}
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Group controlId="itemCategory">
                        <Form.Label className="fw-medium small text-dark">
                          Category <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          {FORM_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="resourceType">
                        <Form.Label className="fw-medium small text-dark">
                          Resource Type <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={resourceType}
                          onChange={(e) => setResourceType(e.target.value)}
                        >
                          {RESOURCE_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <hr className="my-4 text-muted" />

                  {/* SECTION 2: ACADEMIC CURRICULUM TARGET (Separated from student) */}
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
                      <i className="bi bi-mortarboard"></i> 2. Academic Target for the Item
                    </h6>
                    <Badge bg="light" text="secondary" className="border small fw-normal">
                      Item Target ≠ Student Branch
                    </Badge>
                  </div>
                  <p className="text-muted small mb-3">
                    Specify which branch and semester this item is curriculum-relevant for (e.g. you might be from IT, but selling an EXTC book).
                  </p>

                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Group controlId="itemBranch">
                        <Form.Label className="fw-medium small text-dark">
                          Branch Relevant to Item <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={itemBranch}
                          onChange={(e) => setItemBranch(e.target.value)}
                        >
                          {COLLEGE_BRANCHES.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="itemSemester">
                        <Form.Label className="fw-medium small text-dark">
                          Semester Relevant to Item <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={itemSemester}
                          onChange={(e) => setItemSemester(e.target.value)}
                        >
                          {COLLEGE_SEMESTERS.map((sem) => (
                            <option key={sem} value={sem}>{sem}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group controlId="itemSubject">
                        <Form.Label className="fw-medium small text-dark">
                          Subject / Course Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g. Applied Mathematics, Engineering Mechanics, Data Structures, Basic Electrical"
                          value={subject}
                          onChange={(e) => {
                            setSubject(e.target.value)
                            if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }))
                          }}
                          isInvalid={!!errors.subject}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.subject}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <hr className="my-4 text-muted" />

                  {/* SECTION 3: CONDITION, PRICING & AVAILABILITY */}
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-tag"></i> 3. Condition, Price & Status
                  </h6>

                  <Row className="g-3 mb-3">
                    {/* Item Condition */}
                    <Col md={4}>
                      <Form.Group controlId="itemCondition">
                        <Form.Label className="fw-medium small text-dark">
                          Item Condition <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={condition}
                          onChange={(e) => setCondition(e.target.value)}
                        >
                          {ITEM_CONDITIONS.map((cond) => (
                            <option key={cond} value={cond}>{cond}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    {/* Price in INR */}
                    <Col md={4}>
                      <Form.Group controlId="itemPrice">
                        <Form.Label className="fw-medium small text-dark">
                          Price (in ₹) <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup hasValidation>
                          <InputGroup.Text className="bg-white">₹</InputGroup.Text>
                          <Form.Control
                            type="number"
                            min="0"
                            step="10"
                            placeholder="e.g. 250 (0 for Free)"
                            value={price}
                            onChange={(e) => {
                              setPrice(e.target.value)
                              if (errors.price) setErrors((prev) => ({ ...prev, price: '' }))
                            }}
                            isInvalid={!!errors.price}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.price}
                          </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Text className="text-muted small">
                          Enter 0 for Free / Direct Book Swap
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    {/* Availability Status */}
                    <Col md={4}>
                      <Form.Group controlId="itemStatus">
                        <Form.Label className="fw-medium small text-dark">
                          Availability Status <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          {AVAILABILITY_STATUSES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Direct Exchange Option Checkbox */}
                  <Form.Check
                    type="checkbox"
                    id="exchangeCheck"
                    label="Open to direct exchange / swap (I am willing to trade this item for another semester item)"
                    checked={exchangeAvailable}
                    onChange={(e) => setExchangeAvailable(e.target.checked)}
                    className="mb-3 small text-secondary fw-medium"
                  />

                  <hr className="my-4 text-muted" />

                  {/* SECTION 4: PHOTO UPLOAD & DESCRIPTION */}
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-camera"></i> 4. Item Photo & Description
                  </h6>

                  {/* Photo file input with live preview */}
                  <Form.Group className="mb-3" controlId="itemPhoto">
                    <Form.Label className="fw-medium small text-dark">
                      Upload Item Photo
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      isInvalid={!!errors.photo}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.photo}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted small">
                      Accepts JPG, PNG, WebP (Max 2MB). Uploaded image is stored locally in your browser.
                    </Form.Text>
                  </Form.Group>

                  {/* Photo Preview Box */}
                  {photoPreview && (
                    <div className="p-3 bg-light rounded-3 mb-3 d-flex align-items-center gap-3">
                      <img
                        src={photoPreview}
                        alt="Item Preview"
                        className="rounded-3 shadow-xs object-fit-cover"
                        style={{ width: '80px', height: '80px' }}
                      />
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark small">{photoName}</div>
                        <small className="text-success">Photo ready for upload</small>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill"
                        onClick={handleRemovePhoto}
                      >
                        <i className="bi bi-trash me-1"></i> Remove
                      </Button>
                    </div>
                  )}

                  {/* Description / Remarks */}
                  <Form.Group className="mb-4" controlId="itemDescription">
                    <Form.Label className="fw-medium small text-dark">
                      Description / Additional Notes (Optional)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Mention edition, highlighting, missing pages, included accessories (e.g. scales, clips, batteries)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Submit Button */}
                  <div className="d-grid gap-2">
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
                          Saving Listing...
                        </span>
                      ) : (
                        <span>
                          <i className="bi bi-check-circle me-2"></i> Publish Listing to Marketplace
                        </span>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Architecture / Storage Note */}
            <div className="card border-0 bg-white shadow-xs p-3 mt-4 rounded-3 text-secondary small">
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-database-check text-primary fs-5"></i>
                <div>
                  <strong className="text-dark">Storage Note for Developers:</strong>
                  <div className="text-muted mt-1">
                    This item is saved directly into <code>localStorage.getItem('studycycle_listings')</code>. It persists across browser refreshes and immediately shows up in the homepage search and category filters.
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

export default PostListingPage
