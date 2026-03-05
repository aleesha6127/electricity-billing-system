import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserSidebar.css";

export default function UserSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: "📊" },
        { name: "Payments", path: "/payments", icon: "💳" },
        { name: "Profile", path: "/profile", icon: "👤" },
    ];

    const logout = () => {
        localStorage.removeItem("meterId");
        navigate("/");
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <button className="mobile-toggle" onClick={toggleSidebar}>
                {isOpen ? "✕" : "☰"}
            </button>

            <aside className={`user-sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-brand">
                    <span className="brand-icon">⚡</span>
                    <span className="brand-name">PowerGrid</span>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
                            onClick={() => {
                                navigate(item.path);
                                setIsOpen(false);
                            }}
                        >
                            <span className="link-icon">{item.icon}</span>
                            <span className="link-text">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <button className="sidebar-logout" onClick={logout}>
                    <span className="link-icon">🚪</span>
                    <span className="link-text">Logout</span>
                </button>
            </aside>

            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
        </>
    );
}
