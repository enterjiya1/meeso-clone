import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { razorpayPaymentLinkPlugin } from './server/razorpayPaymentLinkPlugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
  plugins: [
    react(),
    razorpayPaymentLinkPlugin({
      keyId: env.RAZORPAY_KEY_ID,
      keySecret: env.RAZORPAY_KEY_SECRET
    })
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true // Allows tunnels, local IP, and public domains
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: true
  }
  }
})
