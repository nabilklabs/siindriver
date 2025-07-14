// Simple reusable navbar component
const navbar = document.createElement('nav');
navbar.style.background = '#232323';
navbar.style.padding = '16px 0';
navbar.style.display = 'flex';
navbar.style.justifyContent = 'center';
navbar.style.gap = '32px';
navbar.innerHTML = `
  <a href="index.html" style="color:#ffcc00;text-decoration:none;font-weight:bold;">Home</a>
  <a href="orders.html" style="color:#ffcc00;text-decoration:none;font-weight:bold;">Orders</a>
  <a href="map.html" style="color:#ffcc00;text-decoration:none;font-weight:bold;">Map</a>
`;

const navbarMount = document.getElementById('navbar');
if (navbarMount) {
  navbarMount.appendChild(navbar);
}
