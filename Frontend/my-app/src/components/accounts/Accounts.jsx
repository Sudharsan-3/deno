import { useState } from "react";
import UploadBank from "./upload-bank";

export default function Accounts() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
       
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-xl hover:bg-pink-700 shadow-md"
        >
          Add new account
        </button>
      </div>

      {showModal && <UploadBank onClose={() => setShowModal(false)} />}
    </div>
  );
}
