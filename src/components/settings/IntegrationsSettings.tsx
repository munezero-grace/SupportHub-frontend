'use client'
import React, { useState } from 'react'
import { notificationEvents } from '../../constants/integrationEvents'

const IntegrationsSettings = () => {
  const [slackSettings, setSlackSettings] = useState({
    webhookUrl: 'https://hooks.slack.com/services/...',
    defaultChannel: '#support',
    newTickets: false,
    ticketAssignments: false,
    statusChanges: false,
  })

  const handleSlackChange = (
    field: keyof typeof slackSettings,
    value: string | boolean
  ) => {
    setSlackSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {}

  return (
    <div className="bg-white">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Slack Integration
        </h2>
        <p className="text-gray-600 mb-6">
          Configure Slack notifications for ticket events
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slack Webhook URL
            </label>
            <input
              type="text"
              value={slackSettings.webhookUrl}
              onChange={(e) => handleSlackChange('webhookUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Channel
            </label>
            <input
              type="text"
              value={slackSettings.defaultChannel}
              onChange={(e) =>
                handleSlackChange('defaultChannel', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Notification Events
            </p>
            <div className="space-y-3">
              {notificationEvents.map(({ label, field }) => (
                <label
                  key={field}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <div
                    onClick={() =>
                      handleSlackChange(
                        field as keyof typeof slackSettings,
                        !slackSettings[field as keyof typeof slackSettings]
                      )
                    }
                    className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out border border-gray-400 ${
                      slackSettings[field as keyof typeof slackSettings]
                        ? 'bg-white'
                        : 'bg-black'
                    }`}
                    style={{
                      backgroundColor: slackSettings[
                        field as keyof typeof slackSettings
                      ]
                        ? '#fff'
                        : '#000',
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${
                        slackSettings[field as keyof typeof slackSettings]
                          ? 'translate-x-6 bg-black'
                          : 'bg-white'
                      }`}
                    />
                  </div>
                  <span className="select-none">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntegrationsSettings
