import React, { useEffect, useRef } from 'react';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

const Footer = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Load Google Map with appropriate theme and add marker
  const loadMap = () => {
    if (!window.google || !mapRef.current) return;

    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 32.91363, lng: 35.28157 },
      zoom: 15,
      styles: theme === 'dark' ? darkMapStyles : lightMapStyles,
    });

    new window.google.maps.Marker({
      position: { lat: 32.91363, lng: 35.28157 },
      map: mapInstance.current,
    });
  };

  // Initialize Google Map script and observe theme changes to update map style
  useEffect(() => {
    const init = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBDGzAF1nFvs3HHppd0txoiKSKLUWWHW5k&callback=initMap`;
        script.async = true;
        window.initMap = loadMap;
        document.body.appendChild(script);
      } else {
        loadMap();
      }
    };

    init();

    const observer = new MutationObserver(() => {
      // clear map container before reloading
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
        loadMap();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="w-full mt-12">
      {/* MAP */}
      <div className="w-full h-[400px]">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* CONTACT */}
      <div className="w-full bg-[rgba(var(--backgroundhomepage),1)] text-[rgba(var(--copy-primary),1)] py-8 px-4 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-center md:text-left">
          <ContactItem icon={<Phone />} label="Call Us 24/7" value="04-644-3204" />
          <ContactItem icon={<Mail />} label="Make a Quote" value="Library@e.braude.ac.il" />
          <ContactItem icon={<Clock />} label="Opening Hours" value={["Sunday - Friday", "8:30 - 14:00"]} />
          <ContactItem icon={<MapPin />} label="Location" value="Snunit Street 51, Karmiel" />
        </div>
      </div>
    </footer>
  );
};

// Contact item component for displaying icon, label, and value
const ContactItem = ({ icon, label, value }) => (
  <div className="flex flex-col items-center md:items-start">
    <div className="mb-2">{icon}</div>
    <span className="text-[rgba(var(--copy-secondary),1)]">{label}</span>
    {Array.isArray(value) ? (
      value.map((v, i) => <span key={i} className="font-bold">{v}</span>)
    ) : (
      <span className="font-bold">{value}</span>
    )}
  </div>
);

const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
];

const lightMapStyles = []; // default light style

export default Footer;
