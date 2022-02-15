import api from './api'
import { type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { Board } from '@/types'

// export function get ( config?: AxiosRequestConfig): Promise<AxiosResponse<User>> {
//   return api.get('/users/me', config)
// }

export function getOne (name: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Board>> {
  return api.get(`/boards/${name}`, config)
}