import axios from "axios";

export const CreateFoodApi = async (jwt, dataObj) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:3000/api/v1/chef/create_food",
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
