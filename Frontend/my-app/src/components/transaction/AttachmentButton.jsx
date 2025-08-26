"use client";
import React from "react";
import Image from "next/image";

const AttachmentButton = ({ onClick, viewLogo }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onClick}
        title="View Attachments"
        className="hover:opacity-80 transition cursor-pointer"
      >
        <Image src={viewLogo} alt="View" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AttachmentButton;
