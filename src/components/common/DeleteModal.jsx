// src/components/common/DeleteModal.jsx
import Button from '@/components/ui/Button';

export default function DeleteModal({
  isOpen = false,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName = '',
  onConfirm = () => {},
  onCancel = () => {},
  isLoading = false,
  danger = true,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Warning Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
              ⚠️
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-600 text-center mb-4">
            {message}
          </p>

          {/* Item Name */}
          {itemName && (
            <div className="bg-gray-100 rounded-lg p-3 text-center mb-4">
              <p className="text-sm text-gray-600">Item to delete:</p>
              <p className="text-sm font-semibold text-gray-900 break-words">{itemName}</p>
            </div>
          )}

          {/* Warning Text */}
          <p className="text-xs text-red-600 text-center font-medium mb-6">
            This action cannot be undone!
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}