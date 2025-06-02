"use client";

import { useSession } from "next-auth/react";
import { Button } from "../../components/ui/Button";
import { PlusIcon } from "@/components/icons";
import { useState } from "react";

const mockStats = [
	{
		name: "Total Tickets",
		value: "145",
		change: "+12.5%",
		changeType: "increase",
		info: "vs last month",
	},
	{
		name: "Open Tickets",
		value: "32",
		change: "-2.3%",
		changeType: "decrease",
		info: "vs last month",
	},
	{
		name: "Average Response",
		value: "2.4h",
		change: "+1.5h",
		changeType: "increase",
		info: "vs last month",
	},
	{
		name: "Customer Satisfaction",
		value: "95%",
		change: "+4.3%",
		changeType: "increase",
		info: "vs last month",
	},
];

const mockRecentTickets = [
	{
		id: "TK-001",
		title: "Login Issue",
		client: "John Doe",
		status: "New",
		priority: "High",
		created: "2025-05-27",
	},
	{
		id: "TK-002",
		title: "Dashboard Not Loading",
		client: "Jane Smith",
		status: "In Progress",
		priority: "Medium",
		created: "2025-05-26",
	},
	{
		id: "TK-003",
		title: "Feature Request",
		client: "Robert Johnson",
		status: "Closed",
		priority: "Low",
		created: "2025-05-25",
	},
];

export default function DashboardPage() {
	const { data: session } = useSession();
	const userName = session?.user?.name || "User";
	const [stats] = useState(mockStats);
	const [recentTickets] = useState(mockRecentTickets);

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
					<Button className="w-full sm:w-auto flex items-center justify-center gap-2">
						<PlusIcon className="w-4 h-4" />
						New Ticket
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat) => (
					<div
						key={stat.name}
						className="bg-white p-6 rounded-xl shadow-sm"
					>
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm font-medium text-gray-600">
									{stat.name}
								</p>
								<p className="text-2xl font-bold text-gray-700 mt-1">
									{stat.value}
								</p>
							</div>
						</div>
						<div
							className={`mt-2 text-sm ${
								stat.changeType === "increase"
									? "text-green-600"
									: "text-red-600"
							}`}
						>
							<span>{stat.change}</span>{" "}
							<span className="text-gray-500">{stat.info}</span>
						</div>
					</div>
				))}
			</div>

			<div className="bg-white rounded-xl shadow-sm p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-lg font-bold text-gray-700">Recent Tickets</h2>
					<Button variant="outline" size="sm">
						View All
					</Button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="text-left text-sm font-medium text-gray-500">
								<th className="pb-4">Ticket ID</th>
								<th className="pb-4">Title</th>
								<th className="pb-4">Client</th>
								<th className="pb-4">Status</th>
								<th className="pb-4">Priority</th>
								<th className="pb-4">Created</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">{recentTickets.map((ticket) => (
								<tr key={ticket.id} className="text-sm text-gray-700">
									<td className="py-4">{ticket.id}</td>
									<td className="py-4">{ticket.title}</td>
									<td className="py-4">{ticket.client}</td>
									<td className="py-4">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												ticket.status === "New"
													? "bg-blue-100 text-blue-700"
													: ticket.status === "In Progress"
													? "bg-yellow-100 text-yellow-700"
													: "bg-gray-100 text-gray-700"
											}`}
										>
											{ticket.status}
										</span>
									</td>
									<td className="py-4">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												ticket.priority === "High"
													? "bg-red-100 text-red-700"
													: ticket.priority === "Medium"
													? "bg-yellow-100 text-yellow-700"
													: "bg-green-100 text-green-700"
											}`}
										>
											{ticket.priority}
										</span>
									</td>
									<td className="py-4 text-gray-500">
										{ticket.created}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
