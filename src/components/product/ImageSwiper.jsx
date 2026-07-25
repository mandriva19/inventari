import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

/**
 * ImageSwiper — Swiper.js gallery with touch, keyboard, pagination dots,
 * and prev/next arrow buttons.
 *
 * @param {{ images: string[], alt: string }} props
 */
export default function ImageSwiper({ images = [], alt = '' }) {
  if (!images.length) {
    return (
      <div className="relative aspect-square md:aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden w-full">
        <div className="text-gray-400" aria-label="No image available">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-square md:aspect-[4/3] w-full bg-gray-100 overflow-hidden group">
      <Swiper
        modules={[Pagination, Keyboard, A11y]}
        pagination={{ clickable: true, dynamicBullets: false }}
        keyboard={{ enabled: true }}
        a11y={{ prevSlideMessage: 'Previous image', nextSlideMessage: 'Next image' }}
        loop={images.length > 1}
        grabCursor={images.length > 1}
        className="w-full h-full"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <img
                src={src}
                alt={`${alt} — image ${idx + 1}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
