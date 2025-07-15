// Reusable component for order filtering, sorting, and grouping
export class OrderGroupingService {
  
  /**
   * Filter orders by seller country
   * @param {Array} orders - Array of order objects
   * @param {string} country - Country code to filter by
   * @returns {Array} Filtered orders
   */
  static filterBySellerCountry(orders, country) {
    if (!orders || !Array.isArray(orders)) return [];
    return orders.filter(order => order.SellerCountry === country);
  }

  /**
   * Group orders by seller username
   * @param {Array} orders - Array of order objects
   * @returns {Object} Object with seller usernames as keys and arrays of orders as values
   */
  static groupBySeller(orders) {
    if (!orders || !Array.isArray(orders)) return {};
    
    const grouped = {};
    orders.forEach(order => {
      const seller = order.Seller || 'Unknown Seller';
      if (!grouped[seller]) {
        grouped[seller] = [];
      }
      grouped[seller].push(order);
    });
    
    return grouped;
  }

  /**
   * Group orders by customer username
   * @param {Array} orders - Array of order objects
   * @returns {Object} Object with customer usernames as keys and arrays of orders as values
   */
  static groupByCustomer(orders) {
    if (!orders || !Array.isArray(orders)) return {};
    
    const grouped = {};
    orders.forEach(order => {
      const customer = order.Customer || 'Unknown Customer';
      if (!grouped[customer]) {
        grouped[customer] = [];
      }
      grouped[customer].push(order);
    });
    
    return grouped;
  }

  /**
   * Sort grouped data by key (alphabetically)
   * @param {Object} groupedData - Object with groups
   * @returns {Array} Array of [key, value] pairs sorted by key
   */
  static sortGroupedData(groupedData) {
    return Object.entries(groupedData).sort(([a], [b]) => a.localeCompare(b));
  }

  /**
   * Get summary statistics for grouped orders
   * @param {Object} groupedData - Object with groups
   * @returns {Object} Statistics object
   */
  static getGroupStats(groupedData) {
    const stats = {
      totalGroups: Object.keys(groupedData).length,
      totalOrders: 0,
      avgOrdersPerGroup: 0
    };

    Object.values(groupedData).forEach(orders => {
      stats.totalOrders += orders.length;
    });

    stats.avgOrdersPerGroup = stats.totalGroups > 0 ? 
      Math.round(stats.totalOrders / stats.totalGroups * 100) / 100 : 0;

    return stats;
  }

  /**
   * Process orders for BH pickup (filter by BH sellers and group by seller)
   * @param {Array} orders - Array of order objects
   * @returns {Object} Processed data with grouped orders and stats
   */
  static processBHPickupOrders(orders) {
    const bhOrders = this.filterBySellerCountry(orders, 'BH');
    const groupedBySeller = this.groupBySeller(bhOrders);
    const sortedGroups = this.sortGroupedData(groupedBySeller);
    const stats = this.getGroupStats(groupedBySeller);

    return {
      groupedOrders: sortedGroups,
      stats: stats,
      totalOrders: bhOrders.length
    };
  }

  /**
   * Process orders for international delivery (filter by non-BH customers)
   * @param {Array} orders - Array of order objects
   * @returns {Object} Processed data with grouped orders and stats
   */
  static processInternationalDelivery(orders) {
    const intOrders = orders.filter(order => order.CustomerCountry !== 'BH');
    const groupedByCustomer = this.groupByCustomer(intOrders);
    const sortedGroups = this.sortGroupedData(groupedByCustomer);
    const stats = this.getGroupStats(groupedByCustomer);

    return {
      groupedOrders: sortedGroups,
      stats: stats,
      totalOrders: intOrders.length
    };
  }

  /**
   * Process orders for BH delivery (filter by BH customers and BH sellers, group by customer)
   * @param {Array} orders - Array of order objects
   * @returns {Object} Processed data with grouped orders and stats
   */
  static processBHDeliveryOrders(orders) {
    const bhOrders = orders.filter(order => 
      order.CustomerCountry === 'BH' && order.SellerCountry === 'BH'
    );
    const groupedByCustomer = this.groupByCustomer(bhOrders);
    const sortedGroups = this.sortGroupedData(groupedByCustomer);
    const stats = this.getGroupStats(groupedByCustomer);

    return {
      groupedOrders: sortedGroups,
      stats: stats,
      totalOrders: bhOrders.length
    };
  }

  /**
   * Process orders for International delivery (filter by BH sellers with non-BH customers, group by customer)
   * @param {Array} orders - Array of order objects
   * @returns {Object} Processed data with grouped orders and stats
   */
  static processInternationalDeliveryOrders(orders) {
    const internationalOrders = orders.filter(order => 
      order.SellerCountry === 'BH' && order.CustomerCountry !== 'BH'
    );
    const groupedByCustomer = this.groupByCustomer(internationalOrders);
    const sortedGroups = this.sortGroupedData(groupedByCustomer);
    const stats = this.getGroupStats(groupedByCustomer);

    return {
      groupedOrders: sortedGroups,
      stats: stats,
      totalOrders: internationalOrders.length
    };
  }
}
