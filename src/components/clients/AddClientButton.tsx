import React from 'react'

interface AddClientButtonProps {
  onClick: () => void
}

const AddClientButton: React.FC<AddClientButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-black text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
      aria-label="Add Client"
    >
      <span className="text-xl font-light mr-2">+</span>
      <span className="font-medium">Add Client</span>
    </button>
  )
}

export default AddClientButton
