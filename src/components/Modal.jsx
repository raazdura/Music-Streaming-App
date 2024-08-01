import React from 'react';

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg">
        <button className="absolute top-2 right-2 text-white p-8" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
