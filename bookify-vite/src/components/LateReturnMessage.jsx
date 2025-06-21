import React from 'react';
import { AlertTriangle } from 'lucide-react';

const LateReturnMessage = ({ message, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[rgba(var(--bookcard),1)] rounded-xl shadow-lg p-3 w-full max-w-sm text-center relative text-[rgba(var(--copy-primary),1)]">


        <div className="flex justify-center -mt-14 mb-4">
          <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
            <AlertTriangle className="text-white" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Returned Late</h2>


        <h2 className="text-2xl font-semibold mb-2">Success</h2>
        <p className="whitespace-pre-line">{message}</p>


        <button
          onClick={onConfirm}
          className="mt-6 bg-yellow-500 text-white px-6 py-2 rounded font-medium hover:bg-yellow-600 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default LateReturnMessage;
