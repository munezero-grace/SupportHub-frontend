import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { ERROR_MESSAGES } from '@/constants/errorMessages'
import { SUCCESS_MESSAGES } from '@/constants/successMessages'
import { updateUserSettings, getUserSettings } from '@/services/api.service'

type SettingsState = {
  clientCode: string
  companyName: string
  companyDomain: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  emailNotifications: boolean
  slackNotifications: boolean
  profilePicture: string | null
}

const initialSettings: SettingsState = {
  clientCode: '',
  companyName: '',
  companyDomain: '',
  firstName: '',
  lastName: '',
  fullName: '',
  email: '',
  emailNotifications: true,
  slackNotifications: true,
  profilePicture: null,
}

export const useSettings = () => {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<SettingsState>(initialSettings)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!session?.user) return

    if (session.user.accessToken) {
      localStorage.setItem('token', session.user.accessToken)
    }

    const fetchSettings = async () => {
      try {
        const response = await getUserSettings()
        const data = response.data.data
        const user = session.user as {
          firstName?: string
          lastName?: string
          name?: string
          email?: string
        }
        setSettings((prev) => {
          let firstName = data.firstName || user.firstName || ''
          let lastName = data.lastName || user.lastName || ''
          if (!firstName && !lastName && user.name) {
            const nameParts = user.name.split(' ')
            firstName = nameParts[0] || ''
            lastName = nameParts.slice(1).join(' ') || ''
          }
          return {
            ...prev,
            firstName,
            lastName,
            email: user.email || '',
            clientCode: data.clientCode || '',
            companyName: data.companyName || '',
            companyDomain: data.companyDomain || '',
          }
        })
      } catch {
        toast.error(ERROR_MESSAGES.UNKNOWN_ERROR)
      }
    }

    fetchSettings()
  }, [session])

  const handleInputChange = (field: string, value: string | boolean) => {
    const processedValue =
      field === 'companyDomain' && (value === null || value === undefined)
        ? ''
        : value

    setSettings((prev) => ({ ...prev, [field]: processedValue }))
  }

  const handleProfilePictureChange = (imageUrl: string) => {
    setSettings((prev) => ({ ...prev, profilePicture: imageUrl }))
  }

  const handleSave = async () => {
    if (!session?.user) {
      toast.error('User session not found')
      return
    }

    setIsLoading(true)

    try {
      await updateUserSettings({
        companyName: settings.companyName,
        companyDomain: settings.companyDomain,
        firstName: settings.firstName,
        lastName: settings.lastName,
      })

      toast.success(SUCCESS_MESSAGES.CLIENT_UPDATED)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `${ERROR_MESSAGES.UNKNOWN_ERROR}: ${error.message}`
          : `${ERROR_MESSAGES.UNKNOWN_ERROR}: ${ERROR_MESSAGES.UNKNOWN_ERROR}`

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const isAdmin = session?.user?.role === 'super_admin'

  return {
    settings,
    isLoading,
    isAdmin,
    handleInputChange,
    handleProfilePictureChange,
    handleSave,
  }
}
