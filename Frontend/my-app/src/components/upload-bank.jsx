'use client';

import React, { useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from "@/context/AuthContext";

// Required fields
const REQUIRED_FIELDS = [
  'name',
  'address',
  'accountNo',
  'branch',
  'ifsc',
  'micr'
];

// Optional fields
const OPTIONAL_FIELDS = [
  'startDate',
  'endDate',
  'custRelnNo',
  'currency',
  'nominationRegd',
  'nomineeName',
  'jointHolders'
];

export default function UploadBank() {
  const auth = useAuth();
  const creatorId = auth?.user?.id;

  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for required fields
    const missingFields = REQUIRED_FIELDS.filter(
      (field) => !formData[field]?.trim()
    );

    if (missingFields.length > 0) {
      return alert(` Please fill in required fields: ${missingFields.join(', ')}`);
    }

    // Final payload
    const payload = {
      ...formData,
      createdById: creatorId, //  Match what backend expects
    };

    try {
      await api.post('/account', payload);
      alert(' Bank details uploaded successfully');

      // Clear the form
      setFormData({
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
      });
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || ' Failed to upload bank details');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6"> Upload Bank Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium capitalize mb-1">
              {key.replace(/([A-Z])/g, ' $1')}
              {REQUIRED_FIELDS.includes(key) ? (
                <span className="text-red-500 ml-1">*</span>
              ) : (
                <span className="text-gray-500 text-xs ml-2">(optional)</span>
              )}
            </label>
            <input
              name={key}
              value={formData[key]}
              onChange={handleChange}
              type={key.toLowerCase().includes('date') ? 'date' : 'text'}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
