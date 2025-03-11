import { Form, Input, message } from "antd";
import { useEffect } from "react";
import FormItem from "antd/es/form/FormItem/index.js";
import { useCookies } from "react-cookie";
import "../css/login_page.css";
import { LoginApi } from "../API Calls/Logging/Login.jsx";

export default function LoginPage() {
  const [form] = Form.useForm();
  const [cookies, setCookie] = useCookies(["jwt"]);
  useEffect(() => {
    const savedValues = sessionStorage.getItem("loginFormData");
    if (savedValues) {
      form.setFieldsValue(JSON.parse(savedValues));
    }
  }, [form]);

  // Save form values to sessionStorage on change
  const handleFormChange = (_, allValues) => {
    sessionStorage.setItem("loginFormData", JSON.stringify(allValues));
  };

  const onFinish = async (values) => {
    try {
      const response = await LoginApi(values);
      if (response.status === 200) {
        setCookie("jwt", response.token);
        message.success("Login successful");
        sessionStorage.removeItem("loginFormData");
        form.resetFields();
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else if (response.status === 401) {
        message.error("Invalid email or password");
        sessionStorage.removeItem("loginFormData");
        form.resetFields();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("An unexpected error occurred");
      sessionStorage.removeItem("loginFormData");
      form.resetFields();
    }
  };

  // Cleanup on component unmount (when navigating away)
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("loginFormData"); // Clear saved form data when navigating away
    };
  }, []);
  useEffect(() => {
    if (cookies.jwt) {
      window.location.href = "/";
    }
  });
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("loginFormData"); // Clear saved form data when navigating away
    };
  }, []);

  useEffect(() => {
    document.body.classList.add("LoginPage");

    return () => {
      document.body.classList.remove("LoginPage");
    };
  }, []);
  return (
    <div className={"LoginPage"}>
      <h1 className={"Welcome"}>Welcome Our Chef Login Please 🧑‍🍳</h1>

      <div className={"LoginFormContainer"}>
        <h1 className={"LoginFormTitle"}>Login</h1>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onValuesChange={handleFormChange}
          className={"LoginForm"}
        >
          <FormItem
            label="Email OR Phone Number"
            name="login"
            rules={[
              {
                required: true,
                message: "Please input your email or phone number!",
              },
              { min: 6, message: "Input must be at least 6 characters" },
              { max: 50, message: "Input must be at most 50 characters" },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(
                      "Please input your email or phone number!",
                    );
                  }

                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  const phoneRegex = /^01[0-9]{9}$/; // Accepts international format

                  if (emailRegex.test(value) || phoneRegex.test(value)) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    "Please enter a valid email or phone number!",
                  );
                },
              },
            ]}
          >
            <Input placeholder="Email OR Phone Number" />
          </FormItem>
          <FormItem
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters" },
              {
                max: 20,
                message: "Password must be at most 20 characters",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </FormItem>
          <FormItem>
            <button className={"LoginButton"} type={"submit"}>
              Login
            </button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
}

// import { Link } from "react-router-dom";
// import FormItem from "antd/es/form/FormItem/index.js";
// import { Form, Input, message } from "antd";
// import { useEffect } from "react";
// import { useCookies } from "react-cookie";
// import { LoginApi } from "../API Calls/Regestrations/LoginApi.jsx";
//
// export default function LoginPage() {
//   const [form] = Form.useForm();
//   const [cookies, setCookie] = useCookies(["jwt"]);
//   useEffect(() => {
//     if (cookies.jwt) {
//       window.location.href = "/";
//     }
//   }, []);
//   // Load saved form data from sessionStorage on page load
//   useEffect(() => {
//     const savedValues = sessionStorage.getItem("loginFormData");
//     if (savedValues) {
//       form.setFieldsValue(JSON.parse(savedValues));
//     }
//   }, [form]);
//
//   // Save form values to sessionStorage on change
//   const handleFormChange = (_, allValues) => {
//     sessionStorage.setItem("loginFormData", JSON.stringify(allValues));
//   };
//
//   const onFinish = async (values) => {
//     try {
//       const response = await LoginApi(values);
//       if (response.status === 200) {
//         setCookie("jwt", response.token);
//         message.success("Login successful");
//         sessionStorage.removeItem("loginFormData");
//         form.resetFields();
//         setTimeout(() => {
//           window.location.href = "/";
//         }, 1000);
//       } else if (response.status === 401) {
//         message.error("Invalid email or password");
//         sessionStorage.removeItem("loginFormData");
//         form.resetFields();
//       } else {
//         message.error(response.message);
//       }
//     } catch (error) {
//       message.error("An unexpected error occurred");
//       sessionStorage.removeItem("loginFormData");
//       form.resetFields();
//     }
//   };
//
//   // Cleanup on component unmount (when navigating away)
//   useEffect(() => {
//     return () => {
//       sessionStorage.removeItem("loginFormData"); // Clear saved form data when navigating away
//     };
//   }, []);
//
//   useEffect(() => {
//     document.body.classList.add("LoginPage");
//
//     return () => {
//       document.body.classList.remove("LoginPage");
//     };
//   }, []);
//
//   return (
//     <>
//       <h1 className="ResName">FEANE</h1>
//       <div className="Login">
//         <h1>Login</h1>
//         <Form
//           layout="vertical"
//           className="LoginForm"
//           form={form}
//           onFinish={onFinish}
//           onValuesChange={handleFormChange}
//         >
//           <FormItem
//             label="Email OR Phone Number"
//             name="login"
//             rules={[
//               {
//                 required: true,
//                 message: "Please input your email or phone number!",
//               },
//               { min: 6, message: "Input must be at least 6 characters" },
//               { max: 50, message: "Input must be at most 50 characters" },
//               {
//                 validator: (_, value) => {
//                   if (!value) {
//                     return Promise.reject(
//                       "Please input your email or phone number!",
//                     );
//                   }
//
//                   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                   const phoneRegex = /^01[0-9]{9}$/; // Accepts international format
//
//                   if (emailRegex.test(value) || phoneRegex.test(value)) {
//                     return Promise.resolve();
//                   }
//
//                   return Promise.reject(
//                     "Please enter a valid email or phone number!",
//                   );
//                 },
//               },
//             ]}
//           >
//             <Input placeholder="Email OR Phone Number" />
//           </FormItem>
//
//           <FormItem
//             label="Password"
//             name="password"
//             rules={[
//               { required: true, message: "Please input your password!" },
//               { min: 8, message: "Password must be at least 8 characters" },
//               {
//                 max: 20,
//                 message: "Password must be at most 20 characters",
//               },
//             ]}
//           >
//             <Input.Password placeholder="Password" />
//           </FormItem>
//           <FormItem>
//             <button className={"LoginButton"} type={"submit"}>
//               Login
//             </button>
//           </FormItem>
//         </Form>
//         <Link to="/register">Don't have an account? Register here</Link>
//       </div>
//     </>
//   );
// }
