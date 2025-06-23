import React from 'react';

interface SaveButtonProps {
  onSave: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ 
  onSave, 
  isLoading = false, 
  disabled = false 
}) => {
  return (
    <div className="pt-4">
      <button
        onClick={onSave}
        disabled={disabled || isLoading}
        className={`
          px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500
          ${disabled || isLoading 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-gray-900 text-white hover:bg-gray-800'
          }
        `}
        type="button"
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default SaveButton;