"use client";
import React from "react";
import { MdOutlineEdit } from "react-icons/md";

export default function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center p-2 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition shadow-sm"
      title="Edit"
    >
      <MdOutlineEdit size={20} />
    </button>
  );
}


// "use client";
// import React from "react";
// import { MdOutlineEdit } from "react-icons/md";


// export default function EditButton({ onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="px-2 py-1  text-black rounded hover:cursor-pointer "
//     >
//       <MdOutlineEdit />

//     </button>
//   );
// }
