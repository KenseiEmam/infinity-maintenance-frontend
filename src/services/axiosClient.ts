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
// instance.interceptors.request.use(
//   (config) => {
//     const user = JSON.parse(localStorage.getItem('auth') || '')
//     if (user) {
//       config.headers.Authorization = `Bearer ${user.access_token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )

export default instance
