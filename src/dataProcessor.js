// Data processing logic for orders
export function processOrders(orders) {
  // Return all orders without any filtering
  return {
    localPickUp: orders,
    total: orders.length
  };
}

// Get country flag emoji
export function getCountryFlag(countryCode) {
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

// Format customer info with flag
export function formatCustomerInfo(order) {
  const flag = getCountryFlag(order.CustomerCountry);
  return `
    <strong>Name:</strong> ${order.Customer || ''}<br>
    <strong>Number:</strong> ${order.CustomerNumber || ''}<br>
    <strong>Country:</strong> ${flag} ${order.CustomerCountry || ''}<br>
    <strong>Lat:</strong> ${order.CustomerLatitude || ''}<br>
    <strong>Lng:</strong> ${order.CustomerLongitude || ''}
  `;
}

// Format seller info with flag
export function formatSellerInfo(order) {
  const flag = getCountryFlag(order.SellerCountry);
  return `
    <strong>Name:</strong> ${order.Seller || ''}<br>
    <strong>Number:</strong> ${order.SellerNumber || ''}<br>
    <strong>Country:</strong> ${flag} ${order.SellerCountry || ''}<br>
    <strong>Lat:</strong> ${order.SellerLatitude || ''}<br>
    <strong>Lng:</strong> ${order.SellerLongitude || ''}
  `;
}
