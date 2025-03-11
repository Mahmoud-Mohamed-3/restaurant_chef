import axios from "axios";

export const GetCurrentChefApi = async (token) => {
  try {
    const response = await axios.get("http://127.0.0.1:3000/api/v1/chef", {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return response.message;
    }
  } catch (error) {
    return null;
  }
};
