import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InputField, Message } from "../components";
import Header from "../components/Header";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState("");
    const [activity, setActivity] = useState("paragliding");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [msgType, setMsgType] = useState("info");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            navigate("/login");
            return;
        }
        const parsed = JSON.parse(stored);
        if (parsed.role !== "admin") {
            navigate("/"); // Redirect non-admins
            return;
        }
        setUser(parsed);
    }, [navigate]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !email) {
            setMsg("Vui lòng chọn video và nhập email khách hàng.");
            setMsgType("error");
            return;
        }

        setLoading(true);
        setMsg(null);

        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("video", file);
            formData.append("customerEmail", email);
            formData.append("activity", activity);
            formData.append("capturedAt", new Date().toISOString());

            const res = await fetch(`${API_URL}/api/videos/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Tải lên thất bại");

            setMsg("Tải video lên thành công!");
            setMsgType("success");
            setFile(null);
            setEmail("");
        } catch (err) {
            setMsg(err.message || "Tải lên thất bại");
            setMsgType("error");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-surf font-sans">
            <Header title="Quản Lý Hệ Thống" subtitle="Tải lên và quản lý video của khách hàng" small />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Tải Video Mới
                    </h2>
                    
                    <form onSubmit={handleUpload} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Khách Hàng</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Khách hàng phải đăng ký tài khoản bằng email này"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại Dịch Vụ</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex items-center justify-center py-3 px-4 border rounded-xl cursor-pointer transition-all ${activity === 'paragliding' ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    <input type="radio" name="activity" value="paragliding" checked={activity === 'paragliding'} onChange={() => setActivity('paragliding')} className="hidden" />
                                    Bay lượn (Paragliding)
                                </label>
                                <label className={`flex items-center justify-center py-3 px-4 border rounded-xl cursor-pointer transition-all ${activity === 'diving' ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    <input type="radio" name="activity" value="diving" checked={activity === 'diving'} onChange={() => setActivity('diving')} className="hidden" />
                                    Lặn biển (Diving)
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn File Video (MP4, MOV)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary hover:bg-surf/50 transition-all">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                                            <span>Tải lên một file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="video/mp4,video/quicktime" onChange={e => setFile(e.target.files[0])} />
                                        </label>
                                        <p className="pl-1">hoặc kéo thả vào đây</p>
                                    </div>
                                    <p className="text-xs text-gray-500">MP4, MOV up to 2GB</p>
                                </div>
                            </div>
                            {file && <p className="mt-2 text-sm text-green-600 font-medium break-all">Đã chọn: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>}
                        </div>

                        <Button type="submit" loading={loading} className="w-full">
                            Tải Video Lên
                        </Button>
                    </form>

                    <Message text={msg} type={msgType} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
