import { fetchOrders } from './fetchOrders.js';

let map;

function addMarker(lat, lng, popupText) {
  if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
    L.marker([lng, lat]).addTo(map).bindPopup(popupText);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  map = L.map('map').setView([26.2, 50.6], 8); // Centered on Bahrain
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  try {
    const result = await fetchOrders();
    if (result && result.data && Array.isArray(result.data)) {
      result.data.forEach(order => {
        // Customer marker
        addMarker(order.CustomerLatitude, order.CustomerLongitude, `Customer: ${order.Customer || ''}<br>Order: ${order.DbID || ''}`);
        // Seller marker
        addMarker(order.SellerLatitude, order.SellerLongitude, `Seller: ${order.Seller || ''}<br>Order: ${order.DbID || ''}`);
      });
    }
  } catch (e) {
    // Optionally show error on map
    L.popup().setLatLng(map.getCenter()).setContent('Failed to load orders.').openOn(map);
  }
});
