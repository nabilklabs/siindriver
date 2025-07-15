import { fetchOrders } from './fetchOrders.js';
import { processOrders } from './dataProcessor.js';
import { createTable } from './displayLogic.js';

const container = document.getElementById('orders-table-container');

fetchOrders()
  .then(result => {
    if (!result || !result.data || !Array.isArray(result.data)) {
      container.innerHTML = '<p>No orders found.</p>';
      return;
    }
    
    const processedData = processOrders(result.data);
    
    container.innerHTML = '';

    // Show total count at the top
    const totalCount = document.createElement('div');
    totalCount.style.margin = '16px 0';
    totalCount.style.fontWeight = 'bold';
    totalCount.style.fontSize = '18px';
    totalCount.textContent = `Total Orders: ${processedData.total}`;
    container.appendChild(totalCount);

    // Create single table with all orders
    container.appendChild(createTable('All Orders', processedData.localPickUp));
  })
  .catch(error => {
    container.innerHTML = '<p style="color:red;">Failed to load orders.</p>';
    console.error('Error fetching orders:', error);
  });
