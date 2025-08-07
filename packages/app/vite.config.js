import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                register: resolve(__dirname, 'register.html')
            }
        }
    },

    server: {
        proxy: {
            "/api": process.env.VITE_API_URL,
            "/auth": process.env.VITE_API_URL,
            "/login": process.env.VITE_API_URL,
            "/register": process.env.VITE_API_URL
        }
    },
})