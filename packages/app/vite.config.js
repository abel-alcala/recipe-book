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
            "/api": "https://recipe-book-t01m.onrender.com",
            "/auth": "https://recipe-book-t01m.onrender.com/hello",
            "/login": "https://recipe-book-t01m.onrender.com/hello",
            "/register": "https://recipe-book-t01m.onrender.com/hello"
        }
    },
})