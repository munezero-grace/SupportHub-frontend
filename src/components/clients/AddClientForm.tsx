import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  clientFormSchema,
  type ClientFormData,
} from '../../validations/clientSchema'
import { useCreateClientMutation } from '../../hooks/useQueries'
import { Button } from '../../components/ui/Button'

interface AddClientFormProps {
  onSuccess: () => void
}

export function AddClientForm({ onSuccess }: AddClientFormProps) {
  const [error, setError] = useState('')
  const createClientMutation = useCreateClientMutation()

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      contactEmail: '',
      supportTier: 'standard',
      status: 'active',
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
          await createClientMutation.mutateAsync(data)
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
      };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Company Name
        </label>
        <input
          type="text"
          id="name"
          {...register('companyName')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.companyName.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="contactName"
          className="block text-sm font-medium text-gray-700"
        >
          Contact Name
        </label>
        <input
          type="text"
          id="contactName"
          {...register('contactName')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
        />
        {errors.contactName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.contactName.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="contactEmail"
          className="block text-sm font-medium text-gray-700"
        >
          Contact Email
        </label>
        <input
          type="email"
          id="contactEmail"
          {...register('contactEmail')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
        />
        {errors.contactEmail && (
          <p className="mt-1 text-sm text-red-600">
            {errors.contactEmail.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="supportTier"
          className="block text-sm font-medium text-gray-700"
        >
          Support Tier
        </label>
        <select
          id="supportTier"
          {...register('supportTier')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
        >
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
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
