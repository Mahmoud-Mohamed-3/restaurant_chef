import axios from "axios";

export const UpdateFoodApi = async (jwt, item_id, dataObj) => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:3000/api/v1/chef/update_food/${item_id}`,
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
