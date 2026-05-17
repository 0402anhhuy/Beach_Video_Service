import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const rawUser = localStorage.getItem("user");
    let user = null;
    try {
        user = JSON.parse(rawUser || "null");
    } catch (e) {
        user = null;
    }
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-2xl font-extrabold text-primary flex items-center gap-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Beach Video
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {token && user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-sm font-semibold text-gray-700 hover:text-primary transition">Quản Lý Hệ Thống</Link>
                            )}
                            <Link to="/profile" className="text-sm font-semibold text-gray-700 hover:text-primary flex items-center gap-2 transition">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                    {user.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                                <span className="hidden sm:block">{user.name || 'Tài khoản'}</span>
                            </Link>
                            <button onClick={handleLogout} className="text-sm font-bold px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition">Thoát</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-primary transition">Đăng nhập</Link>
                            <Link to="/register" className="text-sm font-bold px-5 py-2.5 bg-primary text-white rounded-xl shadow-md hover:bg-primary-dark transition">Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
