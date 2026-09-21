import React, { useState, useEffect } from 'react'
import {
  Container, Row, Col, Card, Badge, Button,
  Modal, Form, Alert, InputGroup
} from 'react-bootstrap'
import { getStoredListings, updateStoredListing, deleteStoredListing } from '../utils/storage.js'
import { AVAILABILITY_STATUSES } from '../data/mockListings.js'

const STATUS_COLORS = {
  Available: 'success',
  Reserved: 'warning',
  Taken: 'secondary'
}

const STATUS_ICONS = {
  Available: 'bi-check-circle-fill',
  Reserved: 'bi-clock-fill',
  Taken: 'bi-x-circle-fill'
}

function MyListingsPage({ currentUser, onNavigateHome }) {
  const [myListings, setMyListings] = useState([])

  // Edit-price modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editPrice, setEditPrice] = useState('')
  const [editStatus, setEditStatus] = useState('Available')
  const [editDescription, setEditDescription] = useState('')
  const [editErrors, setEditErrors] = useState({})

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingItem, setDeletingItem] = useState(null)

  const [actionMessage, setActionMessage] = useState(null) // { type, text }

  // Load only this student's listings from localStorage
  useEffect(() => {
    loadMyListings()
  }, [currentUser])

  const loadMyListings = () => {
    const all = getStoredListings()
    const mine = all.filter(
      (item) => item.seller?.email === currentUser?.email
    )
    setMyListings(mine)
  }

  const showTemporaryMessage = (type, text) => {
    setActionMessage({ type, text })
    setTimeout(() => setActionMessage(null), 3000)
  }

  // Quick status toggle directly from card
  const handleQuickStatusChange = (itemId, newStatus) => {
    updateStoredListing(itemId, { status: newStatus })
    loadMyListings()
    showTemporaryMessage('success', `Status updated to "${newStatus}".`)
  }

  // Open the edit modal
  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setEditPrice(String(item.price))
    setEditStatus(item.status)
    setEditDescription(item.description || '')
    setEditErrors({})
    setShowEditModal(true)
  }

  // Save edits from modal
  const handleSaveEdit = () => {
    const newErrors = {}
    const numericPrice = Number(editPrice)
    if (editPrice === '' || isNaN(numericPrice) || numericPrice < 0) {
      newErrors.editPrice = 'Price must be a valid number (0 for Free).'
    } else if (numericPrice > 50000) {
      newErrors.editPrice = 'Price seems unusually high (max ₹50,000).'
    }
    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors)
      return
    }

    updateStoredListing(editingItem.id, {
      price: numericPrice,
      status: editStatus,
      description: editDescription.trim() || editingItem.description
    })

    loadMyListings()
    setShowEditModal(false)
    showTemporaryMessage('success', `"${editingItem.title}" updated successfully.`)
  }

  // Open delete confirmation
  const handleOpenDelete = (item) => {
    setDeletingItem(item)
    setShowDeleteModal(true)
  }

  // Confirm deletion
  const handleConfirmDelete = () => {
    deleteStoredListing(deletingItem.id)
    loadMyListings()
    setShowDeleteModal(false)
    showTemporaryMessage('info', `"${deletingItem.title}" has been removed from the marketplace.`)
  }

  return (
    <section className="py-5 bg-light-subtle flex-grow-1">
      <Container>
        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <Button
              variant="link"
              className="text-decoration-none text-secondary p-0 mb-2 d-inline-flex align-items-center gap-1 small fw-medium"
              onClick={onNavigateHome}
            >
              <i className="bi bi-arrow-left"></i> Back to Marketplace
            </Button>
            <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-grid-fill text-primary"></i>
              My Listings
            </h4>
            <p className="text-muted small mb-0 mt-1">
              Manage items you have posted as a seller on the STUDYCYCLE marketplace.
            </p>
          </div>

          {/* Student identity pill */}
          <div className="card border-0 bg-primary bg-opacity-10 rounded-4 px-3 py-2 border border-primary border-opacity-25 flex-shrink-0">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-person-circle text-primary fs-4"></i>
              <div>
                <div className="fw-bold text-dark small">{currentUser?.name || 'Student'}</div>
                <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
                  {currentUser?.branch} • Sem {currentUser?.semester}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Temporary feedback message */}
        {actionMessage && (
          <Alert variant={actionMessage.type} className="d-flex align-items-center gap-2 small shadow-sm rounded-3">
            <i className={`bi ${actionMessage.type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill'} fs-5`}></i>
            {actionMessage.text}
          </Alert>
        )}

        {/* Empty State */}
        {myListings.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
            <i className="bi bi-journal-plus display-3 text-muted mb-3 d-inline-block"></i>
            <h5 className="fw-bold text-dark mb-2">No Listings Yet</h5>
            <p className="text-muted small mb-4">
              You haven't posted any items yet. Start selling your unused textbooks, instruments, or lab gear!
            </p>
            <Button
              variant="primary"
              size="sm"
              className="rounded-pill px-4 shadow-sm fw-semibold"
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'post-listing' }))}
            >
              <i className="bi bi-plus-circle me-1"></i> Post Your First Listing
            </Button>
          </div>
        ) : (
          <>
            <div className="text-secondary small mb-3 fw-medium">
              You have <strong className="text-primary">{myListings.length}</strong> active listing{myListings.length !== 1 ? 's' : ''}
            </div>

            <Row className="g-4">
              {myListings.map((item) => (
                <Col key={item.id} xs={12} md={6} xl={4}>
                  <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden listing-card">
                    {/* Photo or icon banner */}
                    {item.photo ? (
                      <div style={{ height: '150px', overflow: 'hidden' }}>
                        <img
                          src={item.photo}
                          alt={item.title}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                    ) : (
                      <div className="card-media-placeholder d-flex align-items-center justify-content-center">
                        <i className={`bi ${item.icon || 'bi-box'} fs-1 text-primary`}></i>
                      </div>
                    )}

                    <Card.Body className="p-3">
                      {/* Title & Category */}
                      <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                        <div className="fw-bold text-dark small line-clamp-2 flex-grow-1" title={item.title}>
                          {item.title}
                        </div>
                        <Badge bg="light" text="dark" className="border small fw-normal flex-shrink-0">
                          {item.category}
                        </Badge>
                      </div>

                      {/* Item Academic Target (clearly distinct from student info) */}
                      <div className="text-muted small mb-1 d-flex align-items-center gap-1">
                        <i className="bi bi-mortarboard text-secondary"></i>
                        <span>Item for: <strong>{item.itemBranch}</strong> • {item.itemSemester}</span>
                      </div>
                      <div className="text-muted small mb-2 d-flex align-items-center gap-1">
                        <i className="bi bi-journal-text text-secondary"></i>
                        <span>Subject: {item.subject}</span>
                      </div>

                      {/* Availability Status — quick change dropdown */}
                      <div className="mb-3">
                        <Form.Label className="text-muted fw-medium small mb-1">
                          <i className="bi bi-toggle2-on me-1 text-primary"></i>
                          Availability Status:
                        </Form.Label>
                        <Form.Select
                          size="sm"
                          value={item.status}
                          onChange={(e) => handleQuickStatusChange(item.id, e.target.value)}
                          className={`fw-semibold border-${STATUS_COLORS[item.status]} text-${STATUS_COLORS[item.status]}`}
                          style={{ fontSize: '0.82rem' }}
                        >
                          {AVAILABILITY_STATUSES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </Form.Select>
                      </div>

                      {/* Price */}
                      <div className="d-flex align-items-center justify-content-between border-top pt-2 mb-3">
                        <div>
                          <span className="fs-5 fw-bold text-primary">
                            {item.price === 0 ? 'Free / Swap' : `₹${item.price}`}
                          </span>
                        </div>
                        <Badge bg={STATUS_COLORS[item.status]} className="d-flex align-items-center gap-1 px-2 py-1">
                          <i className={`bi ${STATUS_ICONS[item.status]}`}></i>
                          {item.status}
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="flex-grow-1 rounded-pill fw-medium"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <i className="bi bi-pencil me-1"></i> Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => handleOpenDelete(item)}
                          title="Delete listing"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* ============================
            EDIT MODAL
        ============================= */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="md">
          <Modal.Header closeButton>
            <Modal.Title className="fs-6 fw-bold text-dark">
              <i className="bi bi-pencil-square text-primary me-2"></i>
              Edit Listing
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingItem && (
              <div>
                <div className="alert alert-light border small text-secondary mb-3 py-2">
                  <strong className="text-dark">{editingItem.title}</strong>
                  <div className="text-muted mt-1">
                    Target: {editingItem.itemBranch} • {editingItem.itemSemester} • {editingItem.subject}
                  </div>
                </div>

                {/* Price */}
                <Form.Group className="mb-3" controlId="editPrice">
                  <Form.Label className="small fw-medium text-dark">
                    Update Price (₹)
                  </Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-white">₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      min="0"
                      step="10"
                      value={editPrice}
                      onChange={(e) => {
                        setEditPrice(e.target.value)
                        if (editErrors.editPrice) setEditErrors({})
                      }}
                      isInvalid={!!editErrors.editPrice}
                    />
                    <Form.Control.Feedback type="invalid">
                      {editErrors.editPrice}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted small">Enter 0 for Free / Direct Swap</Form.Text>
                </Form.Group>

                {/* Status */}
                <Form.Group className="mb-3" controlId="editStatus">
                  <Form.Label className="small fw-medium text-dark">
                    Availability Status
                  </Form.Label>
                  <Form.Select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    {AVAILABILITY_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted small">
                    "Reserved" means a student has expressed interest. "Taken" means the item has changed hands.
                  </Form.Text>
                </Form.Group>

                {/* Description */}
                <Form.Group controlId="editDescription">
                  <Form.Label className="small fw-medium text-dark">
                    Update Description / Notes
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Update condition notes, accessories included, etc."
                  />
                </Form.Group>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveEdit} className="fw-semibold">
              <i className="bi bi-save me-1"></i> Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ============================
            DELETE CONFIRMATION MODAL
        ============================= */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
          <Modal.Header closeButton>
            <Modal.Title className="fs-6 fw-bold text-danger">
              <i className="bi bi-trash me-2"></i>Remove Listing?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {deletingItem && (
              <p className="text-secondary small mb-0">
                This will permanently remove <strong>"{deletingItem.title}"</strong> from the marketplace.
                This action cannot be undone.
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
              Keep Listing
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete} className="fw-semibold">
              <i className="bi bi-trash me-1"></i> Yes, Remove
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </section>
  )
}

export default MyListingsPage
