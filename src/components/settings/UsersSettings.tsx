'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table } from '@/components/ui/Table'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { useSession } from 'next-auth/react'
import { User } from '@/types/interfaces'

const UsersSettings = () => {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const columns = [
    {
      header: 'Name',
      accessor: (user: User) => `${user.firstName} ${user.lastName}`,
    },
    { header: 'Email', accessor: 'email' as const },
{
  header: 'Role',
  accessor: (user: User) =>
    user.roles
      .map((role) => {
        const formatted = role.replace(/_/g, ' ').toLowerCase();
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
      })
      .join(', '),
},
    {
      header: 'Actions',
      accessor: () => (
        <ActionMenu
          items={[
             {
              label: 'View Details',
              onClick: () => alert('View details of user action triggered'),
            },
            {
              label: 'Edit',
              onClick: () => alert('Edit user action triggered'),
            },
            {
              label: 'Delete',
              variant: 'danger',
              onClick: () => alert('Delete user action triggered'),
            }
          ]}
        />
      ),
    },
  ]

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = session?.user?.accessToken || ''
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        )
        setUsers(response.data.data)
      } catch {
        alert('Error fetching users. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [session])

  if (loading) {
    return <div className="p-6">Loading users...</div>
  }

  return (
    <div className="bg-white">
      <div className="p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          User Management
        </h2>
        <p className="text-gray-600 mb-4">
          Manage user accounts and permissions
        </p>
        <Table
          data={users}
          columns={columns}
          emptyState={<p>No users found.</p>}
        />
      </div>
    </div>
  )
}

export default UsersSettings
