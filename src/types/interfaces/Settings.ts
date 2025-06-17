export interface PersonnelProfileSectionProps {
  firstName: string
  lastName: string
  email: string
  clientCode: string
  profilePicture: string | null
  isAdmin: boolean
  onProfilePictureChange: (imageUrl: string) => void
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
}

export interface ProfilePictureUploadProps {
  profilePicture: string | null
  onPhotoChange: (imageUrl: string) => void
}
