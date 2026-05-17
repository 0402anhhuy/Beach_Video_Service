import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, InputField, Message, Card, PageWrapper } from "../components";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [msgType, setMsgType] = useState("info");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Lỗi đăng nhập");
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setMsg("Đăng nhập thành công! Đang chuyển hướng...");
            setMsgType("success");
            setTimeout(() => navigate("/"), 1200);
        } catch (err) {
            setMsg(err.message || "Lỗi đăng nhập");
            setMsgType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <Card>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Chào mừng trở lại!</h2>
                    <p className="text-gray-500 font-medium">Đăng nhập vào Beach Video</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <InputField label="Email" name="email" type="email" placeholder="example@hcmute.edu.vn" value={formData.email} onChange={handleChange} />
                    <InputField label="Mật khẩu" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />

                    <div className="flex justify-end mb-4">
                        <Link to="/forgot-password" className="text-sm text-primary opacity-80 hover:underline">Quên mật khẩu?</Link>
                    </div>

                    <Button type="submit" loading={loading}>{loading ? "Đang đăng nhập..." : "Đăng Nhập"}</Button>
                    <Message text={msg} type={msgType} />
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600">
                        Chưa có tài khoản?{" "}
                        <Link to="/register" className="text-primary font-semibold hover:underline">Đăng ký tại đây</Link>
                    </p>
                </div>
            </Card>
        </PageWrapper>
    );
};

export default Login;