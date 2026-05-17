import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, InputField, OtpInput, Message, StepIndicator, Card, PageWrapper } from "../components";

const STEPS = ["Thông tin", "Xác thực OTP"];

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [msgType, setMsgType] = useState("info");
    const [errors, setErrors] = useState({});

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const validate = () => {
        const errs = {};
        if (!formData.name.trim()) errs.name = "Vui lòng nhập họ tên.";
        if (!formData.email) errs.email = "Vui lòng nhập email.";
        if (!formData.password || formData.password.length < 6) errs.password = "Mật khẩu tối thiểu 6 ký tự.";
        if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Mật khẩu xác nhận không khớp.";
        return errs;
    };

    const sendOtp = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setMsg(null);
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Lỗi");
            setStep(1);
            setMsg(data.message || "OTP đã gửi.");
            setMsgType("success");
        } catch (err) {
            setMsg(err.message || "Lỗi gửi OTP");
            setMsgType("error");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (otp.length !== 6) {
            setErrors({ otp: "Vui lòng nhập đủ 6 chữ số." });
            return;
        }
        setErrors({});
        setLoading(true);
        setMsg(null);
        try {
            const res = await fetch(`${API_URL}/api/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Lỗi xác thực");
            setMsg("Đăng ký thành công! Đang chuyển hướng...");
            setMsgType("success");
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            setMsg(err.message || "Lỗi xác thực OTP");
            setMsgType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <Card>
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Tạo tài khoản <span className="text-primary">UTEShop</span>
                    </h2>
                </div>

                <StepIndicator steps={STEPS} current={step} />

                {step === 0 && (
                    <>
                        <InputField label="Họ và tên" name="name" type="text" placeholder="Nguyễn Văn A" value={formData.name} onChange={handleChange} error={errors.name} />
                        <InputField label="Email" name="email" type="email" placeholder="example@hcmute.edu.vn" value={formData.email} onChange={handleChange} error={errors.email} />
                        <InputField label="Mật khẩu" name="password" type="password" placeholder="Tối thiểu 6 ký tự" value={formData.password} onChange={handleChange} error={errors.password} />
                        <InputField label="Xác nhận mật khẩu" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
                        <Button loading={loading} onClick={sendOtp}>Gửi mã OTP</Button>
                    </>
                )}

                {step === 1 && (
                    <>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-4 text-sm text-blue-600 text-center">
                            Đã gửi OTP đến <strong>{formData.email}</strong>
                        </div>
                        <OtpInput value={otp} onChange={setOtp} />
                        {errors.otp && <p className="text-xs text-red-500 -mt-3 mb-3 text-center">{errors.otp}</p>}
                        <div className="flex gap-3">
                            <Button loading={loading} onClick={verifyOtp}>Xác nhận OTP</Button>
                            <Button variant="secondary" loading={loading} onClick={sendOtp}>Gửi lại</Button>
                        </div>
                    </>
                )}

                <Message text={msg} type={msgType} />

                <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                    <p className="text-gray-600">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-primary font-semibold hover:underline">Đăng nhập ngay</Link>
                    </p>
                </div>
            </Card>
        </PageWrapper>
    );
};

export default Register;