'use client'

import { useSession } from 'next-auth/react'
import { Button } from '../../components/ui/Button'
import { PlusIcon } from '@/components/icons'
import { useState, useEffect } from 'react'
import { DashboardTab, DashboardData } from '@/types/dashboard.types'
import { dashboardAPI } from '@/services/dashboard.service'
import DashboardTabs from '@/components/shared/DashboardTabs'
import OverviewTab from '@/components/dashboard/OverviewTab'
import TicketsTab from '@/components/dashboard/TicketsTab'
import ClientsTab from '@/components/dashboard/ClientsTab'
import ProductsTab from '@/components/dashboard/ProductsTab'
import CreateTicketModal from '@/components/tickets/CreateTicketModal'

export default function DashboardPage() {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'Sarah'
  const [activeTab, setActiveTab] = useState<DashboardTab>('Overview')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await dashboardAPI.getAllDashboardData()
      setDashboardData(data)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'Tickets') {
      const interval = setInterval(fetchDashboardData, 30000)
      return () => clearInterval(interval)
    }
  }, [activeTab])

  const handleTicketCreated = async () => {
    await fetchDashboardData()
  }

  const renderTabContent = () => {
    if (!dashboardData && !loading) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No dashboard data available</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )
    }

    switch (activeTab) {
      case 'Overview':
        return (
          <OverviewTab
            data={dashboardData?.overview || null}
            loading={loading}
          />
        )
      case 'Tickets':
        return (
          <TicketsTab data={dashboardData?.tickets || null} loading={loading} />
        )
      case 'Clients':
        return (
          <ClientsTab data={dashboardData?.clients || null} loading={loading} />
        )
      case 'Products':
        return (
          <ProductsTab
            data={dashboardData?.products || null}
            loading={loading}
          />
        )
      default:
        return (
          <OverviewTab
            data={dashboardData?.overview || null}
            loading={loading}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {userName}! Here&apos;s an overview of your support
            operations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="w-full sm:w-auto">
            Export Reports
          </Button>
          <Button
            className="w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            New Ticket
          </Button>
        </div>
      </div>

      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {renderTabContent()}

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  )
}
