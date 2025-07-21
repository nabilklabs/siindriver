// updateOrderStatus.js
// Handles updating order DeliveryStatus in the Siin backend

/**
 * Update the delivery status for a set of orders in the Siin backend.
 * @param {Array} orders - Array of order objects (must have DbID and DeliveryStatus)
 * @param {string} action - One of: 'Picked Up', 'Arrived at Siin', 'Delivered'
 * @returns {Promise<{success: boolean, count: number, error?: any}>}
 */
export async function updateOrderStatus(orders, action) {
    console.log(orders, action);
  let validOrders = [];
  let deliveryStatus = null;

  if (action === "Arrived at Siin") {
    // Only orders with DeliveryStatus 'Picked Up' and not 'Removed by Seller'
    validOrders = orders.filter(
      (order) => order.DeliveryStatus === "Picked Up" && order.DeliveryStatus !== "Removed by Seller"
    );
    deliveryStatus = "Arrived at Siin";
  } else if (action === "Picked Up") {
    validOrders = orders.filter(
      (order) => order.DeliveryStatus === "PENDING" || order.DeliveryStatus === "Pending"
    );
    deliveryStatus = "Picked Up";
  } else if (action === "Delivered") {
    // Only orders with DeliveryStatus 'Arrived at Siin' should be delivered
    validOrders = orders.filter(
      (order) => order.DeliveryStatus === "Arrived at Siin"
    );
    deliveryStatus = "Delivered";
    // --- Cash collection log logic ---
    // Find cash orders
    const cashOrders = validOrders.filter(
      (order) => order.method && order.method.toLowerCase() === "cash"
    );
    if (cashOrders.length > 0) {
      // Get driver name from localStorage
      let collectedBy = "Unknown";
      try {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          collectedBy = userData.name || userData.username || userData.id || "Unknown";
        }
      } catch (e) { collectedBy = "Unknown"; }
      const timestamp = new Date().toISOString();
      // For each cash order, POST a log entry to /cashLogs.json
      for (const order of cashOrders) {
        const logEntry = {
          orderID: order.OrderID || order.OrderId || order.id || null,
          amount: parseFloat(order.Total || 0),
          collectedBy,
          timestamp
        };
        try {
          await fetch("https://siindrive-default-rtdb.europe-west1.firebasedatabase.app/cashLogs.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(logEntry)
          });
        } catch (e) { console.error("Failed to log cash collection", logEntry, e); }
        // --- Update wallet in users table ---
        try {
          // Find userId by searching users table for name === collectedBy
          const usersResp = await fetch("https://siindrive-default-rtdb.europe-west1.firebasedatabase.app/users.json");
          if (usersResp.ok) {
            const users = await usersResp.json();
            if (users && typeof users === 'object') {
              let userKey = null;
              let currentWallet = 0;
              for (const [key, userData] of Object.entries(users)) {
                if (userData && userData.name === collectedBy) {
                  userKey = key;
                  currentWallet = typeof userData.wallet === 'number' ? userData.wallet : 0;
                  break;
                }
              }
              if (userKey) {
                const newWallet = currentWallet + logEntry.amount;
                await fetch(`https://siindrive-default-rtdb.europe-west1.firebasedatabase.app/users/${userKey}.json`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ wallet: newWallet })
                });
              }
            }
          }
        } catch (e) { console.error("Failed to update wallet for user", collectedBy, e); }
      }
    }
  } else {
    return { success: false, count: 0, error: "Unknown action" };
  }

  if (!validOrders || validOrders.length === 0) {
    return { success: false, count: 0, error: "No valid orders to update" };
  }

  const dbIds = validOrders.map(order => order.DbID).filter(Boolean);
  if (dbIds.length === 0) {
    return { success: false, count: 0, error: "No valid order IDs found" };
  }

  const apiUrl = "https://main-api.siin.shop/v3/orders/public/get-24-hour-order?key=SIINSHOP";
  const body = {
    _id: dbIds,
    deliveryStatus: deliveryStatus
  };
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`Backend update failed: ${response.status}`);
    }
    return { success: true, count: dbIds.length };
  } catch (error) {
    return { success: false, count: 0, error };
  }
}
