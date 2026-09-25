import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
    <footer id="about" className="bg-dark text-light py-5 mt-auto border-top">
      <Container>
        <Row className="gy-4">
          {/* Col 1: About STUDYCYCLE */}
          <Col lg={5} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="p-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
                <i className="bi bi-recycle fs-5"></i>
              </span>
              <span className="fw-bold fs-4 text-white">STUDYCYCLE</span>
            </div>
            <p className="text-secondary small pe-lg-4 mb-3">
              A student-to-student book and equipment exchange system created to make college 
              education more affordable, collaborative, and sustainable through campus recycling.
            </p>
            <div className="badge bg-secondary-subtle text-dark border px-3 py-2 rounded-pill small">
              College Capstone / Project Prototype
            </div>
          </Col>

          {/* Col 2: Popular Categories */}
          <Col lg={3} md={6}>
            <h6 className="fw-bold text-white mb-3">Item Categories</h6>
            <ul className="list-unstyled text-secondary small mb-0 d-grid gap-2">
              <li><i className="bi bi-chevron-right text-primary me-1"></i> Syllabus Textbooks</li>
              <li><i className="bi bi-chevron-right text-primary me-1"></i> Engineering Mini-Drafters</li>
              <li><i className="bi bi-chevron-right text-primary me-1"></i> Scientific Calculators</li>
              <li><i className="bi bi-chevron-right text-primary me-1"></i> Lab Coats & Safety Glasses</li>
              <li><i className="bi bi-chevron-right text-primary me-1"></i> Electronics & Breadboards</li>
            </ul>
          </Col>

          {/* Col 3: Safe Campus Exchange Tips */}
          <Col lg={4} md={12}>
            <h6 className="fw-bold text-white mb-3">
              <i className="bi bi-shield-check text-success me-2"></i>Campus Exchange Safety
            </h6>
            <div className="p-3 bg-secondary bg-opacity-10 rounded-3 border border-secondary border-opacity-25 small text-secondary">
              <ul className="mb-0 ps-3">
                <li>Meet in open campus spots like the central library or cafeteria.</li>
                <li>Inspect item condition and verify page completeness in person.</li>
                <li>Never share private student passwords or college IDs.</li>
              </ul>
            </div>
          </Col>
        </Row>

        <hr className="my-4 border-secondary border-opacity-25" />

        <Row className="align-items-center small text-secondary">
          <Col sm={6} className="text-center text-sm-start mb-2 mb-sm-0">
            © {new Date().getFullYear()} STUDYCYCLE • College Project Frontend UI
          </Col>
          <Col sm={6} className="text-center text-sm-end">
            Built with React & Bootstrap • Pure JavaScript
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
