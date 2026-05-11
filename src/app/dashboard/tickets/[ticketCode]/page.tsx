'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketService } from '@/services/tickets.service'
import { format } from 'date-fns'
import type { PageProps } from '@/types/TicketTypes'
import type { Ticket } from '@/types/interfaces/interface'
import Image from 'next/image'
import { useState } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { PriorityScoreBadge } from '@/components/tickets/PriorityScoreBadge'
import { useNotifications } from '@/context/NotificationContext'

const AGE_SATURATION_DAYS = 14

function ScoreBreakdown({ ticket }: { ticket: Ticket }) {
    if (ticket.priorityScore == null) return null

    const createdMs = new Date(ticket.createdAt || ticket.created || '').getTime()
    const ageDays = Number.isFinite(createdMs)
        ? (Date.now() - createdMs) / (1000 * 60 * 60 * 24)
        : 0
    const ageScore = Math.min(ageDays / AGE_SATURATION_DAYS, 1)
    const emotionScore = ticket.emotionScore ?? 0.5
    const complexityScore = ticket.complexityScore ?? 0.5

    const factors = [
        {
            label: 'Emotion',
            description: 'Tone & urgency in the writing',
            weight: 0.4,
            score: emotionScore,
            barColor: 'bg-rose-400',
            textColor: 'text-rose-600',
        },
        {
            label: 'Complexity',
            description: 'Technical severity & business impact',
            weight: 0.35,
            score: complexityScore,
            barColor: 'bg-amber-400',
            textColor: 'text-amber-600',
        },
        {
            label: 'Age',
            description: `${ageDays.toFixed(1)} days old (saturates at ${AGE_SATURATION_DAYS}d)`,
            weight: 0.25,
            score: ageScore,
            barColor: 'bg-blue-400',
            textColor: 'text-blue-600',
        },
    ]

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-0.5">AI Score Breakdown</h3>
                <p className="text-xs text-gray-400 mb-4">How this ticket&apos;s priority score was computed</p>
                <div className="space-y-4">
                    {factors.map(f => {
                        const contribution = f.score * f.weight
                        return (
                            <div key={f.label}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <div>
                                        <span className="text-sm font-semibold text-gray-700">{f.label}</span>
                                        <span className="text-xs text-gray-400 ml-2">{Math.round(f.weight * 100)}% weight</span>
                                    </div>
                                    <span className={`text-xs font-bold ${f.textColor}`}>
                                        {f.score.toFixed(2)} &rarr; +{contribution.toFixed(2)}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${f.barColor} rounded-full`}
                                        style={{ width: `${f.score * 100}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-0.5">{f.description}</p>
                            </div>
                        )
                    })}
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500">Total Score</span>
                        <span className="text-sm font-bold text-gray-900">{ticket.priorityScore.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function TicketDetailsPage({ params }: PageProps) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { ticketCode } = React.use(params)
    const ticketId = ticketCode
    const [selectedStatus, setSelectedStatus] = useState('')
    const { user } = useCurrentUser();
    const isAdmin = user?.role === 'super_admin' || user?.role === 'ticket_manager'
    const { addNotification } = useNotifications()
    const { data: response, isLoading } = useQuery<{ data: Ticket } | Ticket>({
        queryKey: ['ticket', ticketId],
        queryFn: () => ticketService.getTicketById(ticketId),
        retry: 1
    })
    React.useEffect(() => {
        if (response) {
            const ticketData = 'data' in response ? response.data : response
            setSelectedStatus(ticketData.status || '')
        }
    }, [response])
    const updateMutation = useMutation({
        mutationFn: (updateData: { status?: string; priority?: string }) =>
            ticketService.updateTicket(ticketId, updateData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] })
            const updatedTicket = data?.data || data
            setSelectedStatus(updatedTicket.status || '')
            addNotification({
                type: 'status_change',
                title: 'Status Updated',
                description: `"${updatedTicket.title}" was changed to ${(updatedTicket.status || '').replace(/_/g, ' ')}.`,
            })
        }
    })
    const handleUpdateTicket = () => {
        if (!selectedStatus) return
        updateMutation.mutate({ status: selectedStatus })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (!response) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-semibold text-gray-900">Ticket not found</h1>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-sm text-gray-600 hover:text-gray-900"
                >
                    Go back
                </button>
            </div>
        )
    }

    const ticket = 'data' in response ? response.data : response

    const formatDate = (dateString?: string) => {
        if (!dateString) return ''
        return format(new Date(dateString), 'MMM d, yyyy \'at\' h:mm a')
    }

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            new: 'bg-blue-100 text-blue-800',
            active: 'bg-green-100 text-green-800',
            in_progress: 'bg-blue-500 text-white',
            assigned: 'bg-purple-100 text-purple-800',
            awaiting_client: 'bg-orange-100 text-orange-800',
            pending: 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-gray-100 text-gray-800',
            closed: 'bg-red-100 text-red-800',
        }
        return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
    }

    const formatStatusDisplay = (status: string) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex items-center mb-8 gap-3">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-500 hover:text-gray-700 transition-colors p-1"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {ticket.ticketCode}
                    </h1>
                    <span
                        className={`${getStatusColor(
                            ticket.status
                        )} px-3 py-1 rounded-2xl text-sm font-medium capitalize`}
                    >
                        {formatStatusDisplay(ticket.status)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {ticket.title}
                            </h2>
                            <div className="text-sm font-medium text-gray-600 mb-4">
                                <span>Reported by </span>
                                <span className="font-medium text-gray-600">
                                    {typeof ticket.client === 'object' && ticket.client
                                        ? ticket.client.companyName
                                        : typeof ticket.client === 'string'
                                            ? ticket.client
                                            : 'Unknown Client'}
                                </span>
                                <span> on </span>
                                <span className="text-gray-600">
                                    {formatDate(ticket.createdAt || ticket.created)}
                                </span>
                            </div>

                            <div className="text-gray-800 text-sm font-medium leading-relaxed mb-4">
                                {ticket.description || 'No description provided.'}
                            </div>

                            {ticket.tags && ticket.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {Array.isArray(ticket.tags) && ticket.tags.map((tag: string | { name: string }, index: number) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                                        >
                                            {typeof tag === 'object' && tag !== null ? tag.name : tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {ticket.imageUrl && (
                        <div className="mt-5 bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attached Image</h3>
                            <div className="relative w-full h-[400px]">
                                <Image
                                    src={ticket.imageUrl}
                                    alt="Ticket attachment"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Ticket Details</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-600">Status</span>
                                    <span
                                        className={`${getStatusColor(
                                            ticket.status
                                        )} px-2.5 py-1 rounded-2xl text-xs font-semibold capitalize`}
                                    >
                                        {formatStatusDisplay(ticket.status)}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-600">Priority Score</span>
                                        {ticket.lastScoredAt && (
                                            <span className="text-[10px] text-gray-400">
                                                scored {formatDate(ticket.lastScoredAt)}
                                            </span>
                                        )}
                                    </div>
                                    <PriorityScoreBadge score={ticket.priorityScore} variant="detailed" />
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-600">Client</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {typeof ticket.client === 'object' && ticket.client
                                            ? ticket.client.companyName
                                            : typeof ticket.client === 'string'
                                                ? ticket.client
                                                : 'Unknown Client'}
                                    </span>
                                </div>
                                {ticket.product && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-700">Product</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {typeof ticket.product === 'object' && ticket.product.name
                                                ? ticket.product.name
                                                : typeof ticket.product === 'string'
                                                    ? ticket.product
                                                    : 'No product assigned'}
                                        </span>
                                    </div>
                                )}

                                {ticket.UserTickets && ticket.UserTickets.length > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">Assignee</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {ticket.UserTickets[0].user.firstName} {ticket.UserTickets[0].user.lastName}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700">Created</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {formatDate(ticket.createdAt || ticket.created)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-600">Updated</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {formatDate(ticket.lastUpdated || ticket.createdAt)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-600">Due Date</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {formatDate(ticket.dueDate)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ScoreBreakdown ticket={ticket} />
                    {isAdmin && (
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>

                            <div className="space-y-3">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                >
                                    <option value="">Select Status</option>
                                    <option value="new">New</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="awaiting_client">Awaiting Client</option>
                                    <option value="resolved">Resolved</option>
                                </select>

                                <button
                                    onClick={handleUpdateTicket}
                                    disabled={updateMutation.isPending || !selectedStatus}
                                    className="w-full px-4 py-2 bg-black text-white rounded-lg text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updateMutation.isPending ? 'Updating...' : 'Update Ticket'}
                                </button>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
}