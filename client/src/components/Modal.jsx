const Modal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 shadow-lg w-96'>
        <h2 className='text-xl font-semibold mb-4'>{title}</h2>
        <p className='mb-6'>{message}</p>
        <div className='flex justify-end gap-4'>
          <button
            className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
            onClick={onConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
