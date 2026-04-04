// components/Modals/ConfirmDelete.jsx - Delete confirmation dialog
import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../Common/Button';

const ConfirmDelete = ({ title = 'Delete item?', message = 'This action cannot be undone.', onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onCancel}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FiAlertTriangle size={20} className="text-accent-red" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading} className="flex-1">Delete</Button>
      </div>
    </div>
  </div>
);

export default ConfirmDelete;
