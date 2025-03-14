import axios from "axios";

export const DeleteFoodApi = async (jwt, item_id) => {
  try {
    const response = await axios.delete(
      `http://127.0.0.1:3000/api/v1/chef/delete_food/${item_id}`,
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
