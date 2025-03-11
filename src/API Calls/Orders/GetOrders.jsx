import axios from "axios";

export const GetOrdersApi = async (jwt, page = 1) => {
  try {
    const response = axios.get(
      `http://127.0.0.1:3000/api/v1/chef/show_all_orders?page=${page}`,
      {
        headers: {
          Authorization: `${jwt}`,
        },
      },
    );
    if (response) {
      return response;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// // API Call (GetOrdersApi.js)
// export const GetOrdersApi = async (jwt, page = 1) => {
//   try {
//     const response = await fetch(`/api/orders?page=${page}`, {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${jwt}`,
//         "Content-Type": "application/json",
//       },
//     });
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return null;
//   }
// };
