import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'

function HowItWorks() {
  const steps = [
    {
      stepNumber: '01',
      title: 'Find What You Need',
      desc: 'Use the instant search or category filters to locate textbooks, drawing instruments, or lab gear.',
      icon: 'bi-search',
      color: 'primary'
    },
    {
      stepNumber: '02',
      title: 'Connect with Student',
      desc: 'Reach out directly to the peer or senior who listed the item to confirm condition and availability.',
      icon: 'bi-chat-left-text',
      color: 'success'
    },
    {
      stepNumber: '03',
      title: 'Handover on Campus',
      desc: 'Meet safely at your college library, canteen, or department lobby for a quick, zero-cost physical exchange.',
      icon: 'bi-people',
      color: 'warning'
    }
  ]

  return (
    <section id="how-it-works" className="py-5 bg-white border-top">
      <Container>
        <div className="text-center max-w-xl mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-2">
            Simple 3-Step Process
          </span>
          <h2 className="fw-bold text-dark">How STUDYCYCLE Works</h2>
          <p className="text-secondary small">
            Designed specifically for frictionless peer-to-peer sharing within college campuses.
          </p>
        </div>

        <Row className="g-4">
          {steps.map((step) => (
            <Col key={step.stepNumber} md={4}>
              <Card className="h-100 border-0 shadow-xs p-3 text-center bg-light-subtle rounded-4">
                <Card.Body>
                  <div className="d-inline-flex p-3 rounded-circle bg-white shadow-xs text-primary mb-3">
                    <i className={`bi ${step.icon} fs-2 text-${step.color}`}></i>
                  </div>
                  <div className="text-muted fw-bold small text-uppercase tracking-wider mb-1">
                    Step {step.stepNumber}
                  </div>
                  <Card.Title className="fw-bold text-dark mb-2">
                    {step.title}
                  </Card.Title>
                  <Card.Text className="text-secondary small">
                    {step.desc}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default HowItWorks
