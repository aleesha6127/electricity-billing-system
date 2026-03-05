import { Home, Settings, LogOut, FlaskConical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Sidebar() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={styles.sidebar}>
      <Home style={styles.icon} onClick={() => navigate("/dashboard")} />
      <Settings style={styles.icon} onClick={() => navigate("/config")} />
      <FlaskConical style={styles.icon} onClick={() => navigate("/testing")} title="Testing" />
      <LogOut style={styles.icon} onClick={logout} />
    </div>
  );
}

const styles = {
  sidebar: {
    width: "60px",
    background: "#0a3d62",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "20px",
    gap: "25px",
  },
  icon: {
    color: "#fff",
    cursor: "pointer",
  },
};

export default Sidebar;
