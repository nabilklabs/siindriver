import { fetchOrders } from './fetchOrders.js';

const container = document.getElementById('orders-table-container');

fetchOrders()
  .then(result => {
    if (!result || !result.data || !Array.isArray(result.data)) {
      container.innerHTML = '<p>No orders found.</p>';
      return;
    }
    // Only keep orders where SellerCountry is BH
    const orders = result.data.filter(o => o.SellerCountry === 'BH');
    if (orders.length === 0) {
      container.innerHTML = '<p>No orders found.</p>';
      return;
    }
    container.innerHTML = '';

    // Helper to create a table for a set of orders
    function createTable(title, ordersArr, groupBy) {
      const section = document.createElement('section');
      section.style.marginBottom = '40px';
      const heading = document.createElement('h2');
      heading.textContent = `${title} (Count: ${ordersArr.length})`;
      section.appendChild(heading);
      if (ordersArr.length === 0) {
        section.appendChild(document.createTextNode('No orders.'));
        return section;
      }
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      let headerRow = '';
      if (groupBy === 'seller') {
        headerRow = `
          <tr>
            <th>Seller Info</th>
            <th>Number of Items</th>
            <th>Orders (Customers)</th>
          </tr>
        `;
      } else if (groupBy === 'customer') {
        headerRow = `
          <tr>
            <th>Customer Info</th>
            <th>Number of Items</th>
            <th>Orders (Sellers)</th>
          </tr>
        `;
      } else {
        headerRow = `
          <tr>
            <th>DbID</th>
            <th>Customer Info</th>
            <th>Seller Info</th>
            <th>Item</th>
            <th>Currency Code</th>
            <th>Total</th>
            <th>Delivery Fee</th>
            <th>Payment Method</th>
            <th>Paid</th>
            <th>Shipping Status</th>
            <th>Created At</th>
          </tr>
        `;
      }
      thead.innerHTML = headerRow;
      table.appendChild(thead);
      const tbody = document.createElement('tbody');

      if (groupBy === 'seller') {
        // Group by seller name
        const sellers = {};
        ordersArr.forEach(order => {
          if (!sellers[order.Seller]) sellers[order.Seller] = [];
          sellers[order.Seller].push(order);
        });
        Object.entries(sellers).forEach(([seller, orders]) => {
          const row = document.createElement('tr');
          const sellerInfo = `
            <strong>Name:</strong> ${orders[0].Seller || ''}<br>
            <strong>Number:</strong> ${orders[0].SellerNumber || ''}<br>
            <strong>Country:</strong> ${orders[0].SellerCountry || ''}<br>
            <strong>Lat:</strong> ${orders[0].SellerLatitude || ''}<br>
            <strong>Lng:</strong> ${orders[0].SellerLongitude || ''}
          `;
          const numItems = orders.length;
          const ordersList = orders.map(order => `
            <div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #333;">
              <strong>Customer:</strong> ${order.Customer || ''} (${order.CustomerNumber || ''})<br>
              <strong>Order ID:</strong> ${order.DbID || ''}<br>
              <strong>Item:</strong> ${order.Item || ''}<br>
              <strong>Total:</strong> ${order.Total || ''} ${order.CurrencyCode || ''}<br>
              <strong>Created At:</strong> ${order.CreatedAt || ''}
            </div>
          `).join('');
          row.innerHTML = `
            <td>${sellerInfo}</td>
            <td style="text-align:center;">${numItems}</td>
            <td>${ordersList}</td>
          `;
          tbody.appendChild(row);
        });
      } else if (groupBy === 'customer') {
        // Group by customer name
        const customers = {};
        ordersArr.forEach(order => {
          if (!customers[order.Customer]) customers[order.Customer] = [];
          customers[order.Customer].push(order);
        });
        Object.entries(customers).forEach(([customer, orders]) => {
          const row = document.createElement('tr');
          const customerInfo = `
            <strong>Name:</strong> ${orders[0].Customer || ''}<br>
            <strong>Number:</strong> ${orders[0].CustomerNumber || ''}<br>
            <strong>Country:</strong> ${orders[0].CustomerCountry || ''}<br>
            <strong>Lat:</strong> ${orders[0].CustomerLatitude || ''}<br>
            <strong>Lng:</strong> ${orders[0].CustomerLongitude || ''}
          `;
          const numItems = orders.length;
          const ordersList = orders.map(order => `
            <div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #333;">
              <strong>Seller:</strong> ${order.Seller || ''} (${order.SellerNumber || ''})<br>
              <strong>Order ID:</strong> ${order.DbID || ''}<br>
              <strong>Item:</strong> ${order.Item || ''}<br>
              <strong>Total:</strong> ${order.Total || ''} ${order.CurrencyCode || ''}<br>
              <strong>Created At:</strong> ${order.CreatedAt || ''}
            </div>
          `).join('');
          row.innerHTML = `
            <td>${customerInfo}</td>
            <td style="text-align:center;">${numItems}</td>
            <td>${ordersList}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        ordersArr.forEach(order => {
          const row = document.createElement('tr');
          const customerInfo = `
            <strong>Name:</strong> ${order.Customer || ''}<br>
            <strong>Number:</strong> ${order.CustomerNumber || ''}<br>
            <strong>Country:</strong> ${order.CustomerCountry || ''}<br>
            <strong>Lat:</strong> ${order.CustomerLatitude || ''}<br>
            <strong>Lng:</strong> ${order.CustomerLongitude || ''}
          `;
          const sellerInfo = `
            <strong>Name:</strong> ${order.Seller || ''}<br>
            <strong>Number:</strong> ${order.SellerNumber || ''}<br>
            <strong>Country:</strong> ${order.SellerCountry || ''}<br>
            <strong>Lat:</strong> ${order.SellerLatitude || ''}<br>
            <strong>Lng:</strong> ${order.SellerLongitude || ''}
          `;
          row.innerHTML = `
            <td>${order.DbID || ''}</td>
            <td>${customerInfo}</td>
            <td>${sellerInfo}</td>
            <td>${order.Item || ''}</td>
            <td>${order.CurrencyCode || ''}</td>
            <td>${order.Total || ''}</td>
            <td>${order.DeliveryFee || ''}</td>
            <td>${order.method || ''}</td>
            <td>${order.Paid || ''}</td>
            <td>${order.ShippingStatus || ''}</td>
            <td>${order.CreatedAt || ''}</td>
          `;
          tbody.appendChild(row);
        });
      }
      table.appendChild(tbody);
      section.appendChild(table);
      return section;
    }

    // Split orders
    const customerBH = orders.filter(o => o.CustomerCountry === 'BH');
    const customerNotBH = orders.filter(o => o.CustomerCountry !== 'BH');
    const sellerBH = orders; // all orders now have SellerCountry === 'BH'

    container.appendChild(createTable('Local PickUp', sellerBH, 'seller'));
    container.appendChild(createTable('Deliver to Siin', customerNotBH, 'customer'));
    container.appendChild(createTable('Local Delivery', customerBH, 'customer'));
  })
  .catch(error => {
    container.innerHTML = '<p style="color:red;">Failed to load orders.</p>';
    console.error('Error fetching orders:', error);
  });
