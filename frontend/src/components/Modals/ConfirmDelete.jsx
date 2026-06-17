import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../Common/Button';

const ConfirmDelete = ({ title = 'Delete?', message = 'This cannot be undone.', onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
    <div className="bg-dark-800 rounded-3xl shadow-2xl border border-dark-500 w-full max-w-sm animate-scale-in p-6" onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center">
          <FiAlertTriangle size={20} className="text-red-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="text-sm text-dark-300">{message}</p>
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
