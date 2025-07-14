// Fetches all data from the SIINSHOP 24-hour order API and returns a promise with the data
export async function fetchOrders() {
  const response = await fetch('https://api.test.siin.shop/v3/orders/public/get-24-hour-order?key=SIINSHOP');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
