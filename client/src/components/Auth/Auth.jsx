import React, { useContext } from "react";
import { auth, googleProvider, githubProvider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { AuthContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const Auth = () => {
  const { user, login, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      const userData = await signInWithPopup(auth, googleProvider);
      login(userData.user);
      navigate("/home");
      toast.success("Login successful");
    } catch (error) {
      toast.error("Google login failed. Please try again.");
    }
  };

  const loginWithGithub = async () => {
    // toast.error(
    //   "GitHub login is currently disabled. Please use Google to sign in."
    // );
    try {
      const userData = await signInWithPopup(auth, githubProvider);
      login(userData.user);
      navigate("/home");
    } catch (error) {
      toast.error("GitHub login failed. Please try again.");
    }
  };

  const randomSeed = user?.name + Math.floor(Math.random() * 10000);
  const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <Link
        className="absolute top-6 left-6 text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 z-10"
        to={user ? "/home" : "/"}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </Link>

      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-8">
          {!user ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-400">
                  Sign in to continue to your account
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={loginWithGoogle}
                  className="w-full flex items-center justify-center gap-3 cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors duration-200 text-white font-medium py-3 px-4 rounded-lg border border-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 533.5 544.3"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.3H272v95.1h146.9c-6.4 34.4-25.6 63.6-54.6 83.1v68h88c51.4-47.3 81.2-117.1 81.2-195.9z"
                      fill="#4285F4"
                    />
                    <path
                      d="M272 544.3c73.7 0 135.6-24.5 180.8-66.5l-88-68c-24.5 16.4-55.8 26-92.8 26-71 0-131.1-47.9-152.7-112.1H29v70.4c45.3 89.3 137.6 150.2 243 150.2z"
                      fill="#34A853"
                    />
                    <path
                      d="M119.3 323.7c-10.8-32.3-10.8-67.1 0-99.4V154h-90.4C4.1 191.6-8.7 233.2 0 274.3c8.7 41.1 29.8 78.3 58.9 105.5l90.4-56.1z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M272 107.7c39.9 0 75.8 13.7 104.2 40.7l78-78C415.6 26.3 353.7 0 272 0 166.6 0 74.3 60.9 29 150.2l90.4 69.4c21.6-64.2 81.7-111.9 152.6-111.9z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={loginWithGithub}
                  className="w-full flex items-center justify-center cursor-pointer gap-3 bg-gray-900 hover:bg-gray-800 transition-colors duration-200 text-white font-medium py-3 px-4 rounded-lg border border-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.3c-3.2.7-3.9-1.5-3.9-1.5-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.7-.9 2.3-1.3.1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.2 0 4.6-2.7 5.6-5.3 5.9.4.3.8 1 .8 2v3c0 .3.2.7.8.6a10.6 10.6 0 0 0 7.9-10.8C23.5 5.65 18.35.5 12 .5z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-400">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full border-4 border-indigo-500/80"
                />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-1.5">
                  <div className="bg-indigo-400 rounded-full p-1.5 animate-pulse"></div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">
                Welcome, {user.name.split(" ")[0]}
              </h2>
              <p className="text-gray-400 mb-6">{user.email}</p>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 text-white font-medium py-3 px-4 rounded-lg shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
