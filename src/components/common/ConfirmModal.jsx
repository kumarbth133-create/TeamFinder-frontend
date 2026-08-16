const ConfirmModal = ({
  isOpen, title, message, onConfirm, onCancel,
  confirmText = "Delete", confirmClass = "btn-danger",
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-750 border border-dark-600 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className={confirmClass}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
