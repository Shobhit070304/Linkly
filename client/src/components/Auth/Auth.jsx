import React, { useContext } from "react";
import { auth, googleProvider, githubProvider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { AuthContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import { toast } from "react-toastify";

const Auth = () => {
  const { user, login, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      const userData = await signInWithPopup(auth, googleProvider);
      login(userData.user);
      navigate("/dashboard");
      toast.success("Welcome back");
    } catch {
      toast.error("Google login failed");
    }
  };

  const loginWithGithub = async () => {
    try {
      const userData = await signInWithPopup(auth, githubProvider);
      login(userData.user);
      navigate("/dashboard");
      toast.success("Welcome back");
    } catch {
      toast.error("GitHub login failed");
    }
  };

  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}&backgroundColor=000000&textColor=ffffff`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#000000]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-900 dark:text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#000000] p-4 relative font-sans">
      
      <Link
        className="absolute top-8 left-8 text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
        to={user ? "/dashboard" : "/"}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="w-full max-w-[400px]">
        <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden p-8">
          {!user ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight mb-1">
                  Log in to Linkly
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Welcome back. Please enter your details.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={loginWithGoogle}
                  className="w-full flex items-center justify-center gap-2 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm text-gray-900 dark:text-white font-medium py-2.5 px-4 rounded-md border border-gray-200 dark:border-white/10"
                >
                  <svg className="w-4 h-4" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                    <path d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.3H272v95.1h146.9c-6.4 34.4-25.6 63.6-54.6 83.1v68h88c51.4-47.3 81.2-117.1 81.2-195.9z" fill="#4285F4" />
                    <path d="M272 544.3c73.7 0 135.6-24.5 180.8-66.5l-88-68c-24.5 16.4-55.8 26-92.8 26-71 0-131.1-47.9-152.7-112.1H29v70.4c45.3 89.3 137.6 150.2 243 150.2z" fill="#34A853" />
                    <path d="M119.3 323.7c-10.8-32.3-10.8-67.1 0-99.4V154h-90.4C4.1 191.6-8.7 233.2 0 274.3c8.7 41.1 29.8 78.3 58.9 105.5l90.4-56.1z" fill="#FBBC05" />
                    <path d="M272 107.7c39.9 0 75.8 13.7 104.2 40.7l78-78C415.6 26.3 353.7 0 272 0 166.6 0 74.3 60.9 29 150.2l90.4 69.4c21.6-64.2 81.7-111.9 152.6-111.9z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={loginWithGithub}
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 transition-colors text-white dark:text-black text-sm font-medium py-2.5 px-4 rounded-md border border-black dark:border-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.3c-3.2.7-3.9-1.5-3.9-1.5-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1 1.7-.9 2.3-1.3.1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.2 0 4.6-2.7 5.6-5.3 5.9.4.3.8 1 .8 2v3c0 .3.2.7.8.6a10.6 10.6 0 0 0 7.9-10.8C23.5 5.65 18.35.5 12 .5z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              <p className="mt-6 text-center text-xs text-gray-500">
                By clicking continue, you agree to our Terms of Service and Privacy Policy.
              </p>
            </>
          ) : (
            <div className="text-center">
              <img
                src={avatar}
                alt="User"
                className="w-16 h-16 rounded-full mx-auto mb-4 border border-black/5 dark:border-white/10"
              />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500 mb-6">{user.email}</p>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white text-sm font-medium py-2.5 px-4 rounded-md transition-colors border border-gray-200 dark:border-white/10"
              >
                <LogOut className="w-4 h-4" />
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
