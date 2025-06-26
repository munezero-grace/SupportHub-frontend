'use client'
import React, { useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Table } from '@/components/ui/Table'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import settingsService from '@/services/settings.service'
import type { User } from '@/types/interfaces'

const UsersSettings = () => {
  useSession() 
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => settingsService.fetchUsers().then(res => res.data),
  })

  useEffect(() => {
    if (error) {
      toast.error('Error fetching users. Please try again later.')
    }
  }, [error])

  const users: User[] = data ?? []

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => settingsService.deleteUser(userId),
    onSuccess: () => {
      toast.success('User deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Failed to delete user. Please try again later.')
    },
  })

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null)

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setUserToDelete(null)
    setIsDeleteDialogOpen(false)
  }

  const handleDeleteUser = () => {
    if (!userToDelete) return
    deleteUserMutation.mutate(userToDelete.id)
    closeDeleteDialog()
  }

  const columns = [
    {
      header: 'First Name',
      accessor: (user: User) => user.firstName,
    },
    {
      header: 'Last Name',
      accessor: (user: User) => user.lastName,
    },
    {
      header: 'Email',
      accessor: (user: User) => user.email,
    },
    {
      header: 'Role',
      accessor: (user: User) =>
        user.roles
          .map((role) => {
            const formatted = role.replace(/_/g, ' ').toLowerCase()
            return formatted.charAt(0).toUpperCase() + formatted.slice(1)
          })
          .join(', '),
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <ActionMenu
          items={[
            {
              label: 'View Details',
              onClick: () =>
                toast.info('View details of user action triggered'),
            },
            {
              label: 'Edit',
              onClick: () => toast.info('Edit user action triggered'),
            },
            {
              label: 'Delete',
              variant: 'danger',
              onClick: () => openDeleteDialog(user),
            },
          ]}
        />
      ),
    },
  ]

  if (isLoading) {
    return <div className="p-6">Loading users...</div>
  }

  return (
    <>
      <div className="bg-white">
        <div className="p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            User Management
          </h2>
          <p className="text-gray-600 mb-4">
            Manage user accounts and permissions
          </p>
          <form>
            <Table
              data={users}
              columns={columns}
              emptyState={<p>No users found.</p>}
            />
          </form>

          <Dialog
            isOpen={isDeleteDialogOpen}
            onClose={closeDeleteDialog}
            initialFocus={cancelButtonRef as React.RefObject<HTMLElement>}
            title="Delete User"
            description={`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}? This action cannot be undone.`}
          >
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={closeDeleteDialog}
                ref={cancelButtonRef}
              >
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleDeleteUser}>
                Delete
              </Button>
            </div>
          </Dialog>
        </div>
      </div>
    </>
  )
}

export default UsersSettings