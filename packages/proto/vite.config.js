import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {defineConfig} from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                chefAbel: resolve(__dirname, 'Chef-Abel.html'),
                cuisineItalian: resolve(__dirname, 'cuisine-italian.html'),
                garlic: resolve(__dirname, 'garlic.html'),
                groundBeef: resolve(__dirname, 'ground-beef.html'),
                mealplan: resolve(__dirname, 'mealplan.html'),
                noodlesSpaghetti: resolve(__dirname, 'noodles-spaghetti.html'),
                oliveOil: resolve(__dirname, 'olive-oil.html'),
                onion: resolve(__dirname, 'onion.html'),
                recipeSpaghetti: resolve(__dirname, 'Recipe-spaghetti.html'),
                tomato: resolve(__dirname, 'tomato.html'),
                login: resolve(__dirname, 'login.html')
            },
        },
    },
})