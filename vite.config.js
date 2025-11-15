import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Base path must match the exact GitHub repo name (case-sensitive, all lowercase)
export default defineConfig({ plugins:[react()], base:'/affiliate-launchpad/' })