'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast, ToastContainer } from 'react-toastify'
import { ticketService } from '../../services/tickets.service'
import { productService } from '../../services/products.service'


interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  firstName?: string
  lastName?: string
}

interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
    }
  }
}


interface Product {
  id: string
  name: string
}

interface UploadedFile {
  file: File
  name: string
}


interface FormData {
  title: string
  description: string
  product: string
  priority: string
  contactName: string
  contactEmail: string
  contactPhone: string
  client: string
  clientId: string
}


interface SelectOption {
  label: string
  value: string
}

type CreateTicketModalProps = {
  isOpen: boolean
  onClose: () => void
}

function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<
    'ticketDetails' | 'clientInfo' | 'advanced'
  >('ticketDetails')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    product: '',
    priority: 'medium',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    client: '',
    clientId: '',
  })
  const [loading, setLoading] = useState(false)

  const priorityOptions: SelectOption[] = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
  ]

  const [productOptions, setProductOptions] = useState<SelectOption[]>([
    { label: 'Select product', value: '' }
  ])

  useEffect(() => {
    if (isOpen) {
      const user = session?.user as SessionUser | undefined
      const firstName = user?.firstName
      const lastName = user?.lastName
      
      setFormData((prev) => ({
        ...prev,
        client:
          firstName && lastName
            ? `${firstName} ${lastName}`
            : user?.name || '',
        clientId: user?.id || '',
        contactName:
          firstName && lastName
            ? `${firstName} ${lastName}`
            : user?.name || '',
        contactEmail: user?.email || '',
      }))
    }

    const fetchProducts = async (): Promise<void> => {
      try {
        const products: Product[] = await productService.getProductsByClient()
        const options: SelectOption[] = products.map((product) => ({
          label: product.name,
          value: product.id,
        }))
        setProductOptions([{ label: 'Select product', value: '' }, ...options])
      } catch (error) {
        console.error('Failed to fetch products:', error)
        toast.error('Failed to load products. Please try again later.')
      }
    }
    fetchProducts()
  }, [isOpen, session])

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return false
    }
    if (!formData.description.trim()) {
      toast.error('Description is required')
      return false
    }
    if (!formData.product) {
      toast.error('Please select a product')
      return false
    }
    if (!formData.contactEmail) {
      toast.error('Contact email is required')
      return false
    }
    return true
  }

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const form = new FormData()

      const ticketCode = `TICKET-${Date.now()}`
      form.append('ticketCode', ticketCode)
      form.append('title', formData.title)
      form.append('description', formData.description)
      form.append('status', 'new')
      form.append('priority', formData.priority)
      form.append('contactName', formData.contactName)
      form.append('contactEmail', formData.contactEmail)
      form.append('contactPhone', formData.contactPhone)
      form.append('clientId', formData.clientId)
      form.append('productId', formData.product)

      if (uploadedFiles.length > 0) {
        form.append('file', uploadedFiles[0].file)
      }

      await ticketService.createTicket(form)
      toast.success('Ticket created successfully!')

      
      setFormData({
        title: '',
        description: '',
        product: '',
        priority: 'medium',
        contactName: '',
        contactEmail: session?.user?.email || '',
        contactPhone: '',
        client: '',
        clientId: '',
      })
      setUploadedFiles([])

      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error: unknown) {
      console.error('Detailed error:', error)

     
      const isApiError = (err: unknown): err is ApiError => {
        return typeof err === 'object' && err !== null && 'response' in err
      }

      if (isApiError(error)) {
        const apiError = error as ApiError
        if (apiError.response?.status === 401) {
          toast.error('Authentication failed. Please log in again.')
        } else if (apiError.response?.status === 403) {
          toast.error('You do not have permission to create tickets.')
        } else if (apiError.response?.status === 413) {
          toast.error('File size too large. Please reduce file sizes.')
        } else if (apiError.response?.data?.message) {
          toast.error(apiError.response.data.message)
        } else {
          toast.error('Failed to create ticket. Please try again.')
        }
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to create ticket. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files
    if (files) {
      const maxFileSize = 10 * 1024 * 1024 
      const validFiles: UploadedFile[] = []
      const invalidFiles: string[] = []

      Array.from(files).forEach((file) => {
        if (file.size > maxFileSize) {
          invalidFiles.push(`${file.name} (too large)`)
        } else {
          validFiles.push({
            file,
            name: file.name,
          })
        }
      })

      if (invalidFiles.length > 0) {
        toast.error(
          `The following files are too large: ${invalidFiles.join(', ')}`
        )
      }

      if (validFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...validFiles])
      }
    }

    event.target.value = ''
  }

  const removeFile = (index: number): void => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  if (!isOpen) return null

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-full sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-gray-200 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Ticket
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the details to create a new support ticket.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex border-b border-gray-200 flex-col sm:flex-row">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium relative transition-colors ${
                activeTab === 'ticketDetails'
                  ? 'text-gray-900 bg-white'
                  : 'text-gray-500 bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('ticketDetails')}
            >
              Ticket Details
              {activeTab === 'ticketDetails' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-500"></div>
              )}
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium relative transition-colors ${
                activeTab === 'clientInfo'
                  ? 'text-gray-900 bg-white'
                  : 'text-gray-500 bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('clientInfo')}
            >
              Client Info
              {activeTab === 'clientInfo' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-500"></div>
              )}
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium relative transition-colors ${
                activeTab === 'advanced'
                  ? 'text-gray-900 bg-white'
                  : 'text-gray-500 bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced
              {activeTab === 'advanced' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-500"></div>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'ticketDetails' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Brief description of the issue"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange('title', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      placeholder="Detailed description of the issue"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange('description', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product *
                      </label>
                      <select
                        value={formData.product}
                        onChange={(e) =>
                          handleInputChange('product', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      >
                        {productOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) =>
                          handleInputChange('priority', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      >
                        {priorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachments
                    </label>

                    <div
                      className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={() =>
                        document.getElementById('file-upload')?.click()
                      }
                    >
                      <svg
                        className="w-8 h-8 text-gray-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      <div className="text-gray-600">Click to upload files</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Max file size: 10MB • Images, Videos, PDFs, Documents
                        supported
                      </div>
                    </div>

                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileUpload}
                    />

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">
                          Selected Files ({uploadedFiles.length}):
                        </h4>
                        {uploadedFiles.map((fileItem, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                          >
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 text-gray-400 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <div>
                                <span className="text-sm text-gray-600 truncate block max-w-xs">
                                  {fileItem.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {(fileItem.file.size / 1024 / 1024).toFixed(
                                    2
                                  )}{' '}
                                  MB
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700 ml-2 p-1"
                              title="Remove file"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'clientInfo' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client
                    </label>
                    <input
                      type="text"
                      value={formData.client}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This field is automatically populated from your account
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      placeholder="Primary contact for this ticket"
                      value={formData.contactName}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Company name (if available) or contact person name
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your email address from your account
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+250 788 123 456"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        handleInputChange('contactPhone', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="text-gray-500 text-center py-20">
                  <svg
                    className="w-12 h-12 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-lg font-medium">Advanced Settings</p>
                  <p className="mt-2">
                    Advanced settings will be available in a future update.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !formData.title ||
                !formData.description ||
                !formData.product
              }
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateTicketModal