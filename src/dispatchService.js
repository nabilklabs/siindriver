// Dispatch logic for handling order data
import { fetchOrders } from './fetchOrders.js';
import { getCountryFlag } from './dataProcessor.js';
import { OrderGroupingService } from './orderGroupingComponent.js';

export class DispatchService {
  static async loadBHPickUpOrders() {
    try {
      const result = await fetchOrders();
      
      if (!result || !result.data || !Array.isArray(result.data)) {
        return [];
      }
      
      // Filter orders by Seller Country = BH
      const bhPickUpOrders = result.data.filter(order => order.SellerCountry === 'BH');
      
      return bhPickUpOrders;
    } catch (error) {
      console.error('Error loading BH PickUp orders:', error);
      return [];
    }
  }

  static displayBHPickUpOrders(orders) {
    const container = document.getElementById('bhPickUp');
    
    if (!container) return;
    
    // Clear existing content except the header
    const header = container.querySelector('h3');
    container.innerHTML = '';
    container.appendChild(header);
    
    if (orders.length === 0) {
      const noOrdersMsg = document.createElement('p');
      noOrdersMsg.textContent = 'No orders found for BH sellers.';
      noOrdersMsg.style.color = '#888';
      container.appendChild(noOrdersMsg);
      return;
    }

    // Process orders using the grouping service
    const processedData = OrderGroupingService.processBHPickupOrders(orders);
    
    // Add order count
    const countDiv = document.createElement('div');
    countDiv.style.marginBottom = '20px';
    countDiv.style.fontSize = '18px';
    countDiv.style.fontWeight = 'bold';
    countDiv.style.color = '#4CAF50';
    countDiv.textContent = `Found ${processedData.totalOrders} orders from ${processedData.stats.totalGroups} Bahraini sellers`;
    container.appendChild(countDiv);

    // Generate the seller group list
    const listHtml = this.generateSellerGroupList(processedData);
    container.innerHTML += listHtml;

    // Add the toggle function globally
    window.toggleSellerDropdown = this.toggleSellerDropdown;
  }

  static generateSellerGroupList(processedData) {
    const { groupedOrders } = processedData;
    
    const listItems = groupedOrders.map(([seller, orders]) => {
      const totalItems = orders.length;
      const customersGrouped = OrderGroupingService.groupByCustomer(orders);
      const customerSections = Object.entries(customersGrouped).map(([customer, customerOrders]) => {
        const customerItems = customerOrders.map(order => `
          <div class="order-item">
            <span class="order-id">#${order.OrderID || 'N/A'}</span>
            <span class="item-name">${order.Item || 'N/A'}</span>
            <span class="item-details">Total: ${order.Total || 0} ${order.CurrencyCode || ''} | Status: ${order.ShippingStatus || 'N/A'}</span>
          </div>
        `).join('');
        
        return `
          <div class="customer-section">
            <h5>${getCountryFlag(customerOrders[0].CustomerCountry)} ${customer}</h5>
            <div class="customer-orders">
              ${customerItems}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="seller-group">
          <div class="seller-header" onclick="toggleSellerDropdown('${seller.replace(/'/g, "\\'")}')">
            <span class="seller-name">${getCountryFlag(orders[0].SellerCountry)} ${seller}</span>
            <span class="item-count">${totalItems} items</span>
            <span class="dropdown-arrow" id="arrow-${seller.replace(/'/g, "\\'")}">▼</span>
          </div>
          <div class="seller-dropdown" id="dropdown-${seller.replace(/'/g, "\\'")}" style="display: none;">
            ${customerSections}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="seller-list">
        ${listItems}
      </div>
      <style>
        .seller-list {
          margin-top: 20px;
        }
        
        .seller-group {
          margin-bottom: 15px;
          border: 1px solid #444;
          border-radius: 8px;
          background: #2a2a2a;
        }
        
        .seller-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .seller-header:hover {
          background: #333;
        }
        
        .seller-name {
          font-size: 16px;
          font-weight: bold;
          color: #ffcc00;
        }
        
        .item-count {
          background: #ffcc00;
          color: #181818;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .dropdown-arrow {
          font-size: 12px;
          transition: transform 0.3s;
        }
        
        .dropdown-arrow.rotated {
          transform: rotate(180deg);
        }
        
        .seller-dropdown {
          border-top: 1px solid #444;
          padding: 15px;
          background: #232323;
        }
        
        .customer-section {
          margin-bottom: 15px;
          padding: 10px;
          background: #2a2a2a;
          border-radius: 6px;
        }
        
        .customer-section h5 {
          margin: 0 0 10px 0;
          color: #f4f4f4;
          font-size: 14px;
        }
        
        .customer-orders {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: #333;
          border-radius: 4px;
          font-size: 13px;
        }
        
        .order-id {
          font-weight: bold;
          color: #ffcc00;
          min-width: 80px;
        }
        
        .item-name {
          flex: 1;
          margin: 0 10px;
          color: #f4f4f4;
        }
        
        .item-details {
          color: #ccc;
          font-size: 11px;
        }
      </style>
    `;
  }

  static toggleSellerDropdown(seller) {
    const dropdown = document.getElementById('dropdown-' + seller);
    const arrow = document.getElementById('arrow-' + seller);
    
    if (dropdown && arrow) {
      if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
        arrow.classList.add('rotated');
      } else {
        dropdown.style.display = 'none';
        arrow.classList.remove('rotated');
      }
    }
  }

  static async initializeBHPickUp() {
    const orders = await this.loadBHPickUpOrders();
    this.displayBHPickUpOrders(orders);
  }
}

// Refresh function for manual updates
window.refreshBHPickUp = () => {
  DispatchService.initializeBHPickUp();
};
