import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard, A11y } from 'swiper/modules';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/pagination';

/**
 * ImageSwiper — Swiper.js gallery with touch, keyboard, pagination dots,
 * and prev/next arrow buttons.
 *
 * @param {{ images: string[], alt: string }} props
 */
export default function ImageSwiper({ images = [], alt = '' }) {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const didDragRef = useRef(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    resetView();
  };

  const changeZoom = (amount) => {
    setZoom((current) => {
      const nextZoom = Math.min(Math.max(current + amount, 1), 3);
      if (nextZoom === 1) setPan({ x: 0, y: 0 });
      return nextZoom;
    });
  };

  const handleImageClick = () => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }

    changeZoom(zoom >= 3 ? -2 : 1);
  };

  const handleImagePointerDown = (event) => {
    if (zoom <= 1) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    didDragRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleImagePointerMove = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;

    if (Math.abs(event.clientX - dragRef.current.startX) > 4 || Math.abs(event.clientY - dragRef.current.startY) > 4) {
      didDragRef.current = true;
    }

    setPan({
      x: dragRef.current.panX + event.clientX - dragRef.current.startX,
      y: dragRef.current.panY + event.clientY - dragRef.current.startY,
    });
  };

  const handleImagePointerUp = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleImageWheel = (event) => {
    event.preventDefault();
    changeZoom(event.deltaY < 0 ? 0.5 : -0.5);
  };

  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((current) => (current - 1 + images.length) % images.length);
        resetView();
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((current) => (current + 1) % images.length);
        resetView();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, images.length]);

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
            <button
              type="button"
              className="w-full h-full flex items-center justify-center bg-gray-100 cursor-zoom-in "
              onClick={() => { setLightboxIndex(idx); resetView(); }}
              aria-label={t('product.open_image', { count: idx + 1 })}
            >
              <img
                src={src}
                alt={`${alt} — image ${idx + 1}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={t('product.image_gallery')}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
        >
          <div className="relative flex h-full w-full items-center justify-center">
            <img
              src={images[lightboxIndex]}
              alt={`${alt} — image ${lightboxIndex + 1}`}
              className={`max-h-full max-w-full object-contain select-none ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: dragRef.current ? 'none' : 'transform 200ms ease',
                touchAction: 'none',
              }}
              onPointerDown={handleImagePointerDown}
              onPointerMove={handleImagePointerMove}
              onPointerUp={handleImagePointerUp}
              onPointerCancel={handleImagePointerUp}
              onClick={handleImageClick}
              onWheel={handleImageWheel}
            />

            <div className="absolute top-0 right-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeZoom(0.5)}
                className="h-10 w-10 rounded-full bg-white/90 text-xl font-semibold text-gray-900 hover:bg-white"
                aria-label={t('product.zoom_in')}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => changeZoom(-0.5)}
                className="h-10 w-10 rounded-full bg-white/90 text-xl font-semibold text-gray-900 hover:bg-white"
                aria-label={t('product.zoom_out')}
              >
                −
              </button>
              <button
                type="button"
                onClick={resetView}
                className="h-10 rounded-full bg-white/90 px-4 text-xs font-bold uppercase text-gray-900 hover:bg-white"
                aria-label={t('product.reset_zoom')}
              >
                {t('product.reset_zoom')}
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                className="h-10 w-10 rounded-full bg-white/90 text-2xl leading-none text-gray-900 hover:bg-white"
                aria-label={t('product.close_image')}
              >
                ×
              </button>
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => { setLightboxIndex((current) => (current - 1 + images.length) % images.length); resetView(); }}
                  className="absolute left-0 flex h-12 w-12 items-center justify-center  bg-white/90 text-3xl leading-none text-gray-900 hover:bg-white rounded-none h-[70px] w-[30px]"
                  aria-label={t('product.previous_image')}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => { setLightboxIndex((current) => (current + 1) % images.length); resetView(); }}
                  className="absolute right-0 flex h-12 w-12 items-center justify-center  bg-white/90 text-3xl leading-none text-gray-900 hover:bg-white rounded-none h-[70px] w-[30px]"
                  aria-label={t('product.next_image')}
                >
                  ›
                </button>
              </>
            )}

            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
              {lightboxIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
