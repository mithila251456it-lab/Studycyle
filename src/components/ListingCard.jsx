import React from 'react'
import { Card, Badge, Button } from 'react-bootstrap'

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

function ListingCard({ item, onContactClick }) {
  const discount =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : 0

  return (
    <Card className="h-100 listing-card border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column">
      {/* Photo or icon banner */}
      {item.photo ? (
        <div style={{ height: '140px', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={item.photo}
            alt={item.title}
            className="w-100 h-100 object-fit-cover"
          />
        </div>
      ) : (
        <div className="card-media-placeholder d-flex align-items-center justify-content-center flex-shrink-0">
          <span className="p-3 bg-white rounded-circle shadow-xs d-inline-flex">
            <i className={`bi ${item.icon || 'bi-box'} fs-1 text-primary`}></i>
          </span>
        </div>
      )}

      <Card.Body className="d-flex flex-column p-3 pt-2">
        {/* Availability status + category badges */}
        <div className="d-flex align-items-center justify-content-between mb-2 gap-1">
          <Badge bg="light" text="dark" className="border px-2 py-1 small fw-normal">
            {item.category}
          </Badge>
          <Badge
            bg={STATUS_COLORS[item.status] || 'success'}
            className="d-flex align-items-center gap-1 px-2 py-1 small fw-normal"
          >
            <i className={`bi ${STATUS_ICONS[item.status] || 'bi-check-circle-fill'}`}></i>
            {item.status || 'Available'}
          </Badge>
        </div>

        {/* Condition badge */}
        <div className="mb-2">
          <Badge
            bg={item.condition === 'Like New' ? 'primary' : item.condition === 'Good Condition' ? 'success' : 'warning'}
            text={item.condition === 'Fair Condition' ? 'dark' : undefined}
            className="px-2 py-1 small fw-normal"
          >
            {item.condition}
          </Badge>
        </div>

        {/* Title */}
        <div className="fw-bold text-dark small mb-1 line-clamp-2" title={item.title}>
          {item.title}
        </div>

        {/* Item Academic Target — clearly distinct from seller's student info */}
        <div className="text-muted mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.73rem' }}>
          <i className="bi bi-mortarboard text-secondary"></i>
          <span>
            <span className="fw-medium">Item for:</span> {item.itemBranch || item.branch} • {item.itemSemester || item.semester}
          </span>
        </div>
        {item.subject && (
          <div className="text-muted mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.73rem' }}>
            <i className="bi bi-journal-text text-secondary"></i>
            <span>{item.subject}</span>
          </div>
        )}

        {/* Description */}
        <div className="text-secondary mb-2 line-clamp-2" style={{ fontSize: '0.75rem' }}>
          {item.description}
        </div>

        {/* Exchange available badge */}
        {item.exchangeAvailable && (
          <div
            className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill mb-2 py-1 px-2 align-self-start small"
            style={{ fontSize: '0.7rem' }}
          >
            <i className="bi bi-arrow-left-right me-1"></i> Open to swap
          </div>
        )}

        {/* Price section — pushed to bottom */}
        <div className="mt-auto pt-2 border-top">
          <div className="d-flex align-items-baseline justify-content-between mb-1">
            <div>
              <span className="fs-5 fw-bold text-primary">
                {item.price === 0 ? 'Free' : `₹${item.price}`}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-muted text-decoration-line-through ms-2 small">
                  ₹{item.originalPrice}
                </span>
              )}
            </div>
            {discount > 0 && (
              <Badge bg="danger-subtle" text="danger" className="fw-bold small">
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* Seller info — clearly distinguished from item target */}
          <div className="text-muted mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-person-circle text-secondary"></i>
            <span>
              <span className="fw-medium">Seller:</span> {item.seller?.name || 'Student'}
              {item.seller?.branch && ` (${item.seller.branch}`}
              {item.seller?.semester && `, Sem ${item.seller.semester})`}
            </span>
          </div>

          {/* Contact button — grayed out if item is Taken */}
          <div className="d-grid">
            <Button
              variant={item.status === 'Taken' ? 'outline-secondary' : 'outline-primary'}
              size="sm"
              className="rounded-pill fw-medium"
              onClick={() => onContactClick(item)}
              disabled={item.status === 'Taken'}
              title={item.status === 'Taken' ? 'This item is no longer available' : 'Contact the seller'}
            >
              <i className="bi bi-chat-dots me-1"></i>
              {item.status === 'Taken' ? 'No Longer Available' : 'Contact Seller'}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ListingCard
