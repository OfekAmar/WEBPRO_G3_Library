import React from 'react';
import { CheckCircle } from 'lucide-react';
import Buttonn from './Buttonn';

const SuccessfulMessage = ({ message, onConfirm }) => {
    return (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-lg p-3 w-full max-w-sm text-center relative">



                <div className="flex justify-center -mt-14 mb-4">
                    <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="text-white" size={40} />
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Success</h2>
                <p className="text-gray-700 whitespace-pre-line">{message}</p>


                <Buttonn
                    variant="okMes"
                    onToggle={onConfirm}
                >
                    OK
                </Buttonn>
            </div>
        </div>
    );
};

export default SuccessfulMessage;
