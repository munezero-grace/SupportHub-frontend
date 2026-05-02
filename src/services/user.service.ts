import axiosInstance from './axios-instance.service'

export const userService = {
  async getAll() {
    const response = await axiosInstance.get('/users')
    return response.data.data
  },
  async softDelete(userId: string) {
    await axiosInstance.delete(`/users/${userId}/soft-delete`)
  },
}
