// src/components/ContactBar.jsx
import React from 'react';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

const ContactBar = () => (
  <div className="w-full bg-[rgb(207,230,238)] text-indigo-950 py-8 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-center md:text-left">
      <div className="flex flex-col items-center md:items-start">
        <Phone className="mb-2" />
        <span className="text-indigo-950">Call Us 7/24</span>
        <span className="font-bold">04-644-3204</span>
      </div>
      <div className="flex flex-col items-center md:items-start">
        <Mail className="mb-2" />
        <span className="text-indigo-950">Make a Quote</span>
        <span className="font-bold">Library@e.braude.ac.il</span>
      </div>
      <div className="flex flex-col items-center md:items-start">
        <Clock className="mb-2" />
        <span className="text-indigo-950">Opening Hours</span>
        <span className="font-bold">Sunday - Friday</span>
        <span className="font-bold">8:30 - 14:00</span>
      </div>
      <div className="flex flex-col items-center md:items-start">
        <MapPin className="mb-2" />
        <span className="text-indigo-950">Location</span>
        <span className="font-bold">Snunit Street 51, Karmiel</span>
      </div>
    </div>
  </div>
);

export default ContactBar;

