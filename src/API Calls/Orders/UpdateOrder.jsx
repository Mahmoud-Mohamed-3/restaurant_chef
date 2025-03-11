import axios from "axios";

export const UpdateOrderApi = async (jwt, item_id, dataObj) => {
  try {
    const response = axios.put(
      `http://127.0.0.1:3000/api/v1/chef/update_order_status/${item_id}`,
      dataObj,
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
