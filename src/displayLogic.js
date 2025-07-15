// Display logic for orders tables
import { formatCustomerInfo, formatSellerInfo } from './dataProcessor.js';

export function createTable(title, ordersArr) {
  const section = document.createElement('section');
  section.style.marginBottom = '40px';
  const heading = document.createElement('h2');
  heading.textContent = `${title} (Count: ${ordersArr.length})`;
  section.appendChild(heading);
  
  if (ordersArr.length === 0) {
    section.appendChild(document.createTextNode('No orders.'));
    return section;
  }

  // Add control buttons
  const controls = document.createElement('div');
  controls.style.marginBottom = '16px';
  controls.style.display = 'flex';
  controls.style.gap = '12px';
  controls.style.flexWrap = 'wrap';

  // Copy to clipboard button
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy Table to Clipboard';
  copyButton.style.padding = '8px 16px';
  copyButton.style.backgroundColor = '#4CAF50';
  copyButton.style.color = 'white';
  copyButton.style.border = 'none';
  copyButton.style.borderRadius = '4px';
  copyButton.style.cursor = 'pointer';
  controls.appendChild(copyButton);

  // Column visibility toggles
  const columnsToShow = [
    'DbID', 'OrderID', 'Customer', 'CustomerNumber', 'CustomerCountry', 
    'CustomerLatitude', 'CustomerLongitude', 'CustomerAddress', 'Seller', 
    'SellerNumber', 'SellerCountry', 'SellerLatitude', 'SellerLongitude', 
    'SellerAddress', 'Item', 'CurrencyCode', 'Subtotal', 'Total', 
    'DeliveryFee', 'method', 'Paid', 'ShippingStatus', 'CreatedAt'
  ];

  const hiddenColumns = new Set();
  
  columnsToShow.forEach((column, index) => {
    const toggleButton = document.createElement('button');
    toggleButton.textContent = column;
    toggleButton.style.padding = '4px 8px';
    toggleButton.style.backgroundColor = '#2196F3';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '4px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontSize = '12px';
    toggleButton.onclick = () => toggleColumn(index, column, toggleButton);
    controls.appendChild(toggleButton);
  });

  section.appendChild(controls);
  
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  
  // Display all headers from the API
  thead.innerHTML = `
    <tr>
      <th data-column="0">DbID</th>
      <th data-column="1">OrderID</th>
      <th data-column="2">Customer</th>
      <th data-column="3">Customer Number</th>
      <th data-column="4">Customer Country</th>
      <th data-column="5">Customer Latitude</th>
      <th data-column="6">Customer Longitude</th>
      <th data-column="7">Customer Address</th>
      <th data-column="8">Seller</th>
      <th data-column="9">Seller Number</th>
      <th data-column="10">Seller Country</th>
      <th data-column="11">Seller Latitude</th>
      <th data-column="12">Seller Longitude</th>
      <th data-column="13">Seller Address</th>
      <th data-column="14">Item</th>
      <th data-column="15">Currency Code</th>
      <th data-column="16">Subtotal</th>
      <th data-column="17">Total</th>
      <th data-column="18">Delivery Fee</th>
      <th data-column="19">Payment Method</th>
      <th data-column="20">Paid</th>
      <th data-column="21">Shipping Status</th>
      <th data-column="22">Created At</th>
    </tr>
  `;
  
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  
  // Display each order as a separate row
  ordersArr.forEach(order => {
    const row = document.createElement('tr');
    const customerFlag = getCountryFlag(order.CustomerCountry);
    const sellerFlag = getCountryFlag(order.SellerCountry);
    
    row.innerHTML = `
      <td data-column="0">${order.DbID || ''}</td>
      <td data-column="1">${order.OrderID || ''}</td>
      <td data-column="2">${order.Customer || ''}</td>
      <td data-column="3">${order.CustomerNumber || ''}</td>
      <td data-column="4">${customerFlag} ${order.CustomerCountry || ''}</td>
      <td data-column="5">${order.CustomerLatitude || ''}</td>
      <td data-column="6">${order.CustomerLongitude || ''}</td>
      <td data-column="7">${order.CustomerAddress || ''}</td>
      <td data-column="8">${order.Seller || ''}</td>
      <td data-column="9">${order.SellerNumber || ''}</td>
      <td data-column="10">${sellerFlag} ${order.SellerCountry || ''}</td>
      <td data-column="11">${order.SellerLatitude || ''}</td>
      <td data-column="12">${order.SellerLongitude || ''}</td>
      <td data-column="13">${order.SellerAddress || ''}</td>
      <td data-column="14">${order.Item || ''}</td>
      <td data-column="15">${order.CurrencyCode || ''}</td>
      <td data-column="16">${order.Subtotal || ''}</td>
      <td data-column="17">${order.Total || ''}</td>
      <td data-column="18">${order.DeliveryFee || ''}</td>
      <td data-column="19">${order.method || ''}</td>
      <td data-column="20">${order.Paid || ''}</td>
      <td data-column="21">${order.ShippingStatus || ''}</td>
      <td data-column="22">${order.CreatedAt || ''}</td>
    `;
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  section.appendChild(table);

  // Column toggle functionality
  function toggleColumn(columnIndex, columnName, button) {
    const columnElements = table.querySelectorAll(`[data-column="${columnIndex}"]`);
    
    if (hiddenColumns.has(columnIndex)) {
      // Show column
      columnElements.forEach(el => el.style.display = '');
      hiddenColumns.delete(columnIndex);
      button.style.backgroundColor = '#2196F3';
      button.textContent = columnName;
    } else {
      // Hide column
      columnElements.forEach(el => el.style.display = 'none');
      hiddenColumns.add(columnIndex);
      button.style.backgroundColor = '#f44336';
      button.textContent = `${columnName} (Hidden)`;
    }
  }

  // Copy table to clipboard functionality
  copyButton.onclick = () => {
    const visibleHeaders = [];
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach((cell, index) => {
      if (!hiddenColumns.has(index)) {
        visibleHeaders.push(cell.textContent.trim());
      }
    });

    const rows = [visibleHeaders.join('\t')];
    
    const dataRows = table.querySelectorAll('tbody tr');
    dataRows.forEach(row => {
      const visibleCells = [];
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        if (!hiddenColumns.has(index)) {
          visibleCells.push(cell.textContent.trim());
        }
      });
      rows.push(visibleCells.join('\t'));
    });

    const tableText = rows.join('\n');
    
    navigator.clipboard.writeText(tableText).then(() => {
      copyButton.textContent = 'Copied!';
      copyButton.style.backgroundColor = '#4CAF50';
      setTimeout(() => {
        copyButton.textContent = 'Copy Table to Clipboard';
        copyButton.style.backgroundColor = '#2196F3';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      copyButton.textContent = 'Copy Failed';
      copyButton.style.backgroundColor = '#f44336';
      setTimeout(() => {
        copyButton.textContent = 'Copy Table to Clipboard';
        copyButton.style.backgroundColor = '#2196F3';
      }, 2000);
    });
  };

  return section;
}

// Get country flag emoji (moved from dataProcessor.js)
function getCountryFlag(countryCode) {
  const flags = {
    'BH': '🇧🇭',
    'SA': '🇸🇦',
    'AE': '🇦🇪',
    'KW': '🇰🇼',
    'OM': '🇴🇲',
    'QA': '🇶🇦',
    'US': '🇺🇸',
    'GB': '🇬🇧',
    'IN': '🇮🇳',
    'PK': '🇵🇰',
    'BD': '🇧🇩',
    'LK': '🇱🇰',
    'PH': '🇵🇭',
    'EG': '🇪🇬',
    'JO': '🇯🇴',
    'LB': '🇱🇧',
    'SY': '🇸🇾',
    'IQ': '🇮🇶',
    'IR': '🇮🇷',
    'TR': '🇹🇷'
  };
  return flags[countryCode] || '🏳️';
}
