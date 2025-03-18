//src/components/Logout.tsx
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
