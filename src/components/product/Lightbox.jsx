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
      {/* Thumbnail gallery – same layout as previous ImageSwiper */}
      <div className="grid grid-cols-1 gap-2">
        {images.map((src, idx) => (
          <button
            key={idx}
            type="button"
            className="w-full h-full flex items-center justify-center bg-gray-100 cursor-zoom-in"
            onClick={() => handleOpen(idx)}
            aria-label={`${alt} – image ${idx + 1}`}
          >
            <img
              src={src}
              alt={`${alt} — image ${idx + 1}`}
              loading={idx === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover"
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
