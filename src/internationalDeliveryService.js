// International Delivery service for handling orders with Seller Country = BH and Customer Country != BH
import { fetchOrders } from './fetchOrders.js';
import { getCountryFlag } from './dataProcessor.js';
import { OrderGroupingService } from './orderGroupingComponent.js';

export class InternationalDeliveryService {
  static async loadInternationalDeliveryOrders() {
    try {
      const result = await fetchOrders();
      
      if (!result || !result.data || !Array.isArray(result.data)) {
        return [];
      }
      
      // Filter orders by Seller Country = BH AND Customer Country != BH
      const internationalDeliveryOrders = result.data.filter(order => 
        order.SellerCountry === 'BH' && order.CustomerCountry !== 'BH'
      );
      
      return internationalDeliveryOrders;
    } catch (error) {
      console.error('Error loading International Delivery orders:', error);
      return [];
    }
  }

  static displayInternationalDeliveryOrders(orders) {
    const container = document.getElementById('internationalDelivery');
    
    if (!container) return;
    
    // Clear existing content except the header
    const header = container.querySelector('h3');
    container.innerHTML = '';
    container.appendChild(header);
    
    if (orders.length === 0) {
      const noOrdersMsg = document.createElement('p');
      noOrdersMsg.textContent = 'No international orders found from BH sellers.';
      noOrdersMsg.style.color = '#888';
      container.appendChild(noOrdersMsg);
      return;
    }

    // Process orders using the grouping service
    const processedData = OrderGroupingService.processInternationalDeliveryOrders(orders);
    
    // Add order count
    const countDiv = document.createElement('div');
    countDiv.style.marginBottom = '20px';
    countDiv.style.fontSize = '18px';
    countDiv.style.fontWeight = 'bold';
    countDiv.style.color = '#4CAF50';
    countDiv.textContent = `Found ${processedData.totalOrders} international orders for ${processedData.stats.totalGroups} customers (from BH sellers)`;
    container.appendChild(countDiv);

    // Generate the customer group list
    const listHtml = this.generateInternationalCustomerGroupList(processedData);
    container.innerHTML += listHtml;

    // Add the toggle function globally
    window.toggleInternationalCustomerDropdown = this.toggleInternationalCustomerDropdown;
  }

  static generateInternationalCustomerGroupList(processedData) {
    const { groupedOrders } = processedData;
    
    const listItems = groupedOrders.map(([customer, orders]) => {
      const totalItems = orders.length;
      const sellersGrouped = OrderGroupingService.groupBySeller(orders);
      const sellerSections = Object.entries(sellersGrouped).map(([seller, sellerOrders]) => {
        const sellerItems = sellerOrders.map(order => `
          <div class="order-item">
            <span class="order-id">#${order.OrderID || 'N/A'}</span>
            <span class="item-name">${order.Item || 'N/A'}</span>
            <span class="item-details">Total: ${order.Total || 0} ${order.CurrencyCode || ''} | Status: ${order.ShippingStatus || 'N/A'}</span>
          </div>
        `).join('');
        
        return `
          <div class="seller-section">
            <h5>${getCountryFlag(sellerOrders[0].SellerCountry)} ${seller}</h5>
            <div class="seller-orders">
              ${sellerItems}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="customer-group">
          <div class="customer-header" onclick="toggleInternationalCustomerDropdown('${customer.replace(/'/g, "\\'")}')">
            <span class="customer-name">${getCountryFlag(orders[0].CustomerCountry)} ${customer}</span>
            <span class="item-count">${totalItems} items</span>
            <span class="dropdown-arrow" id="arrow-international-customer-${customer.replace(/'/g, "\\'")}">▼</span>
          </div>
          <div class="customer-dropdown" id="dropdown-international-customer-${customer.replace(/'/g, "\\'")}" style="display: none;">
            ${sellerSections}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="international-customer-list">
        ${listItems}
      </div>
      <style>
        .international-customer-list {
          margin-top: 20px;
        }
        
        .customer-group {
          margin-bottom: 15px;
          border: 1px solid #444;
          border-radius: 8px;
          background: #2a2a2a;
        }
        
        .customer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .customer-header:hover {
          background: #333;
        }
        
        .customer-name {
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
        
        .customer-dropdown {
          border-top: 1px solid #444;
          padding: 15px;
          background: #232323;
        }
        
        .seller-section {
          margin-bottom: 15px;
          padding: 10px;
          background: #2a2a2a;
          border-radius: 6px;
        }
        
        .seller-section h5 {
          margin: 0 0 10px 0;
          color: #f4f4f4;
          font-size: 14px;
        }
        
        .seller-orders {
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

  static toggleInternationalCustomerDropdown(customer) {
    const dropdown = document.getElementById('dropdown-international-customer-' + customer);
    const arrow = document.getElementById('arrow-international-customer-' + customer);
    
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

  static async initializeInternationalDelivery() {
    const orders = await this.loadInternationalDeliveryOrders();
    this.displayInternationalDeliveryOrders(orders);
  }
}

// Refresh function for manual updates
window.refreshInternationalDelivery = () => {
  InternationalDeliveryService.initializeInternationalDelivery();
};
