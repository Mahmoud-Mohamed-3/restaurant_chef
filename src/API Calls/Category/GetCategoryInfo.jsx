import axios from "axios";

export const GetCategoryInfoApi = async (jwt) => {
  try {
    const response = axios.get(
      "http://127.0.0.1:3000/api/v1/chef/get_your_category",
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
