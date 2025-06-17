import React from 'react'
import ProfilePictureUpload from './ProfilePictureUpload'
import { PersonnelProfileSectionProps } from '@/types/interfaces/Settings'

const PersonnelProfileSection: React.FC<PersonnelProfileSectionProps> = ({
  firstName,
  lastName,
  email,
  clientCode,
  profilePicture,
  isAdmin,
  onProfilePictureChange,
  onFirstNameChange,
  onLastNameChange,
}) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Personnel profile</h2>
      <div className="border-b border-gray-300 pb-4 mb-4">
        <ProfilePictureUpload
          profilePicture={profilePicture}
          onPhotoChange={onProfilePictureChange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {!isAdmin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Code
            </label>
            <input
              type="text"
              value={clientCode}
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>
    </section>
  )
}

export default PersonnelProfileSection
