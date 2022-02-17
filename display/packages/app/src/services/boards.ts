import api from './api'
import { type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { Board } from '@/types'

// get
export function getOne (name: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Board>> {
  return api.get(`/boards/${name}`, config)
}

// post 
type  BoardCreateReqBody = Pick<Board, 'name'>
export function createOne (data: BoardCreateReqBody, config?: AxiosRequestConfig): Promise<AxiosResponse<Board>> {
  return api.post('/boards', data, config)
}

