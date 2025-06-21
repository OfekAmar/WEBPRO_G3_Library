import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessfulMessage = ({ message, onConfirm }) => {
    return (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

            <div className="bg-[rgba(var(--bookcard),1)] rounded-xl shadow-lg p-3 w-full max-w-sm text-center relative text-[rgba(var(--copy-primary),1)]">




                <div className="flex justify-center -mt-14 mb-4">
                    <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="text-white" size={40} />
                    </div>
                </div>

                <h2 className="text-2xl font-semibold mb-2">Success</h2>
                <p className="whitespace-pre-line">{message}</p>


                <button
                    onClick={onConfirm}
                    className="bg-green-500 text-white px-6 py-2 rounded font-medium hover:bg-green-600 transition"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default SuccessfulMessage;
