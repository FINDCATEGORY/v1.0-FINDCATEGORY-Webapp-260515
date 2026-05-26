// components/spaceplanning260521/background.tsx
import React from 'react';

export const Background = ({ src, placeholder }: { src: string; placeholder?: string }) => {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
      poster={placeholder}
    />
  );
};