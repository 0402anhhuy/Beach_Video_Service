import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const HomePage = () => {
    const navigate = useNavigate();
    const { token, user } = useMemo(() => {
        const tokenValue = localStorage.getItem('token');
        const rawUser = localStorage.getItem('user');
        let parsedUser = null;
        try {
            parsedUser = JSON.parse(rawUser || 'null');
        } catch {
            parsedUser = null;
        }
        return { token: tokenValue, user: parsedUser };
    }, []);

    const loggedIn = Boolean(token && user);
    const isAdmin = user?.role === 'admin';

    return (
        <div className="min-h-screen bg-surf pb-16 font-sans">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-ocean to-primary-light">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none"></div>
                <div className="relative z-10 container mx-auto px-6 py-24 text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
                        Lưu Giữ Khoảnh Khắc <br className="hidden md:block"/> Biển Cả
                    </h1>
                    <p className="text-lg md:text-2xl font-light text-surf mb-10 max-w-2xl mx-auto">
                        Tải video trải nghiệm bay lượn và lặn biển của bạn chất lượng cao
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {loggedIn ? (
                            <>
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="px-8 py-4 rounded-full bg-white text-primary-dark hover:bg-surf transition-all shadow-xl font-bold text-lg w-full sm:w-auto"
                                >
                                    Xem Video Của Tôi
                                </button>
                                {isAdmin && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="px-8 py-4 rounded-full bg-primary-dark text-white hover:bg-ocean transition-all shadow-xl font-bold text-lg border border-white/20 w-full sm:w-auto"
                                    >
                                        Quản Lý Hệ Thống
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="px-8 py-4 rounded-full bg-white text-primary-dark hover:bg-surf transition-all shadow-xl font-bold text-lg w-full sm:w-auto"
                                >
                                    Đăng Ký Ngay
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-4 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all font-bold text-lg border border-white/30 w-full sm:w-auto"
                                >
                                    Đăng Nhập
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" className="w-full h-auto text-surf fill-current" preserveAspectRatio="none">
                        <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                    </svg>
                </div>
            </div>

            <main className="container mx-auto px-6 mt-16">
                {/* Features */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-primary-light/20 text-primary-dark rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Chất Lượng Gốc</h3>
                        <p className="text-gray-600 leading-relaxed">Video được giữ nguyên chất lượng 4K/60fps từ GoPro, cho trải nghiệm chân thực nhất.</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-primary-light/20 text-primary-dark rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Riêng Tư Tuyệt Đối</h3>
                        <p className="text-gray-600 leading-relaxed">Hệ thống bảo mật OTP qua email. Chỉ có bạn mới có quyền xem và tải video của chính mình.</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-primary-light/20 text-primary-dark rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Tốc Độ Siêu Tốc</h3>
                        <p className="text-gray-600 leading-relaxed">Không còn cảnh xếp hàng chép file. Video sẵn sàng tải về ngay khi bạn lên bờ.</p>
                    </div>
                </section>

                {/* How it works */}
                <section className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900">Trải Nghiệm Dễ Dàng</h2>
                        <p className="text-gray-500 mt-4">Chỉ với 3 bước đơn giản để nhận video của bạn</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gray-200 -z-10"></div>
                        
                        {[
                            { step: "01", title: "Đăng Ký", desc: "Tạo tài khoản nhanh chóng và xác minh bằng mã OTP gửi về email của bạn." },
                            { step: "02", title: "Trải Nghiệm", desc: "Tận hưởng chuyến bay lượn hay lặn biển. Chúng tôi sẽ lo phần ghi hình." },
                            { step: "03", title: "Tải Về", desc: "Đăng nhập và tải ngay video đã được tự động gán vào tài khoản của bạn." }
                        ].map((item, i) => (
                            <div key={i} className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-primary-light/40">
                                    {item.step}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
