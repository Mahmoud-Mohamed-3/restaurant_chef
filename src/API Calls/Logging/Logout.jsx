import axios from "axios";

export const LogoutApi = async (jwt) => {
  try {
    const response = await axios.delete(
      "http://127.0.0.1:3000/chefs/sign_out",
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
