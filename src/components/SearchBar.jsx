import React from 'react'
import { InputGroup, Form, Button } from 'react-bootstrap'

function SearchBar({ searchTerm, onSearchChange, onClear }) {
  return (
    <div className="search-bar-wrapper mb-4">
      <InputGroup size="lg" className="shadow-sm rounded-pill overflow-hidden border">
        <InputGroup.Text className="bg-white border-0 ps-4 text-primary">
          <i className="bi bi-search fs-5"></i>
        </InputGroup.Text>

        <Form.Control
          type="text"
          placeholder="Search books, drafters, calculators, lab coats by title or branch..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-0 shadow-none ps-2 fs-6"
          aria-label="Search study cycle items"
        />

        {searchTerm && (
          <Button
            variant="light"
            onClick={onClear}
            className="border-0 pe-3 text-secondary"
            title="Clear search"
          >
            <i className="bi bi-x-circle-fill"></i>
          </Button>
        )}
      </InputGroup>
    </div>
  )
}

export default SearchBar
