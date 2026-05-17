import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InputField, Message } from "../components";
import Header from "../components/Header";

const Profile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ name: "", email: "" });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [msgType, setMsgType] = useState("info");
    const [errors, setErrors] = useState({});
    
    const [activeTab, setActiveTab] = useState("videos");
    const [videos, setVideos] = useState([]);
    const [loadingVideos, setLoadingVideos] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            navigate("/login");
            return;
        }
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm({ name: parsed.name, email: parsed.email });
        if (parsed.avatar) setAvatarPreview(parsed.avatar);
    }, [navigate]);

    useEffect(() => {
        if (activeTab === "videos" && user) {
            fetchVideos();
        }
    }, [activeTab, user]);

    const fetchVideos = async () => {
        setLoadingVideos(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/videos/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setVideos(data.videos || []);
            }
        } catch (err) {
            console.error("Fetch videos error:", err);
        } finally {
            setLoadingVideos(false);
        }
    };

    const getInitials = (name = "") =>
        name.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase();

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            setMsg("Ảnh không được vượt quá 2MB.");
            setMsgType("error");
            return;
        }
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Tên không được để trống.";
        return errs;
    };

    const handleSave = async () => {
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        setErrors({});
        setLoading(true);
        setMsg(null);

        try {
            const token = localStorage.getItem("token");
            const payload = new FormData();
            payload.append("name", form.name);
            if (avatar) payload.append("avatar", avatar);

            const res = await fetch(`${API_URL}/api/user/profile`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: payload,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");

            const updated = {
                ...user,
                name: data.user?.name || form.name,
                avatar: data.user?.avatar || avatarPreview,
            };

            localStorage.setItem("user", JSON.stringify(updated));
            setUser(updated);
            setEditing(false);
            setAvatar(null);
            setMsg("Cập nhật hồ sơ thành công!");
            setMsgType("success");
        } catch (err) {
            setMsg(err.message || "Cập nhật thất bại");
            setMsgType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setForm({ name: user.name, email: user.email });
        setAvatarPreview(user.avatar || null);
        setAvatar(null);
        setErrors({});
        setMsg(null);
        setEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) return null;

    const renderProfileTab = () => (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
                <div className="relative inline-block">
                    <div
                        onClick={() => editing && fileInputRef.current?.click()}
                        className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-white shadow-lg ${editing ? "cursor-pointer" : ""}`}
                        style={{
                            background: avatarPreview ? "transparent" : "linear-gradient(135deg, #0284c7, #38bdf8)",
                        }}
                    >
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white">{getInitials(user.name)}</span>
                        )}
                    </div>
                    {editing && (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-white hover:opacity-90 transition-opacity">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                {editing && <p className="text-xs text-gray-400 mt-2">Nhấn vào ảnh để thay đổi (tối đa 2MB)</p>}
                {!editing && (
                    <>
                        <h2 className="text-2xl font-extrabold text-gray-900 mt-4">{user.name}</h2>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                    </>
                )}
            </div>
            <div className="space-y-1">
                {editing ? (
                    <>
                        <InputField label="Họ và tên" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm select-none">
                                {user.email}
                                <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Không thể đổi</span>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button loading={loading} onClick={handleSave}>Lưu thay đổi</Button>
                            <Button variant="secondary" onClick={handleCancel}>Hủy</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <InfoRow icon="user" label="Họ và tên" value={user.name} />
                        <InfoRow icon="mail" label="Email" value={user.email} />
                        <InfoRow icon="calendar" label="Thành viên từ" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "Gần đây"} />
                        <div className="pt-6 flex gap-3">
                            <Button onClick={() => { setEditing(true); setMsg(null); }}>Chỉnh sửa hồ sơ</Button>
                            <button type="button" onClick={handleLogout} className="px-4 py-3 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 transition">Thoát</button>
                        </div>
                    </>
                )}
            </div>
            <Message text={msg} type={msgType} />
        </div>
    );

    const renderVideosTab = () => {
        if (loadingVideos) {
            return (
                <div className="flex justify-center items-center py-20">
                    <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                </div>
            );
        }

        if (videos.length === 0) {
            return (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-surf rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có video nào</h3>
                    <p className="text-gray-500">Video trải nghiệm của bạn sẽ xuất hiện tại đây sau khi ban quản lý tải lên hệ thống.</p>
                </div>
            );
        }

        const token = localStorage.getItem("token");

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => {
                    const videoUrl = `${API_URL}${video.streamEndpoint}`;
                    const downloadUrl = `${videoUrl}?download=true`;

                    return (
                        <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="aspect-video bg-gray-900 relative group overflow-hidden">
                                <video 
                                    controls 
                                    className="w-full h-full object-cover"
                                    src={`${videoUrl}?token=${token}#t=0.1,10`}
                                    controlsList="nodownload"
                                    onTimeUpdate={(e) => {
                                        if (e.target.currentTime > 10) {
                                            e.target.pause();
                                            e.target.currentTime = 0.1;
                                        }
                                    }}
                                    poster="" // You can add a default poster here if needed
                                />
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium flex items-center gap-1.5 z-10">
                                    <span className={`w-2 h-2 rounded-full ${video.activity === 'paragliding' ? 'bg-blue-400' : video.activity === 'diving' ? 'bg-teal-400' : 'bg-primary'}`}></span>
                                    {video.activity === 'paragliding' ? 'Bay lượn' : video.activity === 'diving' ? 'Lặn biển' : 'Khác'}
                                </div>
                                <div className="absolute top-3 right-3 bg-red-500/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-bold uppercase tracking-wider z-10">
                                    Preview 10s
                                </div>
                            </div>
                            <div className="p-5">
                                <h4 className="font-bold text-gray-900 truncate mb-1" title={video.originalName}>{video.originalName}</h4>
                                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                                    <span>{new Date(video.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <span>{(video.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                                </div>
                                {/* Download requires authenticated fetch or token in query */}
                                <a 
                                    href={`${downloadUrl}&token=${token}`} 
                                    download={video.originalName}
                                    className="block w-full py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-colors text-center flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Tải Về Ngay
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-surf font-sans">
            <Header title="Tài Khoản" subtitle={`Chào ${user.name || "bạn"}, cùng xem lại những khoảnh khắc tuyệt vời`} small />
            
            <div className="container mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-xl inline-flex gap-2 border border-white shadow-sm">
                        <button 
                            onClick={() => setActiveTab('videos')}
                            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'videos' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Video Của Tôi
                        </button>
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Hồ Sơ
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'videos' ? renderVideosTab() : renderProfileTab()}
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, icon }) => {
    const icons = {
        user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
        mail: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
        calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    };

    return (
        <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icons[icon]}</svg>
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default Profile;