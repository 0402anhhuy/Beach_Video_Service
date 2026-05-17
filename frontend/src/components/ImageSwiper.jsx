import { useState } from "react";

const ImageSwiper = ({ images = [] }) => {
    const [index, setIndex] = useState(0);
    if (!images || images.length === 0) return null;

    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
    const next = () => setIndex((i) => (i + 1) % images.length);

    return (
        <div className="w-full">
            <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                <img src={images[index]} alt={`img-${index}`} className="object-cover w-full h-full" />

                {images.length > 1 && (
                    <>
                        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full">‹</button>
                        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full">›</button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, i) => (
                                <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}></button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageSwiper;
