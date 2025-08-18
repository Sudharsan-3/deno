"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import uploadIcon from "@/app/public/file-upload-svgrepo-com.svg"
import UploadTransaction from '../upload-transaction';

const Upload = () => {
     const [show, setShow] = useState(false)
      const [animate, setAnimate] = useState(false)
      const openModal = () => {
        setShow(true)
        setTimeout(() => setAnimate(true), 10)
      }
    
      const closeModal = () => {
        setAnimate(false)
        setTimeout(() => setShow(false), 300)
      }
    
  return (
    <div>
      {/* Upload Button */} 
            {!show ? (
              <div className="px-2 py-1">
                <button
                  onClick={openModal}
                  className=" flex text-black gap-2 hover:bg-white px-4 py-2 rounded shadow  transition W-20 hover:cursor-pointer"
                >
                  <Image src={ uploadIcon } alt='upload logo' className='w-4' />   Upload transactions
                </button>
              </div>
            ):(
              <div className='px-2 py-1 '> <button
              
              className=" text-white px-4 py-2 rounded shadow  transition W-20 hover:cursor-pointer"
            >
              <Image src={ uploadIcon } alt='upload logo' className='w-5' />
            </button></div>
            )}
      
            {/* Popup Modal */}
            {show && (
              <div
                className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                  animate ? 'bg-transparent bg-opacity-50 opacity-100' : 'opacity-0'
                }`}
              >
                <div
                  className={`bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg relative transform transition-all duration-300 ${
                    animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}
                >
                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                  >
                    ×
                  </button>
      
                  {/* Upload Form */}
                  <UploadTransaction setShow={setShow} />
                </div>
              </div>
            )}
    </div>
  )
}

export default Upload
