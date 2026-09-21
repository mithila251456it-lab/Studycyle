import React, { useState, useMemo, useEffect } from 'react'
import { Container, Row, Col, Modal, Button, Badge } from 'react-bootstrap'
import SearchBar from './SearchBar.jsx'
import CategoryFilter from './CategoryFilter.jsx'
import ListingCard from './ListingCard.jsx'
import { ITEM_CATEGORIES } from '../data/mockListings.js'
import { getStoredListings } from '../utils/storage.js'

function ListingSection({ listingsVersion }) {
  const [activeCategory, setActiveCategory] = useState('All Items')
  const [searchTerm, setSearchTerm] = useState('')
  const [allListings, setAllListings] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showContactModal, setShowContactModal] = useState(false)

  // Re-read from localStorage whenever a new listing is saved (via listingsVersion prop)
  useEffect(() => {
    setAllListings(getStoredListings())
  }, [listingsVersion])

  const filteredListings = useMemo(() => {
    return allListings.filter((item) => {
      const matchesCategory =
        activeCategory === 'All Items' || item.category === activeCategory

      const query = searchTerm.toLowerCase().trim()
      const matchesSearch =
        query === '' ||
        item.title.toLowerCase().includes(query) ||
        (item.subject && item.subject.toLowerCase().includes(query)) ||
        (item.itemBranch && item.itemBranch.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.seller?.name && item.seller.name.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  }, [allListings, activeCategory, searchTerm])

  const handleContactSeller = (item) => {
    setSelectedItem(item)
    setShowContactModal(true)
  }

  const handleCloseModal = () => {
    setShowContactModal(false)
    setSelectedItem(null)
  }

  const handleResetFilters = () => {
    setActiveCategory('All Items')
    setSearchTerm('')
  }

  return (
    <section id="explore" className="py-5 bg-light-subtle">
      <Container>
        {/* Section Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Campus Exchange Marketplace</h2>
            <p className="text-secondary small mb-0">
              Search books, instruments, and lab gear — shared by fellow MHSSCE students.
            </p>
          </div>
          <span className="badge bg-white text-secondary border px-3 py-2 rounded-pill small flex-shrink-0">
            Showing{' '}
            <strong className="text-primary">{filteredListings.length}</strong> of{' '}
            {allListings.length} items
          </span>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
        />

        <CategoryFilter
          categories={ITEM_CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {filteredListings.length > 0 ? (
          <Row className="g-4">
            {filteredListings.map((item) => (
              <Col key={item.id} xs={12} sm={6} lg={4} xl={3}>
                <ListingCard item={item} onContactClick={handleContactSeller} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5 bg-white rounded-4 border shadow-sm my-4">
            <i className="bi bi-search display-3 text-muted mb-3 d-inline-block"></i>
            <h4 className="fw-bold text-dark">No matching items found</h4>
            <p className="text-muted small mb-4">
              No results for{searchTerm && <> "<strong>{searchTerm}</strong>"</>}
              {activeCategory !== 'All Items' && <> in category <strong>{activeCategory}</strong></>}.
            </p>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleResetFilters}
              className="rounded-pill px-4"
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
            </Button>
          </div>
        )}

        {/* Contact Seller Modal */}
        <Modal show={showContactModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fs-6 fw-bold text-dark d-flex align-items-center gap-2">
              <i className="bi bi-chat-dots-fill text-primary"></i> Contact Seller
            </Modal.Title>
          </Modal.Header>
          {selectedItem && (
            <Modal.Body>
              <div className="card border-0 bg-light p-3 mb-3 rounded-3">
                <h6 className="fw-bold text-dark mb-1">{selectedItem.title}</h6>
                <div className="text-muted small mb-2">
                  Item for: <strong>{selectedItem.itemBranch || selectedItem.branch}</strong> • {selectedItem.itemSemester || selectedItem.semester}
                  {selectedItem.subject && <span> • {selectedItem.subject}</span>}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold text-primary">
                    {selectedItem.price === 0 ? 'Free / Swap' : `₹${selectedItem.price}`}
                  </span>
                  <Badge bg={selectedItem.condition === 'Like New' ? 'primary' : 'success'}>
                    {selectedItem.condition}
                  </Badge>
                </div>
              </div>

              <div className="bg-light rounded-3 p-3 mb-3 border small">
                <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <i className="bi bi-person-circle text-primary fs-5"></i>
                  {selectedItem.seller?.name || 'Student Seller'}
                </div>
                <div className="text-muted">
                  Seller's Branch: <strong>{selectedItem.seller?.branch || '—'}</strong> • Sem {selectedItem.seller?.semester || '—'}
                </div>
                <div className="text-muted">
                  Contact: <strong>{selectedItem.seller?.email || 'email@mhssce.ac.in'}</strong>
                </div>
              </div>

              <div className="alert alert-warning small d-flex gap-2 align-items-start mb-0">
                <i className="bi bi-shield-lock-fill text-warning-emphasis fs-5"></i>
                <div>
                  <strong>Backend Feature:</strong> Direct campus messaging and verified email notification
                  will be connected once the backend student authentication and chat APIs are built.
                </div>
              </div>
            </Modal.Body>
          )}
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleCloseModal}>Close</Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert('This will trigger the real email / in-app message to the seller once the backend chat API is connected.')
                handleCloseModal()
              }}
            >
              <i className="bi bi-send me-1"></i> Send Interest (Preview)
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </section>
  )
}

export default ListingSection
