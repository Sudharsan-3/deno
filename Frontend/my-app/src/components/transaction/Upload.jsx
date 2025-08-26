"use client";
import React, { useState } from "react";
import Image from "next/image";
import uploadIcon from "@/app/public/file-upload-svgrepo-com.svg";
import UploadTransaction from "../upload-transaction";

const Upload = () => {
  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(false);

  const openModal = () => {
    setShow(true);
    setTimeout(() => setAnimate(true), 10);
  };

  const closeModal = () => {
    setAnimate(false);
    setTimeout(() => setShow(false), 300);
  };

  return (
    <div>
      {/* Upload Button */}
      <div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 rounded-full px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
        >
          <Image
            src={uploadIcon}
            alt="Upload Icon"
            className="w-5 h-5 invert"
          />
          Upload Transactions
        </button>
      </div>

      {/* Popup Modal */}
      {show && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
            animate ? "bg-transparent border border-transparent hover:border-pink-700 bg-opacity-50 opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 sm:p-8 relative transform transition-all duration-300 ${
              animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-pink-600 text-2xl font-bold transition"
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="mb-4 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-black">
                Upload Your Transactions
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                Choose a file and upload your transaction details
              </p>
            </div>

            {/* Upload Form */}
            <UploadTransaction setShow={setShow} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
