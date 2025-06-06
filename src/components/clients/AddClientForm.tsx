import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  clientFormSchema,
  type ClientFormData,
} from '@/validations/clientSchema'
import { useCreateClientMutation } from '@/hooks/useQueries'
import { Button } from '@/components/ui/Button'
import { SupportTier, Status, AddClientFormProps } from '@/types/clients'

export function AddClientForm({ onSuccess }: AddClientFormProps) {
  const [error, setError] = useState('')
  const createClientMutation = useCreateClientMutation()

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      contactEmail: '',
      supportTier: SupportTier.Standard,
      status: Status.Active,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const submitForm = async (data: ClientFormData) => {
    try {
      setError('')
      await createClientMutation.mutateAsync({
        ...data,
        supportTier: data.supportTier as SupportTier,
        status: data.status as Status,
      })
      onSuccess()
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const apiError = err as {
          response?: { data?: { message?: string } }
        }
        setError(
          apiError.response?.data?.message ||
            'Failed to create client. Please try again.'
        )
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to create client. Please try again.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      <InputField
        id="companyName"
        label="Company Name"
        register={register}
        error={errors.companyName?.message}
      />

      <InputField
        id="contactName"
        label="Contact Name"
        register={register}
        error={errors.contactName?.message}
      />

      <InputField
        id="contactEmail"
        label="Contact Email"
        type="email"
        register={register}
        error={errors.contactEmail?.message}
      />

      <SelectField
        id="supportTier"
        label="Support Tier"
        register={register}
        options={SupportTier}
      />

      <SelectField
        id="status"
        label="Status"
        register={register}
        options={Status}
      />

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <Button
          type="submit"
          disabled={isSubmitting || createClientMutation.isPending}
          loading={isSubmitting || createClientMutation.isPending}
          variant="primary"
          className="col-start-2"
        >
          Create Client
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onSuccess}
          disabled={createClientMutation.isPending}
          className="col-start-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

interface FieldProps {
  id: keyof ClientFormData
  label: string
  register: ReturnType<typeof useForm<ClientFormData>>['register']
  type?: string
  error?: string
}

function InputField({ id, label, register, type = 'text', error }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...register(id)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

interface SelectFieldProps {
  id: keyof ClientFormData
  label: string
  register: ReturnType<typeof useForm<ClientFormData>>['register']
  options: Record<string, string>
}

function SelectField({ id, label, register, options }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        {...register(id)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
      >
        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={value}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )
}
