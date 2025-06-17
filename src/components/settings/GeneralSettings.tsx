import React from 'react'
import PersonnelProfileSection from './PersonnelProfileSection'
import CompanyProfileSection from './CompanyProfileSection'
import SaveButton from './SaveButton'
import { useSettings } from './useSettings'

const GeneralSettings: React.FC = () => {
  const {
    settings,
    isLoading,
    isAdmin,
    handleInputChange,
    handleProfilePictureChange,
    handleSave,
  } = useSettings()

  return (
    <div className="bg-white p-4 sm:p-6 rounded-md shadow space-y-8 max-w-full overflow-x-auto">
      <PersonnelProfileSection
        firstName={settings.firstName}
        lastName={settings.lastName}
        email={settings.email}
        clientCode={settings.clientCode}
        profilePicture={settings.profilePicture}
        isAdmin={isAdmin}
        onProfilePictureChange={handleProfilePictureChange}
        onFirstNameChange={(value) => handleInputChange('firstName', value)}
        onLastNameChange={(value) => handleInputChange('lastName', value)}
      />

      {!isAdmin && (
        <CompanyProfileSection
          companyName={settings.companyName}
          companyDomain={settings.companyDomain}
          onInputChange={handleInputChange}
        />
      )}

      <SaveButton onSave={handleSave} isLoading={isLoading} />
    </div>
  )
}

export default GeneralSettings
