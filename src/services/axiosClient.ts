import axios from 'axios'
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_API_KEY,
  },
})
instance.interceptors.request.use(
  (response) => response,
  (error) => {
    const backendMessage = error?.response?.data?.error || error?.response?.data?.message

    // 🔥 force replace AxiosError completely
    return Promise.reject(new Error(backendMessage || 'Unauthorized'))
  },
)

export default instance
