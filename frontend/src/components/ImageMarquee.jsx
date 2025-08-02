// src/components/ImageMarquee.jsx
import React from 'react';

const ImageMarquee = ({ images, speed = 'medium', compact = false }) => {
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  const extendedImages = [...images, ...images];

  const speedFactors = {
    slow: 12,
    medium: 8,
    fast: 4,
  };
  const secondsPerImage = speedFactors[speed] || speedFactors.medium;
  const animationDuration = `${images.length * secondsPerImage}s`;

  // --- THE FIX ---
  // We explicitly define the width in `rem` to match the arbitrary value in the className.
  // 17 * 0.25rem = 4.25rem.
  const itemWidth = compact ? 4.25 : 20; // Use 4.25rem for compact, which is w-17 equivalent.
  const marginRight = compact ? 0.5 : 1;  // 0.5rem (mr-2) vs 1rem (mr-4)
  const totalWidthOfOneItem = itemWidth + marginRight;
  
  const marqueeStyle = {
    animation: `marquee ${animationDuration} linear infinite`,
    width: `${extendedImages.length * totalWidthOfOneItem}rem`,
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div 
        className="absolute top-0 left-0 flex h-full items-center hover:[animation-play-state:paused]"
        style={marqueeStyle}
      >
        {extendedImages.map((src, index) => (
          compact ? (
            <div
              key={index}
              // Use the arbitrary value `w-[4.25rem]` to create the w-17 equivalent.
              className="h-12 w-[4.25rem] flex-shrink-0 mr-2 rounded-md shadow-md p-1 bg-white/20 flex items-center justify-center"
            >
              <img
                src={src}
                alt={`Alumni logo ${index + 1}`}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/68x48/8B5CF6/FFFFFF?text=Logo`; // 68px is ~4.25rem
                }}
              />
            </div>
          ) : (
            <img
              key={index}
              src={src}
              alt={`Sliding content ${index + 1}`}
              className="h-full w-80 object-cover flex-shrink-0 mr-4 rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Image+${index + 1}`;
              }}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default ImageMarquee;