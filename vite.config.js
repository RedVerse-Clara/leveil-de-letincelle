import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                chapter1: resolve(__dirname, 'chapitre/les-cendres-de-pradwyn/index.html'),
                chapter2: resolve(__dirname, 'chapitre/lecho-sous-la-pierre/index.html'),
                blog: resolve(__dirname, 'blog/index.html'),
                univers: resolve(__dirname, 'univers/index.html'),
            },
        },
    },
})
