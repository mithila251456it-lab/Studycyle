import React from 'react'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'

function NavigationBar({
  currentPage,
  currentUser,
  onNavigate,
  onLogout
}) {
  return (
    <Navbar expand="lg" bg="white" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand
          onClick={() => onNavigate('home')}
          style={{ cursor: 'pointer' }}
          className="fw-bold text-primary"
        >
          STUDYCYCLE
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="studycycle-navbar" />

        <Navbar.Collapse id="studycycle-navbar">
          <Nav className="ms-auto align-items-lg-center gap-2">
            <Nav.Link
              active={currentPage === 'home'}
              onClick={() => onNavigate('home')}
            >
              Marketplace
            </Nav.Link>

            {currentUser && (
              <>
                <Nav.Link
                  active={currentPage === 'post-listing'}
                  onClick={() => onNavigate('post-listing')}
                >
                  Post Listing
                </Nav.Link>

                <Nav.Link
                  active={currentPage === 'my-listings'}
                  onClick={() => onNavigate('my-listings')}
                >
                  My Listings
                </Nav.Link>

                <span className="text-secondary small">
                  Hi, {currentUser.name}
                </span>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </>
            )}

            {!currentUser && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('login')}
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar