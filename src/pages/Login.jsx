import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // try {
    //   const { data } = await axios.post(
    //     "/api/auth/login",
    //     { email, password },
    //     config
    //   );

    //   localStorage.setItem("authToken", data.token);

    //   // history.push("/");
    // } catch (error) {
    //   setError(error.response.data.error);
    //   setTimeout(() => {
    //     setError("");
    //   }, 5000);
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-800">
      <form
        onSubmit={loginHandler}
        className="bg-gray-900 text-white shadow-md rounded-md p-8 w-full max-w-md"
      >
        <span className="text-sm block mt-4 text-center">
          <Link to="/" className="text-blue-500">
            <h1 className="font-bold text-3xl text-center p-2 m-2">
              Music <br />
              <p className="text-sm">Streaming App</p>
            </h1>
          </Link>
        </span>
        <h3 className="text-center mb-6 text-2xl font-semibold">Login</h3>
        {error && <span className="text-red-500 mb-4 block">{error}</span>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 mb-2">
            Email:
          </label>
          <input
            type="email"
            required
            id="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            tabIndex={1}
            className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-300 mb-2">
            Password:
          </label>
          <input
            type="password"
            required
            id="password"
            autoComplete="true"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            tabIndex={2}
            className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            to="/forgotpassword"
            className="text-sm text-blue-500 block mt-2 text-right"
          >
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
        <span className="text-sm block mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Sign up
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
