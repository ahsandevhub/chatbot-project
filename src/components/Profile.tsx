// src/components/Profile.tsx
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return <p>Loading profile...</p>; // Or redirect to login
  }

  console.log("====================================");
  console.log(user);
  console.log("====================================");

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Your Profile
        </h2>
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        {/* Add more user details here if available in the session */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
