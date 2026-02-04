import { useState } from "react";
import axios from "axios";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";

    const payload = isSignup
      ? { username, email, password }
      : { email, password };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        payload,
      );

      if (isSignup) {
        alert("Account created! Please log in.");
        setIsSignup(false);
      } else {
        const { token, user } = res.data;

        localStorage.setItem("devvault_token", token);
        localStorage.setItem("devvault_user", user.username);

        setToken(token);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-white">
      <div className="bg-[#1e1e1e] p-8 rounded-xl border border-gray-800 shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          {isSignup ? "Join DevVault" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded focus:border-blue-500 outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded focus:border-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded focus:border-blue-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold transition-colors">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          {isSignup ? "Already have an account?" : "Need an account?"}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-400 ml-2 hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
