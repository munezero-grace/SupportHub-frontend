"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { handleError } from "@/lib/error-utils";
import { Settings } from "@/types/interfaces/interface";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<Settings>({
    fullName: "",
    email: "",
    emailNotifications: true,
    slackNotifications: true,
  });

  useEffect(() => {
    if (session && session.user) {
      setSettings((prev) => ({
        ...prev,
        fullName: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
      }));
    }
  }, [session]);

  const handleSettingChange = (field: keyof Settings) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } catch (error) {
      handleError(error, 'save-settings');
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Please sign in to view your settings.</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-700">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-700">Profile Settings</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mr-6"></div>
              <div>
                <h3 className="font-medium text-gray-700">Profile Picture</h3>
                <p className="text-sm text-gray-500 mt-1">Update your profile picture</p>
                <Button type="button" variant="outline" size="sm" className="mt-2">
                  Change Photo
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={settings.fullName}
                  onChange={handleSettingChange("fullName")}
                  className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-700">Notification Settings</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Email Notifications</h3>
                  <p className="text-sm text-gray-500 mt-1">Receive email updates about your tickets</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.emailNotifications}
                    onChange={handleSettingChange("emailNotifications")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Slack Notifications</h3>
                  <p className="text-sm text-gray-500 mt-1">Get real-time updates in Slack</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.slackNotifications}
                    onChange={handleSettingChange("slackNotifications")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-700">Integrations</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#4A154B] rounded-lg flex items-center justify-center text-white">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-700">Slack</h3>
                  <p className="text-sm text-gray-500">Connected</p>
                </div>
              </div>
              <Button type="button" variant="outline">Configure</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#7B68EE] rounded-lg flex items-center justify-center text-white">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.16 4.61A6.27 6.27 0 0 0 12 4a6.27 6.27 0 0 0-8.16 9.48l7.45 7.45a1 1 0 0 0 1.42 0l7.45-7.45a6.27 6.27 0 0 0 0-8.87zM12 17l-6.75-6.75a4.27 4.27 0 1 1 6.75-4.25 4.27 4.27 0 1 1 6.75 4.25z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-700">ClickUp</h3>
                  <p className="text-sm text-gray-500">Connected</p>
                </div>
              </div>
              <Button type="button" variant="outline">Configure</Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  )
}
