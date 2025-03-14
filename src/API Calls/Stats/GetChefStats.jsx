import axios from "axios";

export const GetChefStatsApi = async (jwt) => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:3000/api/v1/chef/stats",
      {
        headers: {
          Authorization: `${jwt}`,
        },
      },
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
