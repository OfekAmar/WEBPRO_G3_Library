// src/components/LibraryMap.jsx
import React from 'react';

const LibraryMap = () => {
  return (
    <div className="w-full h-[400px]">
      <iframe
        title="Bookify Library Location"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://maps.google.com/maps?q=סנונית+51+כרמיאל+2161002&output=embed"
      />
    </div>
  );
};

export default LibraryMap;

