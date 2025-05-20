"use client"
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/icons";
import { useDashboardStatsQuery, useTicketsQuery } from "@/hooks/useQueries";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getStatusStyles, getPriorityStyles } from "@/lib/styles";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { 
    data: stats,
    isLoading: isLoadingStats,
    error: statsError
  } = useDashboardStatsQuery();
  
  const {
    data: recentTickets,
    isLoading: isLoadingTickets,
    error: ticketsError
  } = useTicketsQuery();

  const userName = session?.user?.name || "User";
  if (isLoadingStats || isLoadingTickets) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (statsError || ticketsError) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="text-[#DC2626] text-center mb-4">
          Failed to load dashboard data
        </div>
        <Button
          onClick={() => {
            window.location.reload();
          }}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
          <p className="text-[#6B7280]">
            Welcome back, {userName}! Here&apos;s an overview of your support operations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="w-full sm:w-auto">
            Export Reports
          </Button>
          <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-2">
            <PlusIcon className="w-4 h-4" />
            New Ticket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#6B7280]">{stat.name}</p>
                <p className="text-2xl font-bold text-[#111827] mt-1">{stat.value}</p>
              </div>
            </div>
            <div
              className={`mt-2 text-sm ${
                stat.changeType === "increase" ? "text-[#3B82F6]" : "text-[#DC2626]"
              }`}>
              <span>{stat.change}</span>{" "}
              <span className="text-[#6B7280]">{stat.info}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[#111827]">Recent Tickets</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-[#6B7280]">
                <th className="pb-4">Ticket ID</th>
                <th className="pb-4">Title</th>
                <th className="pb-4">Client</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Priority</th>
                <th className="pb-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {recentTickets?.map((ticket) => (
                <tr key={ticket.id} className="text-sm text-[#374151]">
                  <td className="py-4">{ticket.id}</td>
                  <td className="py-4">{ticket.title}</td>
                  <td className="py-4">{ticket.client}</td>
                  <td className="py-4">
                    <span className={getStatusStyles(ticket.status)}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={getPriorityStyles(ticket.priority)}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-4 text-[#6B7280]">{ticket.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
