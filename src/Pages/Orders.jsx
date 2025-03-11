import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { GetOrdersApi } from "../API Calls/Orders/GetOrders.jsx";
import { message, Pagination } from "antd"; // Import Ant Design Pagination component
import "../css/order.css";
import { UpdateOrderApi } from "../API Calls/Orders/UpdateOrder.jsx";

export default function Orders() {
  const [orderItems, setOrderItems] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortByNewest, setSortByNewest] = useState(false);
  const [cookies] = useCookies();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // Track the total count of orders
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages

  useEffect(() => {
    const getOrders = async () => {
      const response = await GetOrdersApi(cookies.jwt, currentPage);
      if (response) {
        const ordersData = response.data.data.data;
        setOrderItems(ordersData);
        setFilteredOrders(ordersData);
        setTotalCount(response.data.pagination.total_count);
        setTotalPages(response.data.pagination.total_pages);
      } else {
        console.log("Error fetching orders");
      }
    };
    getOrders();
  }, [cookies.jwt, currentPage]);

  useEffect(() => {
    let filtered = orderItems;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.attributes.status === statusFilter,
      );
    }

    // Apply sort by newest
    if (sortByNewest) {
      filtered = [...filtered].sort(
        (a, b) => b.attributes.order_id - a.attributes.order_id, // Higher order_id means newer
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, sortByNewest, orderItems]);

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };
  const changeStatusToReady = async (orderId) => {
    const response = await UpdateOrderApi(cookies.jwt, orderId, {
      order_item: {
        status: "ready",
      },
    });
    if (response) {
      // Update the status of the order item in the UI
      const updatedOrders = filteredOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            attributes: {
              ...order.attributes,
              status: "ready",
            },
          };
        }
        return order;
      });
      setFilteredOrders(updatedOrders);
      message.success("Order status updated successfully!");
    } else {
      message.error("Failed to update order status");
    }
  };
  return (
    <div className="OrdersPage">
      <h1 className="PageTitle">Orders Overview</h1>

      {/* Filter and sort UI */}
      <div className="FilterContainer">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="ready">Ready</option>
          <option value="pending">Pending</option>
        </select>

        <button
          className="SortButton"
          onClick={() => setSortByNewest(!sortByNewest)}
        >
          {sortByNewest ? "Oldest First" : "Newest First"}
        </button>
      </div>

      {filteredOrders.length > 0 ? (
        <table className="OrdersTable">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Dish</th>
              <th>Quantity</th>
              <th>Price (LE)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.attributes.order_id}</td>
                <td className={"ItemName"}>{order.attributes.food_name}</td>
                <td>{order.attributes.quantity}</td>
                <td className={"ItemPrice"}>{order.attributes.price}</td>
                <td className={`Status ${order.attributes.status}`}>
                  {order.attributes.status.toUpperCase()}
                </td>
                {order.attributes.status === "pending" && (
                  <td>
                    <button
                      className="StatusButton"
                      onClick={() => changeStatusToReady(order.id)}
                    >
                      Mark as Ready
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="NoOrders">No orders available.</p>
      )}

      {/* Ant Design Pagination */}
      <div className="Pagination">
        <Pagination
          current={currentPage}
          total={totalCount} // Total number of orders
          pageSize={10} // Items per page
          onChange={handlePaginationChange}
          showSizeChanger={false} // Hide size changer (optional)
          disabled={totalCount === 0} // Disable pagination if there are no orders
        />
      </div>
    </div>
  );
}
