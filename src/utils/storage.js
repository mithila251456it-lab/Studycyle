// Local storage utility for STUDYCYCLE
// Handles persistence for listings and student user session without a backend

const STORAGE_KEYS = {
  LISTINGS: 'studycycle_listings',
  CURRENT_USER: 'studycycle_current_user'
};

// Default mock listings to seed localStorage if empty
const INITIAL_DEFAULT_LISTINGS = [
  {
    id: 'item-1',
    title: 'Higher Engineering Mathematics (B.S. Grewal)',
    category: 'Book',
    resourceType: 'Textbook',
    itemBranch: 'Common / 1st Year',
    itemSemester: 'Semester 1',
    subject: 'Applied Mathematics I & II',
    condition: 'Good Condition',
    price: 350,
    originalPrice: 850,
    status: 'Available', // 'Available', 'Reserved', 'Taken'
    exchangeAvailable: true,
    photo: null,
    icon: 'bi-book',
    description: 'Standard syllabus mathematics reference textbook. Minimal pencil markings, all formula sheets intact.',
    seller: {
      name: 'Rahul Sharma',
      email: 'rahul.1234@mhssce.ac.in',
      branch: 'Information Technology',
      semester: '3'
    },
    createdAt: '2026-09-20T10:00:00Z'
  },
  {
    id: 'item-2',
    title: 'Engineering Mini-Drafter with Scale & Desk Clamp',
    category: 'Instrument',
    resourceType: 'Drawing Tool',
    itemBranch: 'Mechanical Engineering',
    itemSemester: 'Semester 1',
    subject: 'Engineering Graphics & Design',
    condition: 'Like New',
    price: 280,
    originalPrice: 650,
    status: 'Available',
    exchangeAvailable: false,
    photo: null,
    icon: 'bi-rulers',
    description: 'Used for only one semester of Engineering Drawing. Smooth protractor rotation and rigid clamp.',
    seller: {
      name: 'Priya Patel',
      email: 'priya.5678@mhssce.ac.in',
      branch: 'Civil Engineering',
      semester: '3'
    },
    createdAt: '2026-09-21T11:30:00Z'
  },
  {
    id: 'item-3',
    title: 'Casio FX-991EX ClassWiz Scientific Calculator',
    category: 'Instrument',
    resourceType: 'Electronic Tool',
    itemBranch: 'All Branches',
    itemSemester: 'All Semesters',
    subject: 'All Engineering Calculation Labs',
    condition: 'Like New',
    price: 600,
    originalPrice: 1400,
    status: 'Available',
    exchangeAvailable: false,
    photo: null,
    icon: 'bi-calculator',
    description: 'High-res display, 552 scientific functions, matrix and equation solver. Hard slip cover included.',
    seller: {
      name: 'Aman Gupta',
      email: 'aman.9012@mhssce.ac.in',
      branch: 'Computer Engineering',
      semester: '4'
    },
    createdAt: '2026-09-21T14:15:00Z'
  },
  {
    id: 'item-4',
    title: 'White Cotton Lab Coat (Size L) & Protective Goggles',
    category: 'Instrument',
    resourceType: 'Lab Gear',
    itemBranch: 'Common / 1st Year',
    itemSemester: 'Semester 1',
    subject: 'Applied Chemistry & Physics Lab',
    condition: 'Good Condition',
    price: 180,
    originalPrice: 450,
    status: 'Available',
    exchangeAvailable: true,
    photo: null,
    icon: 'bi-shield-check',
    description: 'Clean, freshly washed full-sleeve cotton lab coat with chest and deep side pockets.',
    seller: {
      name: 'Sneha Nair',
      email: 'sneha.3456@mhssce.ac.in',
      branch: 'AI & Data Science',
      semester: '2'
    },
    createdAt: '2026-09-21T16:00:00Z'
  },
  {
    id: 'item-5',
    title: 'Data Structures and Algorithms in Java (Karumanchi)',
    category: 'Book',
    resourceType: 'Reference Book',
    itemBranch: 'Computer Engineering',
    itemSemester: 'Semester 3',
    subject: 'Data Structures',
    condition: 'Fair Condition',
    price: 400,
    originalPrice: 900,
    status: 'Available',
    exchangeAvailable: true,
    photo: null,
    icon: 'bi-code-slash',
    description: 'Essential for technical placement preparation and semester exams. Highlights on tree and graph algorithms.',
    seller: {
      name: 'Vikram Reddy',
      email: 'vikram.7890@mhssce.ac.in',
      branch: 'Information Technology',
      semester: '4'
    },
    createdAt: '2026-09-22T08:00:00Z'
  },
  {
    id: 'item-6',
    title: 'Digital Multimeter with Test Probes & 9V Battery',
    category: 'Instrument',
    resourceType: 'Electronic Tool',
    itemBranch: 'Electronics & Telecommunication',
    itemSemester: 'Semester 3',
    subject: 'Basic Electrical & Electronics Lab',
    condition: 'Like New',
    price: 250,
    originalPrice: 550,
    status: 'Available',
    exchangeAvailable: true,
    photo: null,
    icon: 'bi-lightning-charge',
    description: 'Measures AC/DC voltage, resistance, diode test, and audible continuity buzzer. Working battery installed.',
    seller: {
      name: 'Farhan Shaikh',
      email: 'farhan.1122@mhssce.ac.in',
      branch: 'EXTC',
      semester: '3'
    },
    createdAt: '2026-09-22T09:30:00Z'
  }
];

// Default demo student profile so the user can test immediately
const DEFAULT_DEMO_STUDENT = {
  name: 'Rahul Sharma',
  email: 'rahul.1234@mhssce.ac.in',
  branch: 'Information Technology',
  semester: '3'
};

/**
 * Retrieve all listings from localStorage.
 * Initializes default listings if none exist.
 */
export function getStoredListings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(INITIAL_DEFAULT_LISTINGS));
      return INITIAL_DEFAULT_LISTINGS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read listings from localStorage', err);
    return INITIAL_DEFAULT_LISTINGS;
  }
}

/**
 * Save listings array to localStorage
 */
export function saveListings(listings) {
  try {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  } catch (err) {
    console.error('Failed to save listings to localStorage', err);
  }
}

/**
 * Add a new listing to localStorage
 */
export function addStoredListing(listingData, sellerProfile) {
  const currentListings = getStoredListings();

  const newListing = {
    id: `item-${Date.now()}`,
    ...listingData,
    seller: {
      name: sellerProfile.name,
      email: sellerProfile.email,
      branch: sellerProfile.branch,
      semester: sellerProfile.semester
    },
    createdAt: new Date().toISOString()
  };

  const updated = [newListing, ...currentListings];
  saveListings(updated);
  return newListing;
}

/**
 * Update a listing (e.g. status 'Available'/'Reserved'/'Taken', price, etc.)
 */
export function updateStoredListing(id, updatedFields) {
  const currentListings = getStoredListings();
  const updated = currentListings.map((item) => {
    if (item.id === id) {
      return { ...item, ...updatedFields, updatedAt: new Date().toISOString() };
    }
    return item;
  });
  saveListings(updated);
  return updated;
}

/**
 * Delete a listing from localStorage
 */
export function deleteStoredListing(id) {
  const currentListings = getStoredListings();
  const updated = currentListings.filter((item) => item.id !== id);
  saveListings(updated);
  return updated;
}

/**
 * Retrieve current active student user session
 */
export function getStoredUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) {
      // Default to demo student so features work right away
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_DEMO_STUDENT));
      return DEFAULT_DEMO_STUDENT;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read user from localStorage', err);
    return DEFAULT_DEMO_STUDENT;
  }
}

/**
 * Save or update current active student user session
 */
export function saveStoredUser(user) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user to localStorage', err);
  }
}

/**
 * Clear student user session (logout)
 */
export function clearStoredUser() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (err) {
    console.error('Failed to clear user from localStorage', err);
  }
}
