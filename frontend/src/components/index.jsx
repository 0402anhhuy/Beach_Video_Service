export const Button = ({ children, loading, variant = "primary", className = "", ...props }) => {
    const base = "w-full py-3 rounded-lg font-bold transition-all disabled:opacity-60";
    const variants = {
        primary: "bg-primary text-white shadow-lg shadow-blue-200 hover:opacity-90",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        danger: "bg-red-500 text-white hover:opacity-90",
    };
    return (
        <button disabled={loading} className={`${base} ${variants[variant]} ${className}`} {...props}>
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {children}
                </span>
            ) : children}
        </button>
    );
};

export const InputField = ({ label, error, ...props }) => (
    <div className="mb-4">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <input
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
            {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

export const Message = ({ text, type = "info" }) => {
    if (!text) return null;
    const styles = {
        info: "bg-blue-50 text-blue-700 border-blue-200",
        success: "bg-green-50 text-green-700 border-green-200",
        error: "bg-red-50 text-red-600 border-red-200",
    };
    return (
        <div className={`mt-4 px-4 py-3 rounded-lg border text-sm text-center ${styles[type]}`}>
            {text}
        </div>
    );
};

export const StepIndicator = ({ steps, current }) => (
    <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
                <div key={i} className="flex items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${done ? "bg-primary border-primary text-white" : active ? "border-primary text-primary bg-white" : "border-gray-300 text-gray-400 bg-white"}`}>
                            {done ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : i + 1}
                        </div>
                        <span className={`text-xs font-medium ${active ? "text-primary" : done ? "text-primary" : "text-gray-400"}`}>{label}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`w-10 h-0.5 mb-5 rounded ${done ? "bg-primary" : "bg-gray-200"}`} />
                    )}
                </div>
            );
        })}
    </div>
);

export const OtpInput = ({ value, onChange }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mã OTP</label>
        <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-center text-2xl font-mono tracking-[0.5em] transition-all"
        />
        <p className="text-xs text-gray-400 mt-1 text-center">Nhập mã 6 chữ số được gửi đến email của bạn</p>
    </div>
);

export const Card = ({ children, className = "" }) => (
    <div className={`max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 ${className}`}>
        {children}
    </div>
);

export const PageWrapper = ({ children, center = true }) => (
    <div className={`min-h-screen flex ${center ? "items-center justify-center" : "items-start justify-start"} bg-gray-50 px-4 py-12`}>
        {children}
    </div>
);