/**
 * CardComponent Usage Examples
 * 
 * This file demonstrates how to use the CardComponent in different scenarios
 */

// Example 1: Basic Usage
function basicUsage() {
  const container = document.getElementById('cardContainer');
  
  const cardComponent = new CardComponent(container, {
    onCardClick: (userId, event) => {
      console.log(`Card clicked: ${userId}`);
    },
    onWhatsAppClick: (userId, event) => {
      console.log(`WhatsApp clicked: ${userId}`);
    },
    onNavigationClick: (userId, event) => {
      console.log(`Navigation clicked: ${userId}`);
    }
  });

  // Add sample data
  const sampleData = [
    { id: 'user1', username: 'Ahmed Ali', itemCount: 3, urgent: false },
    { id: 'user2', username: 'Sarah Mohammed', itemCount: 7, urgent: true },
    { id: 'user3', username: 'Khalid Hassan', itemCount: 2, urgent: false }
  ];

  cardComponent.populateCards(sampleData);
}

// Example 2: Custom Configuration
function customConfiguration() {
  const container = document.getElementById('cardContainer');
  
  const cardComponent = new CardComponent(container, {
    cardHeight: '140px',
    iconSize: '36px',
    gap: '16px',
    padding: '0 24px',
    onCardClick: (userId, event) => {
      // Custom card click handler
      showToast(`Opening details for ${userId}`);
    },
    onWhatsAppClick: (userId, event) => {
      // Open WhatsApp with actual phone number
      const phoneNumber = getUserPhoneNumber(userId);
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    },
    onNavigationClick: (userId, event) => {
      // Open navigation with actual coordinates
      const coordinates = getUserCoordinates(userId);
      window.open(`https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}`, '_blank');
    }
  });

  // Set responsive styles
  cardComponent.setResponsiveStyles();
}

// Example 3: Dynamic Card Management
function dynamicCardManagement() {
  const container = document.getElementById('cardContainer');
  const cardComponent = new CardComponent(container);

  // Add cards dynamically
  cardComponent.addCard({
    id: 'user1',
    username: 'Ahmed Ali',
    itemCount: 3,
    urgent: false
  });

  // Update a card
  setTimeout(() => {
    cardComponent.updateCard('user1', {
      itemCount: 5,
      urgent: true
    });
  }, 2000);

  // Remove a card
  setTimeout(() => {
    cardComponent.removeCard('user1');
  }, 4000);

  // Clear all cards
  setTimeout(() => {
    cardComponent.clearCards();
  }, 6000);
}

// Example 4: Integration with API
async function apiIntegration() {
  const container = document.getElementById('cardContainer');
  const cardComponent = new CardComponent(container, {
    onCardClick: async (userId, event) => {
      try {
        const userDetails = await fetchUserDetails(userId);
        showUserDetailsModal(userDetails);
      } catch (error) {
        showToast('Error loading user details');
      }
    },
    onWhatsAppClick: async (userId, event) => {
      try {
        const phoneNumber = await getUserPhoneNumber(userId);
        window.open(`https://wa.me/${phoneNumber}`, '_blank');
      } catch (error) {
        showToast('Error opening WhatsApp');
      }
    },
    onNavigationClick: async (userId, event) => {
      try {
        const location = await getUserLocation(userId);
        window.open(`https://maps.google.com/maps?q=${location.lat},${location.lng}`, '_blank');
      } catch (error) {
        showToast('Error opening navigation');
      }
    }
  });

  // Load data from API
  try {
    const users = await fetchUsersFromAPI();
    cardComponent.populateCards(users);
  } catch (error) {
    showToast('Error loading users');
  }
}

// Example 5: Real-time Updates
function realTimeUpdates() {
  const container = document.getElementById('cardContainer');
  const cardComponent = new CardComponent(container);

  // Connect to WebSocket for real-time updates
  const ws = new WebSocket('ws://localhost:8080');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'USER_ADDED':
        cardComponent.addCard(data.user);
        break;
      case 'USER_UPDATED':
        cardComponent.updateCard(data.user.id, data.user);
        break;
      case 'USER_REMOVED':
        cardComponent.removeCard(data.userId);
        break;
      case 'USERS_REFRESHED':
        cardComponent.populateCards(data.users);
        break;
    }
  };
}

// Example 6: Filtering and Searching
function filteringAndSearching() {
  const container = document.getElementById('cardContainer');
  const cardComponent = new CardComponent(container);

  // Initial data
  const allUsers = [
    { id: 'user1', username: 'Ahmed Ali', itemCount: 3, urgent: false, category: 'pickup' },
    { id: 'user2', username: 'Sarah Mohammed', itemCount: 7, urgent: true, category: 'delivery' },
    { id: 'user3', username: 'Khalid Hassan', itemCount: 2, urgent: false, category: 'pickup' },
    { id: 'user4', username: 'Fatima Al-Zahra', itemCount: 5, urgent: false, category: 'delivery' }
  ];

  cardComponent.populateCards(allUsers);

  // Filter by category
  function filterByCategory(category) {
    const filteredUsers = allUsers.filter(user => user.category === category);
    cardComponent.populateCards(filteredUsers);
  }

  // Search by username
  function searchByUsername(searchTerm) {
    const filteredUsers = allUsers.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    cardComponent.populateCards(filteredUsers);
  }

  // Filter by urgent status
  function filterByUrgent(urgent) {
    const filteredUsers = allUsers.filter(user => user.urgent === urgent);
    cardComponent.populateCards(filteredUsers);
  }

  // Example usage:
  // filterByCategory('pickup');
  // searchByUsername('Ahmed');
  // filterByUrgent(true);
}

// Helper functions (these would be implemented based on your actual API)
async function fetchUserDetails(userId) {
  // Simulate API call
  return { id: userId, name: 'User Name', phone: '+1234567890' };
}

async function getUserPhoneNumber(userId) {
  // Simulate API call
  return '+1234567890';
}

async function getUserLocation(userId) {
  // Simulate API call
  return { lat: 26.0667, lng: 50.5577 };
}

async function fetchUsersFromAPI() {
  // Simulate API call
  return [
    { id: 'user1', username: 'Ahmed Ali', itemCount: 3, urgent: false },
    { id: 'user2', username: 'Sarah Mohammed', itemCount: 7, urgent: true }
  ];
}

function showUserDetailsModal(userDetails) {
  // Show modal with user details
  console.log('User details:', userDetails);
}

// Export examples for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    basicUsage,
    customConfiguration,
    dynamicCardManagement,
    apiIntegration,
    realTimeUpdates,
    filteringAndSearching
  };
}
