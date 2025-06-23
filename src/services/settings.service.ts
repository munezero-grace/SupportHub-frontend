import axiosInstance from './axiosInstance'
import type { SlackSettings, ApiResponse, SettingsState } from '../types/settings'
import type { User } from '../types/interfaces'

const getSlackSettings = async (): Promise<ApiResponse<SlackSettings>> => {
  const response = await axiosInstance.get('/settings/slack-integrations')
  return response.data
}

const updateSlackSettings = async (data: SlackSettings): Promise<ApiResponse<SlackSettings>> => {
  const response = await axiosInstance.put('/settings/slack-integration', data)
  return response.data
}

const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await axiosInstance.get('/users')
  return response.data
}

const deleteUser = async (userId: string): Promise<void> => {
  await axiosInstance.delete(`/users/${userId}/soft-delete`)
}



const getUserSettings = async (): Promise<ApiResponse<SettingsState>> => {
  return await axiosInstance.get('/users/profile')
}

const updateUserSettings = async (data: Partial<SettingsState>): Promise<ApiResponse<SettingsState>> => {
  return await axiosInstance.put('/users/profile', data)
}


export default {
  getSlackSettings,
  updateSlackSettings,
  fetchUsers,
  deleteUser,
  axiosInstance,
  getUserSettings,
  updateUserSettings,
}
