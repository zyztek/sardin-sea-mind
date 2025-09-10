# SARDIN-AI Maritime Intelligence Dashboard

<p align="center">
  <img src="public/pwa-512x512.png" alt="SARDIN-AI Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Advanced Maritime Intelligence & Navigation System</strong><br>
  Professional-grade maritime dashboard with AI-powered insights for navigation, fishing operations, and vessel management.
</p>

## 🌊 Features

### Core Maritime Intelligence
- **Real-time Navigation**: GPS tracking, waypoint management, and route optimization
- **AI-Powered Insights**: Machine learning algorithms for fishing zone predictions and weather analysis  
- **Sensor Integration**: Live monitoring of vessel systems, environmental conditions, and equipment status
- **Multi-Vessel Management**: Fleet tracking and coordination capabilities

### Advanced Capabilities
- **Offline Mode**: Continue operations without internet connectivity
- **PWA Support**: Install as native app on desktop and mobile devices
- **Real-time Sync**: Automatic data synchronization with cloud systems
- **Role-based Access**: Captain, Engineer, Navigator, and Observer user roles

### Security & Compliance
- **Enterprise Security**: Row-level security, encrypted data transmission
- **Maritime Standards**: Compliant with international maritime safety protocols
- **Audit Logging**: Complete system activity tracking and reporting
- **Backup Systems**: Redundant data storage and recovery procedures

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Modern web browser with PWA support
- Internet connection for initial setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd sardin-ai-maritime
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the dashboard**
   Open [http://localhost:8080](http://localhost:8080) in your browser

## 🔧 Production Deployment

### Environment Setup
```bash
# Production build
npm run build

# Preview production build
npm run preview

# Deploy via Lovable
# Visit https://lovable.dev/projects/647fe600-0594-4655-aaad-489f8fbe6786
# Click Share -> Publish
```

### Required Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ENV=production
VITE_MARITIME_SYSTEM_NAME=SARDIN-AI
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom maritime design system
- **Shadcn/UI** components for consistent interface
- **Lucide React** for professional iconography

### Backend & Database
- **Supabase** for real-time database and authentication
- **PostgreSQL** with Row Level Security (RLS)
- **Real-time subscriptions** for live data updates
- **Edge Functions** for custom business logic

### Production Features
- **PWA Support** with service workers and offline mode
- **Security Headers** for enhanced protection
- **Error Logging** and performance monitoring
- **Responsive Design** optimized for maritime operations

## 🎯 User Roles & Access

### Authentication Required
Users must sign up and authenticate to access the maritime dashboard. Four role types are supported:

- **Captain**: Full system access and fleet management
- **Engineer**: System diagnostics and equipment monitoring  
- **Navigator**: Route planning and navigation systems
- **Observer**: Read-only access for training purposes

## 📱 Progressive Web App Features

- **Offline Functionality**: Core navigation features work without internet
- **Native Installation**: Install directly from browser
- **Background Sync**: Automatic updates when connectivity returns
- **Responsive Design**: Optimized for tablets and mobile devices

## 🚢 Maritime Dashboard Sections

1. **Overview**: AI insights, system status, quick actions
2. **Navigation**: Interactive map, waypoints, route planning
3. **Analytics**: Performance metrics and trend analysis
4. **Real-time**: Live sensor data and system monitoring
5. **Reports**: Data export and historical analysis
6. **Testing**: System diagnostics and performance tests
7. **Settings**: User preferences and system configuration
