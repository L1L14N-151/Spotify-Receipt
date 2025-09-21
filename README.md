# 🎵 Spotify Receipt Generator

Transform your Spotify listening history into stylish receipt designs.

## ✨ Features

- 🔐 **Spotify OAuth 2.0** - Secure authentication with PKCE flow
- 📊 **Time Ranges** - Last 4 weeks, 6 months, or all-time
- 🎨 **10 Unique Themes** - CVS, Casino, Breaking Bad, NASA, and more
- 📸 **Export Options** - PNG, JPEG, WebP up to 4K resolution
- 📱 **Responsive** - Works on all devices
- ⚡ **Live Updates** - Real-time theme and track changes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Spotify account
- Spotify Developer App

### Setup

1. **Clone & Install**
```bash
git clone [your-repo-url]
cd spotify-receipt
npm install
```

2. **Configure Spotify App**

   - Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create new app
   - Add redirect URI: `http://127.0.0.1:5173/callback`
   - Copy Client ID

3. **Environment Setup**
```bash
echo "VITE_SPOTIFY_CLIENT_ID=your_client_id" > .env
```

4. **Run**
```bash
npm run dev
```
Open [http://127.0.0.1:5173](http://127.0.0.1:5173)

## 🎨 Themes

- **CVS** - Pharmacy receipt
- **Casino** - Golden Vegas style
- **Breaking Bad** - Los Pollos Hermanos
- **NASA** - Space mission
- **Carrefour** - French supermarket
- **Matrix** - Digital rain
- **McDonald's** - Fast food order
- **Gaming** - Retro arcade
- **Polaroid** - Instant photo
- **GitHub** - Code contribution

## 📦 Scripts

```bash
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview build
```

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite
- CSS Modules
- Spotify Web API
- html2canvas




## 📄 License

MIT