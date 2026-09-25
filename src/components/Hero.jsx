import React from 'react'
import { Container, Row, Col, Badge, Button } from 'react-bootstrap'

function Hero({ onExploreClick }) {
  return (
    <section className="hero-section py-5">
      <Container>
        <Row className="align-items-center g-4 py-3">
          {/* Hero text */}
          <Col lg={7} className="text-center text-lg-start">
            <Badge bg="primary" className="px-3 py-2 rounded-pill mb-3 fw-normal">
              🎓 College Student-to-Student Marketplace
            </Badge>

            <h1 className="display-4 fw-bold text-dark mb-3 lh-sm">
              Pass on your gear. <br />
              <span className="text-primary">Cut college costs.</span>
            </h1>

            <p className="lead text-secondary mb-4 fs-6">
              Why pay full price every semester? <strong>STUDYCYCLE</strong> allows students to buy,
              sell, and swap syllabus textbooks, engineering drafters, calculators, and lab coats 
              directly with peers on campus.
            </p>

            {/* Quick Badges */}
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start mb-4">
              <span className="badge bg-white text-dark border px-3 py-2 rounded-pill shadow-xs">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i> Campus Pickup
              </span>
              <span className="badge bg-white text-dark border px-3 py-2 rounded-pill shadow-xs">
                <i className="bi bi-tag-fill text-success me-1"></i> Student Prices
              </span>
              <span className="badge bg-white text-dark border px-3 py-2 rounded-pill shadow-xs">
                <i className="bi bi-arrow-repeat text-primary me-1"></i> Book Swap Option
              </span>
            </div>

            {/* Action buttons */}
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
              <Button
                variant="primary"
                size="lg"
                className="px-4 py-2 fw-semibold rounded-pill shadow-sm"
                onClick={onExploreClick}
              >
                <i className="bi bi-search me-2"></i> Browse Items
              </Button>
              <Button
                variant="outline-dark"
                size="lg"
                className="px-4 py-2 fw-semibold rounded-pill"
                href="#how-it-works"
              >
                <i className="bi bi-question-circle me-2"></i> How It Works
              </Button>
            </div>
          </Col>

          {/* Hero graphic / illustration card */}
          <Col lg={5}>
            <div className="bg-white rounded-4 shadow-sm border p-4 text-center hero-card">
              <div className="p-3 bg-primary-subtle text-primary rounded-circle d-inline-flex mb-3">
                <i className="bi bi-arrow-left-right display-4"></i>
              </div>
              <h4 className="fw-bold text-dark mb-2">Student Gear Exchange</h4>
              <p className="text-muted small mb-3">
                Finished with 1st year Engineering Drawing? Don't let your drafter and books sit idle. 
                List them in 2 minutes!
              </p>
              <hr className="my-3 text-muted" />
              <Row className="g-2 text-center text-muted small">
                <Col xs={4}>
                  <div className="fw-bold text-dark fs-5">8+</div>
                  <div>Sample Items</div>
                </Col>
                <Col xs={4}>
                  <div className="fw-bold text-success fs-5">₹0</div>
                  <div>Platform Fee</div>
                </Col>
                <Col xs={4}>
                  <div className="fw-bold text-primary fs-5">100%</div>
                  <div>Peer Handover</div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Hero
