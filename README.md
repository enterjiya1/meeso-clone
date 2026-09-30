# 🛍️ Ethnicora - Meesho-Style Ethnic Wear E-Commerce Platform

A production-grade, mobile-first e-commerce web application inspired by **Meesho**, built for seamless browsing, wholesale kurti shopping, live UPI payments (GPay, PhonePe, Paytm, QR Code), real-time delivery tracking, and merchant administration.

---

## 📖 Detailed Project Documentation (સંપૂર્ણ વિગતો)
👉 **પ્રોજેક્ટમાં શું શું છે અને કઈ ટેકનોલોજીનો ઉપયોગ થયો છે તેની સંપૂર્ણ માહિતી માટે [PROJECT_DETAILS.md](./PROJECT_DETAILS.md) ફાઈલ જુઓ.**

---

## ⚡ Quick Summary
- **Frontend**: React 19, Tailwind CSS, Lucide React, Canvas Confetti
- **Routing**: React Router v7 (SPA)
- **Bundler & Server**: Vite 8, Node.js
- **Payment & QR Code**: Native NPCI `upi://pay` deep links, `qrcode` dynamic canvas generation
- **Tunnel & Hosting**: Cloudflare Tunnel (`cloudflared`) via HTTP/2
- **Store Payee**: `MAB.037326003010052@AXISBANK` (`YUG ENTERPRISE`)
- **Admin Panel**: `/admin` for live order tracking & merchant UPI management

---

## 🚀 Commands
```bash
npm install               # Install packages
npm run dev               # Start local dev server
npm run build             # Build production bundle
npm run preview           # Preview production build
```
