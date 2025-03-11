import axios from "axios";

export const LoginApi = async (valuesObj) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:3000/chefs/sign_in",
      {
        chef: valuesObj,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    const token = response.headers["authorization"];
    return {
      status: response.status,
      data: response.data,
      token: token,
    };
  } catch (error) {
    console.error("API error:", error.response?.data);
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.status?.message || "An unexpected error occurred",
    };
  }
};
