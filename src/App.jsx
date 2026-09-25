import React, { useState, useEffect } from 'react'
import NavigationBar from './components/NavigationBar.jsx'
import Hero from './components/Hero.jsx'
import ListingSection from './components/ListingSection.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import LoginPage from './components/LoginPage.jsx'
import PostListingPage from './components/PostListingPage.jsx'
import MyListingsPage from './components/MyListingsPage.jsx'
import Footer from './components/Footer.jsx'
import { getStoredUser, clearStoredUser } from './utils/storage.js'

function App() {
  // Active page state: 'home' | 'login' | 'post-listing' | 'my-listings'
  const [currentPage, setCurrentPage] = useState('login')

  // Current logged-in student profile (null = not logged in)
  const [currentUser, setCurrentUser] = useState(null)

  // Version counter to force ListingSection to re-read localStorage after a new listing is posted
  const [listingsVersion, setListingsVersion] = useState(0)

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedUser = getStoredUser()
    // Only restore if a real user session was saved (has name field)
    if (storedUser?.name && storedUser?.email) {
      setCurrentUser(storedUser)
    }
  }, [])

  // Listen for internal navigate events dispatched from child components
  useEffect(() => {
    const handler = (e) => setCurrentPage(e.detail)
    window.addEventListener('navigate', handler)
    return () => window.removeEventListener('navigate', handler)
  }, [])

  const handleLoginSuccess = (userProfile) => {
    setCurrentUser(userProfile)
  }

  const handleLogout = () => {
    clearStoredUser()
    setCurrentUser(null)
    setCurrentPage('home')
  }

  const handleNavigate = (page) => {
    // Guard: only logged-in students can post or manage listings
    if ((page === 'post-listing' || page === 'my-listings') && !currentUser) {
      setCurrentPage('login')
      return
    }
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleListingCreated = () => {
    // Bump version counter so ListingSection re-reads localStorage
    setListingsVersion((v) => v + 1)
  }

  const scrollToExplore = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-body">
      {/* NAVIGATION — always visible */}
      <NavigationBar
        currentPage={currentPage}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* PAGE ROUTER */}
      {currentPage === 'home' && (
        <main>
          <Hero onExploreClick={scrollToExplore} />
          <ListingSection listingsVersion={listingsVersion} />
          <HowItWorks />
        </main>
      )}

      {currentPage === 'login' && (
        <main className="d-flex flex-column flex-grow-1">
          <LoginPage
            onNavigateHome={() => handleNavigate('home')}
            onLoginSuccess={handleLoginSuccess}
          />
        </main>
      )}

      {currentPage === 'post-listing' && (
        <main className="d-flex flex-column flex-grow-1">
          <PostListingPage
            currentUser={currentUser}
            onNavigateHome={() => handleNavigate('home')}
            onListingCreated={handleListingCreated}
          />
        </main>
      )}

      {currentPage === 'my-listings' && (
        <main className="d-flex flex-column flex-grow-1">
          <MyListingsPage
            currentUser={currentUser}
            onNavigateHome={() => handleNavigate('home')}
          />
        </main>
      )}

      {/* FOOTER — always visible */}
      <Footer />
    </div>
  )
}

export default App
