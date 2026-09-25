
import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'

export default function PostListingPage({
  currentUser,
  onNavigateHome,
  onListingCreated
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Book')
  const [itemBranch, setItemBranch] = useState('')
  const [itemSemester, setItemSemester] = useState('')
  const [subject, setSubject] = useState('')
  const [resourceType, setResourceType] = useState('Textbook')
  const [condition, setCondition] = useState('Good Condition')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState('Available')
  const [exchangeAvailable, setExchangeAvailable] = useState(false)
  const [description, setDescription] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')

  const [errors, setErrors] = useState({})
  const [successAlert, setSuccessAlert] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!title.trim()) newErrors.title = 'Title is required.'
    if (!itemBranch) newErrors.itemBranch = 'Branch is required.'
    if (!itemSemester) newErrors.itemSemester = 'Semester is required.'
    if (!subject.trim()) newErrors.subject = 'Subject is required.'
    if (!price && price !== 0) newErrors.price = 'Price is required.'

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setErrors({
        photo: 'Photo size should be less than 2MB.'
      })
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setPhotoPreview(reader.result)
      setErrors((prev) => ({
        ...prev,
        photo: ''
      }))
    }

    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessAlert(false)

    if (!validateForm()) {
      return
    }

    if (!currentUser) {
      setErrors({
        backend: 'Please login before posting a listing.'
      })
      return
    }

    setIsSubmitting(true)

    try {
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
        description:
          description.trim() || 'No additional notes provided.',
        photo: photoPreview || '',
        seller: {
          name: currentUser.name,
          email: currentUser.email,
          branch: currentUser.branch,
          semester: currentUser.semester
        }
      }

      const response = await fetch(
        'http://localhost:5000/api/listings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(listingData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to publish listing'
        )
      }

      setIsSubmitting(false)
      setSuccessAlert(true)

      if (onListingCreated) {
        onListingCreated(data)
      }

      setTimeout(() => {
        onNavigateHome()
      }, 1200)
    } catch (error) {
      console.error('Listing backend error:', error)

      setIsSubmitting(false)

      setErrors({
        backend: error.message
      })
    }
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={9} lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="mb-4">Post a Listing</h2>

              {successAlert && (
                <Alert variant="success">
                  <strong>Listing published successfully!</strong>
                  <br />
                  <small>
                    Your item is now saved to MongoDB and will appear
                    on the marketplace. Redirecting...
                  </small>
                </Alert>
              )}

              {errors.backend && (
                <Alert variant="danger">
                  <strong>Backend Error:</strong>{' '}
                  {errors.backend}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter item title"
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value)
                        }
                      >
                        <option>Book</option>
                        <option>Notes</option>
                        <option>Instrument</option>
                        <option>Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Resource Type</Form.Label>
                      <Form.Select
                        value={resourceType}
                        onChange={(e) =>
                          setResourceType(e.target.value)
                        }
                      >
                        <option>Textbook</option>
                        <option>Reference Book</option>
                        <option>Notes</option>
                        <option>Practical Instrument</option>
                        <option>Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Item Branch</Form.Label>
                      <Form.Control
                        value={itemBranch}
                        onChange={(e) =>
                          setItemBranch(e.target.value)
                        }
                        placeholder="e.g. Information Technology"
                        isInvalid={!!errors.itemBranch}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.itemBranch}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Item Semester</Form.Label>
                      <Form.Control
                        value={itemSemester}
                        onChange={(e) =>
                          setItemSemester(e.target.value)
                        }
                        placeholder="e.g. Semester 3"
                        isInvalid={!!errors.itemSemester}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.itemSemester}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject name"
                    isInvalid={!!errors.subject}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.subject}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Condition</Form.Label>
                      <Form.Select
                        value={condition}
                        onChange={(e) =>
                          setCondition(e.target.value)
                        }
                      >
                        <option>Good Condition</option>
                        <option>Like New</option>
                        <option>Fair Condition</option>
                        <option>Used</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter price"
                        isInvalid={!!errors.price}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option>Available</option>
                    <option>Sold</option>
                    <option>Reserved</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    isInvalid={!!errors.photo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.photo}
                  </Form.Control.Feedback>
                </Form.Group>

                {photoPreview && (
                  <div className="mb-3">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      style={{
                        width: '180px',
                        maxHeight: '180px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Exchange available"
                    checked={exchangeAvailable}
                    onChange={(e) =>
                      setExchangeAvailable(e.target.checked)
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Enter additional details"
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? 'Publishing...'
                      : 'Publish Listing'}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onNavigateHome}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}


