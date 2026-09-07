import React, { useState, useCallback } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

/**
 * Lightbox component – replaces the custom ImageSwiper.
 * Props:
 *   images: string[] – array of image URLs
 *   alt: string – accessible alt text base for each image
 */
export default function LightboxGallery({ images = [], alt = '' }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const handleOpen = useCallback((i) => {
    setIndex(i);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  return (
    <>
      {/* Main image (first image) */}
      <style>{`
        .scroll-container {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .scroll-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
      {images.length > 0 && (
        <button
          type="button"
          className="w-full mb-4 flex items-center justify-center bg-gray-100 cursor-zoom-in"
          onClick={() => handleOpen(0)}
          aria-label={`${alt} – main image`}
        >
          <img
            src={images[0]}
            alt={`${alt} — main image`}
            loading="eager"
            className="w-full max-h-[500px] object-cover rounded-lg"
          />
        </button>
      )}

      {/* Horizontal thumbnails */}
      <div className="flex overflow-x-auto gap-2 py-2 scroll-container">
        {images.slice(1).map((src, idx) => (
          <button
            key={idx + 1}
            type="button"
            className="flex-none w-[100px] h-[100px] bg-gray-100 cursor-zoom-in rounded-lg"
            onClick={() => handleOpen(idx + 1)}
            aria-label={`${alt} – thumbnail ${idx + 2}`}
          >
            <img
              src={src}
              alt={`${alt} — thumbnail ${idx + 2}`}
              loading="lazy"
              className="w-full h-full object-cover rounded-lg"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        close={handleClose}
        index={index}
        slides={images.map((src) => ({ src }))}
        plugins={[Zoom]}
        animation={{ zoom: 0.2 }}
        toolbar={false}
        clickOutsideToClose={true}
        onPrev={handlePrev}
        onNext={handleNext}
        // YARL already supports swipe, pinch‑zoom via Zoom plugin, keyboard navigation, overlay click.
      />
    </>
  );
}
