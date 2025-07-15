/**
 * CardComponent - A reusable card component for displaying user information
 * with WhatsApp and navigation functionality
 */

class CardComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      cardHeight: '120px',
      iconSize: '32px',
      gap: '12px',
      padding: '0 20px',
      onCardClick: null,
      onWhatsAppClick: null,
      onNavigationClick: null,
      ...options
    };
    this.cards = [];
    this.init();
  }

  init() {
    this.setupGrid();
    this.attachEventListeners();
  }

  setupGrid() {
    if (!this.container) return;
    
    this.container.className = 'card-grid-container';
    this.container.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, 160px);
      gap: ${this.options.gap};
      justify-content: center;
      margin-bottom: 30px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 16px;
    `;
  }

  createCard(userData) {
    const card = document.createElement('div');
    card.className = `card-item ${userData.urgent ? 'urgent' : ''} ${userData.isCompleted ? 'completed' : ''}`;
    card.dataset.userId = userData.id;
    
    // Determine background color based on status
    let backgroundColor;
    let boxShadowColor;
    
    if (userData.isCompleted) {
      // Blue background for completed orders (picked up or all removed)
      backgroundColor = 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)';
      boxShadowColor = 'rgba(0, 123, 255, 0.3)';
    } else if (userData.urgent) {
      // Red background for urgent orders
      backgroundColor = 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)';
      boxShadowColor = 'rgba(255, 71, 87, 0.3)';
    } else {
      // Purple background for normal orders
      backgroundColor = 'linear-gradient(135deg, #7a64d4 0%, #5843b2 100%)';
      boxShadowColor = 'rgba(122, 100, 212, 0.3)';
    }
    
    card.style.cssText = `
      background: ${backgroundColor};
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 4px 20px ${boxShadowColor};
      border: none;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      color: #ffffff;
      width: 160px;
      height: 120px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    `;

    card.innerHTML = this.createCardContent(userData);
    
    // Add hover effects
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
      if (userData.isCompleted) {
        card.style.boxShadow = '0 8px 30px rgba(0, 123, 255, 0.4)';
      } else if (userData.urgent) {
        card.style.boxShadow = '0 8px 30px rgba(255, 71, 87, 0.4)';
      } else {
        card.style.boxShadow = '0 8px 30px rgba(122, 100, 212, 0.4)';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      if (userData.isCompleted) {
        card.style.boxShadow = '0 4px 20px rgba(0, 123, 255, 0.3)';
      } else if (userData.urgent) {
        card.style.boxShadow = '0 4px 20px rgba(255, 71, 87, 0.3)';
      } else {
        card.style.boxShadow = '0 4px 20px rgba(122, 100, 212, 0.3)';
      }
    });

    card.addEventListener('mousedown', () => {
      card.style.transform = 'translateY(-2px)';
    });

    card.addEventListener('mouseup', () => {
      card.style.transform = 'translateY(-4px)';
    });

    return card;
  }

  createCardContent(userData) {
    return `
      <div class="card-content" style="
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        justify-content: space-between;
        box-sizing: border-box;
      ">
        <div class="card-top" style="
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          margin-bottom: 8px;
        ">
          <div class="card-username" style="
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
            line-height: 1.2;
            max-width: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex-shrink: 1;
          ">${userData.username}</div>
          <div class="card-items" style="
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            line-height: 1;
            min-width: 35px;
            text-align: center;
            flex-shrink: 0;
          ">${userData.itemCount}</div>
        </div>
        <div class="card-bottom" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-top: auto;
        ">
          <div class="card-icon whatsapp-icon" data-action="whatsapp" style="
            width: ${this.options.iconSize};
            height: ${this.options.iconSize};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 16px;
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            flex-shrink: 0;
          ">💬</div>
          <div class="card-icon navigation-icon" data-action="navigation" style="
            width: ${this.options.iconSize};
            height: ${this.options.iconSize};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 16px;
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            flex-shrink: 0;
          ">🧭</div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    if (!this.container) return;

    this.container.addEventListener('click', (e) => {
      const card = e.target.closest('.card-item');
      if (!card) return;

      const userId = card.dataset.userId;
      const action = e.target.dataset.action;

      if (action === 'whatsapp') {
        e.stopPropagation();
        this.handleWhatsAppClick(userId, e);
      } else if (action === 'navigation') {
        e.stopPropagation();
        this.handleNavigationClick(userId, e);
      } else {
        this.handleCardClick(userId, e);
      }
    });

    // Add icon hover effects
    this.container.addEventListener('mouseenter', (e) => {
      if (e.target.classList.contains('card-icon')) {
        e.target.style.background = 'rgba(255, 255, 255, 0.3)';
        e.target.style.transform = 'scale(1.1)';
      }
    }, true);

    this.container.addEventListener('mouseleave', (e) => {
      if (e.target.classList.contains('card-icon')) {
        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
        e.target.style.transform = 'scale(1)';
      }
    }, true);

    this.container.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('card-icon')) {
        e.target.style.transform = 'scale(0.95)';
      }
    }, true);

    this.container.addEventListener('mouseup', (e) => {
      if (e.target.classList.contains('card-icon')) {
        e.target.style.transform = 'scale(1.1)';
      }
    }, true);
  }

  handleCardClick(userId, event) {
    if (this.options.onCardClick) {
      this.options.onCardClick(userId, event);
    }
  }

  handleWhatsAppClick(userId, event) {
    if (this.options.onWhatsAppClick) {
      this.options.onWhatsAppClick(userId, event);
    }
  }

  handleNavigationClick(userId, event) {
    if (this.options.onNavigationClick) {
      this.options.onNavigationClick(userId, event);
    }
  }

  addCard(userData) {
    if (!this.container) return;
    
    const card = this.createCard(userData);
    this.container.appendChild(card);
    this.cards.push({ element: card, data: userData });
    return card;
  }

  removeCard(userId) {
    const cardIndex = this.cards.findIndex(card => card.data.id === userId);
    if (cardIndex !== -1) {
      const card = this.cards[cardIndex];
      card.element.remove();
      this.cards.splice(cardIndex, 1);
    }
  }

  updateCard(userId, newData) {
    const cardIndex = this.cards.findIndex(card => card.data.id === userId);
    if (cardIndex !== -1) {
      const card = this.cards[cardIndex];
      const updatedData = { ...card.data, ...newData };
      card.element.outerHTML = this.createCard(updatedData).outerHTML;
      card.data = updatedData;
    }
  }

  clearCards() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    this.cards = [];
  }

  populateCards(dataArray) {
    this.clearCards();
    dataArray.forEach(userData => this.addCard(userData));
  }

  getCardData(userId) {
    const card = this.cards.find(card => card.data.id === userId);
    return card ? card.data : null;
  }

  getAllCards() {
    return this.cards.map(card => card.data);
  }

  setResponsiveStyles() {
    // Add responsive styles
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 320px) {
        .card-grid-container {
          grid-template-columns: repeat(2, 140px) !important;
          gap: 10px !important;
          padding: 0 12px !important;
        }
        
        .card-item {
          width: 140px !important;
          height: 100px !important;
          padding: 12px !important;
        }
        
        .card-username {
          font-size: 12px !important;
        }
        
        .card-items {
          font-size: 24px !important;
        }
        
        .card-icon {
          width: 28px !important;
          height: 28px !important;
          font-size: 14px !important;
        }
      }

      @media (min-width: 321px) and (max-width: 375px) {
        .card-grid-container {
          grid-template-columns: repeat(2, 150px) !important;
          gap: 12px !important;
          padding: 0 14px !important;
        }
        
        .card-item {
          width: 150px !important;
          height: 110px !important;
        }
      }

      @media (min-width: 376px) {
        .card-grid-container {
          grid-template-columns: repeat(2, 160px) !important;
          gap: 12px !important;
          padding: 0 16px !important;
        }
        
        .card-item {
          width: 160px !important;
          height: 120px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
      this.container.className = '';
      this.container.style.cssText = '';
    }
    this.cards = [];
  }
}

// Export for use in other files
export default CardComponent;

// Also make it available globally for direct script inclusion
if (typeof window !== 'undefined') {
  window.CardComponent = CardComponent;
}
