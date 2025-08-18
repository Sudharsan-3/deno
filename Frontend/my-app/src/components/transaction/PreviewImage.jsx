import React from 'react'

const PreviewImage = ({previewImage , closeModal}) => {
  return (
    <div>
       <div className="fixed inset-0 bg-transparent bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-lg"
              onClick={closeModal}
            >✖</button>
            <img src={previewImage} alt="Preview" className="w-full h-auto rounded" />
          </div>
        </div>
    </div>
  )
}

export default PreviewImage
