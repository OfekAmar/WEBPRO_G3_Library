// src/components/LibraryMap.jsx
import React from 'react';

const LibraryMap = () => {
    return (
        <div className="w-full overflow-hidden">
            {/* MAP */}
            <div className="w-full bg-[#d8eef5]">
                <iframe
                    title="Bookify Map"
                    width="100%"
                    height="400"
                    className="block"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://maps.google.com/maps?q=סנונית+51+כרמיאל+2161002&output=embed"
                />
            </div>
        </div>
    );
};

export default LibraryMap;

