'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { useAuth } from "@/context/AuthContext";
import { FaUniversity } from "react-icons/fa";

const REQUIRED_FIELDS = [
  'name', 'address', 'accountNo', 'branch', 'ifsc', 'micr'
];

const OPTIONAL_FIELDS = [
  'startDate', 'endDate', 'custRelnNo', 'currency',
  'nominationRegd', 'nomineeName', 'jointHolders'
];

const INITIAL_STATE = {
  name: '',
  address: '',
  accountNo: '',
  branch: '',
  ifsc: '',
  micr: '',
  startDate: '',
  endDate: '',
  custRelnNo: '',
  currency: '',
  nominationRegd: '',
  nomineeName: '',
  jointHolders: '',
};

const UploadBank = ({ onClose }) => {
  const { user } = useAuth();
  const createdById = user?.id;

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setSubmitStatus(null);
  };

  const validateField = (name, value) => {
    if (REQUIRED_FIELDS.includes(name) && !value.trim()) {
      return 'This field is required';
    }
    switch (name) {
      case 'name':
        return /^[a-zA-Z\s]+$/.test(value) ? '' : 'Name must contain only letters';
      case 'accountNo':
        return /^\d{11,13}$/.test(value) ? '' : 'Account number must be 11-13 digits';
      case 'ifsc':
        return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase()) ? '' : 'Invalid IFSC code';
      case 'micr':
        return /^\d{9}$/.test(value) ? '' : 'MICR must be 9 digits';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    REQUIRED_FIELDS.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateForm();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    try {
      await api.post('/account', {
        ...formData,
        createdById,
      });
      setSubmitStatus({ type: 'success', message: '✅ Bank details uploaded successfully.' });
      setFormData(INITIAL_STATE);
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.message || '❌ Failed to upload bank details',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      {/* Animated Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl bg-white backdrop-blur-lg border border-pink-200 shadow-2xl rounded-2xl p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black text-2xl"
        >
          ✕
        </button>
    <div>
      
    </div>
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3 text-black">
          <FaUniversity className="text-pink-600 text-3xl" />
          Upload Bank Details
        </h2>

        {/* Status Message */}
        {submitStatus && (
          <div
            className={`mb-6 text-sm px-4 py-3 rounded-lg border ${
              submitStatus.type === 'success'
                ? 'bg-pink-50 text-pink-700 border-pink-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2">
            {[...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].map((key) => (
              <div key={key} className="flex flex-col">
                <label className="block text-sm font-medium text-gray-800 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                  {REQUIRED_FIELDS.includes(key) ? (
                    <span className="text-pink-500 ml-1">*</span>
                  ) : (
                    <span className="text-gray-400 text-xs ml-2">(optional)</span>
                  )}
                </label>

                <input
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  type={key.toLowerCase().includes('date') ? 'date' : 'text'}
                  className={`w-full border px-4 py-3 rounded-xl shadow-sm focus:outline-none transition cursor-pointer text-gray-700 ${
                    errors[key]
                      ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-2 focus:ring-pink-400'
                  }`}
                  placeholder={`Enter ${key}`}
                />
                {errors[key] && (
                  <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center md:justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold shadow-lg transition ${
                loading
                  ? 'bg-pink-300 text-white opacity-70 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700 text-white'
              }`}
            >
              {loading ? 'Submitting...' : 'Upload Bank Details'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadBank;

// 'use client';

// import React, { useState } from 'react';
// import api from '@/lib/axios';
// import { useAuth } from "@/context/AuthContext";
// import { FaUniversity } from "react-icons/fa";

// const REQUIRED_FIELDS = [
//   'name', 'address', 'accountNo', 'branch', 'ifsc', 'micr'
// ];

// const OPTIONAL_FIELDS = [
//   'startDate', 'endDate', 'custRelnNo', 'currency',
//   'nominationRegd', 'nomineeName', 'jointHolders'
// ];

// const INITIAL_STATE = {
//   name: '',
//   address: '',
//   accountNo: '',
//   branch: '',
//   ifsc: '',
//   micr: '',
//   startDate: '',
//   endDate: '',
//   custRelnNo: '',
//   currency: '',
//   nominationRegd: '',
//   nomineeName: '',
//   jointHolders: '',
// };

// const UploadBank = () => {
//   const { user } = useAuth();
//   const createdById = user?.id;

//   const [formData, setFormData] = useState(INITIAL_STATE);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: '' });
//     setSubmitStatus(null);
//   };

//   const validateField = (name, value) => {
//     if (REQUIRED_FIELDS.includes(name) && !value.trim()) {
//       return 'This field is required';
//     }
//     switch (name) {
//       case 'name':
//         return /^[a-zA-Z\s]+$/.test(value) ? '' : 'Name must contain only letters';
//       case 'accountNo':
//         return /^\d{11,13}$/.test(value) ? '' : 'Account number must be 11-13 digits';
//       case 'ifsc':
//         return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase()) ? '' : 'Invalid IFSC code';
//       case 'micr':
//         return /^\d{9}$/.test(value) ? '' : 'MICR must be 9 digits';
//       default:
//         return '';
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     REQUIRED_FIELDS.forEach((field) => {
//       const error = validateField(field, formData[field]);
//       if (error) newErrors[field] = error;
//     });
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const fieldErrors = validateForm();
//     if (Object.keys(fieldErrors).length > 0) {
//       setErrors(fieldErrors);
//       return;
//     }

//     setLoading(true);
//     setSubmitStatus(null);

//     try {
//       await api.post('/account', {
//         ...formData,
//         createdById,
//       });
//       setSubmitStatus({ type: 'success', message: '✅ Bank details uploaded successfully.' });
//       setFormData(INITIAL_STATE);
//     } catch (error) {
//       setSubmitStatus({
//         type: 'error',
//         message: error.response?.data?.message || '❌ Failed to upload bank details',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 max-w-6xl mx-auto">
//       <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-pink-200">
//         {/* Header */}
//         <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3 text-black">
//           <FaUniversity className="text-pink-600 text-3xl" />
//           Upload Bank Details
//         </h2>

//         {/* Status Message */}
//         {submitStatus && (
//           <div
//             className={`mb-6 text-sm px-4 py-3 rounded-lg border ${
//               submitStatus.type === 'success'
//                 ? 'bg-pink-50 text-pink-700 border-pink-200'
//                 : 'bg-red-50 text-red-700 border-red-200'
//             }`}
//           >
//             {submitStatus.message}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].map((key) => (
//               <div key={key} className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-800 mb-1 capitalize">
//                   {key.replace(/([A-Z])/g, ' $1')}
//                   {REQUIRED_FIELDS.includes(key) ? (
//                     <span className="text-pink-500 ml-1">*</span>
//                   ) : (
//                     <span className="text-gray-400 text-xs ml-2">(optional)</span>
//                   )}
//                 </label>

//                 <input
//                   name={key}
//                   value={formData[key]}
//                   onChange={handleChange}
//                   type={key.toLowerCase().includes('date') ? 'date' : 'text'}
//                   className={`w-full border px-4 py-3 rounded-xl shadow-sm focus:outline-none transition cursor-pointer text-gray-700 ${
//                     errors[key]
//                       ? 'border-red-500 focus:ring-2 focus:ring-red-400'
//                       : 'border-gray-300 focus:ring-2 focus:ring-pink-400'
//                   }`}
//                   placeholder={`Enter ${key}`}
//                 />
//                 {errors[key] && (
//                   <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-center md:justify-end">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold shadow-lg transition ${
//                 loading
//                   ? 'bg-pink-300 text-white opacity-70 cursor-not-allowed'
//                   : 'bg-pink-600 hover:bg-pink-700 text-white'
//               }`}
//             >
//               {loading ? 'Submitting...' : 'Upload Bank Details'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UploadBank;
