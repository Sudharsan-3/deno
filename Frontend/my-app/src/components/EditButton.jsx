"use client";
import React from "react";
import { MdOutlineEdit } from "react-icons/md";


export default function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1  text-black rounded hover:cursor-pointer "
    >
      <MdOutlineEdit />

    </button>
  );
}
