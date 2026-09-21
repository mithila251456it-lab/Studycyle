import React, { useState } from 'react'
import { Navbar, Nav, Container, Button, Badge, Modal } from 'react-bootstrap'

function NavigationBar({ currentPage, currentUser, onNavigate, onLogout }) {
  const [showModal, setShowModal] = useState(false)
  const [modalFeature, setModalFeature] = useState('')

  const handleOpenNotice = (featureName) => {
    setModalFeature(featureName)
    setShowModal(true)
  }

  const handleNavClick = (e, page) => {
    e.preventDefault()
    onNavigate(page)
  }

  const handleScrollNav = (e, sectionId) => {
    e.preventDefault()
    if (currentPage !== 'home') {
      onNavigate('home')
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <Navbar bg="white" expand="lg" sticky="top" className="border-bottom shadow-sm py-2">
        <Container>
          {/* Brand */}
          <Navbar.Brand
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="fw-bold fs-5 text-primary d-flex align-items-center gap-2"
            style={{ cursor: 'pointer' }}
          >
            <span className="p-2 bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center">
              <i className="bi bi-recycle fs-5 text-primary"></i>
            </span>
            STUDYCYCLE
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="studycycle-nav" />

          <Navbar.Collapse id="studycycle-nav">
            {/* Nav Links */}
            <Nav className="me-auto ms-lg-3">
              <Nav.Link
                href="#home"
                onClick={(e) => handleNavClick(e, 'home')}
                className={`fw-medium ${currentPage === 'home' ? 'text-primary' : 'text-secondary'}`}
              >
                Home
              </Nav.Link>
              <Nav.Link
                href="#explore"
                onClick={(e) => handleScrollNav(e, 'explore')}
                className="fw-medium text-secondary"
              >
                Browse Items
              </Nav.Link>
              <Nav.Link
                href="#how-it-works"
                onClick={(e) => handleScrollNav(e, 'how-it-works')}
                className="fw-medium text-secondary"
              >
                How It Works
              </Nav.Link>
            </Nav>

            {/* User action area */}
            <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
              {currentUser ? (
                <>
                  {/* Student identity pill */}
                  <div
                    className="d-none d-md-flex align-items-center gap-2 px-3 py-2 bg-primary-subtle rounded-pill border border-primary border-opacity-25"
                    style={{ cursor: 'default' }}
                  >
                    <i className="bi bi-person-circle text-primary"></i>
                    <span className="small fw-semibold text-primary" style={{ maxWidth: '110px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {currentUser.name}
                    </span>
                    <span className="text-muted small">
                      {currentUser.branch?.split(' ')[0]} Sem&nbsp;{currentUser.semester}
                    </span>
                  </div>

                  <Button
                    variant={currentPage === 'my-listings' ? 'primary' : 'outline-secondary'}
                    size="sm"
                    className="px-3 py-2 fw-medium rounded-pill"
                    onClick={() => onNavigate('my-listings')}
                  >
                    <i className="bi bi-grid me-1"></i>
                    <span className="d-none d-sm-inline">My Listings</span>
                  </Button>

                  <Button
                    variant={currentPage === 'post-listing' ? 'primary' : 'primary'}
                    size="sm"
                    className="px-3 py-2 fw-semibold rounded-pill shadow-sm"
                    onClick={() => onNavigate('post-listing')}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Post Listing
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="px-2 py-2 rounded-pill"
                    onClick={onLogout}
                    title="Log out"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={currentPage === 'login' ? 'primary' : 'outline-secondary'}
                    size="sm"
                    className="px-3 py-2 fw-medium rounded-pill"
                    onClick={() => onNavigate('login')}
                  >
                    <i className="bi bi-person me-1"></i> Log In
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    className="px-3 py-2 fw-semibold rounded-pill shadow-sm"
                    onClick={() => handleOpenNotice('Post Listing — Login Required')}
                  >
                    <i className="bi bi-plus-circle me-1"></i> Post Listing
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Notice modal for non-logged-in users */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold text-primary">
            <i className="bi bi-person-lock me-2"></i>{modalFeature}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info small d-flex gap-2 align-items-start">
            <i className="bi bi-info-circle-fill fs-5"></i>
            <div>
              <strong>Login Required:</strong> Please log in with your <code>@mhssce.ac.in</code> student
              email first to post a listing or manage your items.
            </div>
          </div>
          <p className="text-secondary small mb-0">
            Click the <strong>"Log In"</strong> button in the navbar to sign in!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" size="sm" onClick={() => { setShowModal(false); onNavigate('login') }}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default NavigationBar
