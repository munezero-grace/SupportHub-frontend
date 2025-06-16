import React from 'react'
import { ClientInfoProps } from './TicketTypes'

function ClientInfo({
    formData,
    handleInputChange,
    isAdmin,
    availableClients,
    setFormData
}: ClientInfoProps) {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client
                </label>
                {isAdmin ? (
                    <select
                        value={formData.clientId}
                        onChange={(e) => { 
                            const selectedClient = availableClients.find(c => c.id === e.target.value);
                            if (selectedClient) {
                                const newFormData = {
                                    ...formData,
                                    clientId: selectedClient.id, 
                                    clientCode: selectedClient.clientCode,
                                    client: selectedClient.companyName,
                                    contactName: selectedClient.user.firstName + ' ' + (selectedClient.user.lastName || ''),
                                    contactEmail: selectedClient.user.email,
                                    product: '',
                                };
                                setFormData(newFormData);
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    >
                        <option value="">Select a client</option>
                        {availableClients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.companyName}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="text"
                        value={formData.client}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                )}
                <p className="text-xs text-gray-500 mt-1">
                    {isAdmin
                        ? "Select the client for this ticket"
                        : "This field is automatically populated from your account"}
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                </label>
                <input
                    type="text"
                    placeholder={isAdmin ? "Enter contact name" : ""}
                    value={formData.contactName}
                    readOnly={!isAdmin}
                    onChange={(e) => isAdmin && handleInputChange('contactName', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isAdmin
                        ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        : 'bg-gray-100 cursor-not-allowed'
                        } transition-colors`}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Primary contact person for this ticket
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                </label>
                <input
                    type="email"
                    placeholder={isAdmin ? "Enter contact email" : ""}
                    value={formData.contactEmail}
                    readOnly={!isAdmin}
                    onChange={(e) => isAdmin && handleInputChange('contactEmail', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isAdmin
                        ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        : 'bg-gray-100 cursor-not-allowed'
                        } transition-colors`}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {isAdmin ? "Contact email for this ticket" : "Your email address from your account"}
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
    )
}

export default ClientInfo