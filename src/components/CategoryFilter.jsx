import React from 'react'
import { Button } from 'react-bootstrap'

const CATEGORY_ICONS = {
  'All Items': 'bi-grid-fill',
  'Book': 'bi-book-fill',
  'Instrument': 'bi-rulers',
  'Other': 'bi-box-seam'
}

function CategoryFilter({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start mb-4">
      {categories.map((category) => {
        const isActive = activeCategory === category
        const iconClass = CATEGORY_ICONS[category] || 'bi-tag'

        return (
          <Button
            key={category}
            variant={isActive ? 'primary' : 'outline-secondary'}
            size="sm"
            className={`px-3 py-2 rounded-pill fw-medium transition-all ${
              isActive ? 'shadow-sm' : 'bg-white'
            }`}
            onClick={() => onSelectCategory(category)}
          >
            <i className={`bi ${iconClass} me-2`}></i>
            {category}
          </Button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
