# GovCareAI - AI-Powered Government Complaint Management System

GovCareAI is a futuristic, production-level web application designed to revolutionize how citizens interact with government services by leveraging artificial intelligence to prioritize and manage civic complaints.

## 🌐 Live Demo

**GitHub Pages Link:** [https://akashguptapro9247-coder.github.io/govcareai](https://akashguptapro9247-coder.github.io/govcareai)

> **Note:** The frontend is fully functional on GitHub Pages. For complete functionality including database operations, you'll need to deploy the backend separately.

## 🌟 Features

### Frontend (Client-Side)
- **Modern Dark Neon Theme** with electric glowing buttons, particle animations, and glass panels
- **Fully Responsive Design** that works on all devices
- **Futuristic UI Components** with 3D hover effects and smooth transitions
- **Complete Authentication System** for citizens and administrators
- **Interactive Dashboard** with real-time statistics
- **Complaint Management Interface** with advanced filtering and search
- **Geolocation Integration** for automatic location detection
- **File Upload Capability** for attaching evidence photos
- **Multiple Background Themes**:
  - Cyberpunk Theme with enhanced neon circuits and holographic layers
  - GovCareAI Professional Theme with government-grade security visualization
  - Professional Cyber Theme (default) with sophisticated cyber design
  - Classic Dark Theme

### Backend (Server-Side)
- **RESTful API** built with Node.js and Express
- **Database Management** with MySQL and Sequelize ORM
- **User Authentication** with JWT tokens and password hashing
- **AI-Powered Priority Scoring** system for complaints
- **Real-time Data Synchronization** between frontend and database
- **Comprehensive Logging** for audit trails
- **Secure File Handling** for complaint images

### Database
- **Relational Database Design** with normalized tables
- **Index Optimization** for improved query performance
- **Data Integrity Constraints** for consistency
- **Support for Citizens, Admins, and Complaints**

### AI Priority Model
- **Text Analysis** for danger keywords (50% weight)
- **Image Analysis** for visual evidence (20% weight)
- **Location-Based Scoring** for urban/semi/rural areas (30% weight)
- **Automatic Priority Assignment** (HIGH, MODERATE, LOW)

## 📁 Project Structure

```
govcareai/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── citizen-login.html
│   ├── citizen-register.html
│   ├── forgot-password.html
│   ├── report-complaint.html
│   ├── track-complaint.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── cyberpunk-background.html
│   ├── cyberpunk-demo.html
│   ├── govcareai-background.html
│   ├── govcareai-demo.html
│   ├── professional-cyber-bg.html
│   └── professional-cyber-demo.html
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── govcareai.sql
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL database (XAMPP recommended for local development)
- npm or yarn package manager

### Installation with XAMPP (Recommended for Local Development)

1. **Download and Install XAMPP:**
   - Download XAMPP from https://www.apachefriends.org/download.html
   - Install XAMPP with at least Apache and MySQL components

2. **Start XAMPP Services:**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL** services

3. **Place Project Files:**
   - Copy the entire `govcareai` folder to your XAMPP `htdocs` directory
   - Typical path: `C:\xampp\htdocs\govcareai`

4. **Set Up the Database:**
   - Open phpMyAdmin by visiting `http://localhost/phpmyadmin` in your browser
   - Create a new database named `govcareai`
   - Click on the `govcareai` database
   - Go to the "Import" tab
   - Choose the file `C:\xampp\htdocs\govcareai\database\govcareai.sql`
   - Click "Go" to import the database schema

5. **Install Backend Dependencies:**
   - Open Command Prompt or Terminal
   - Navigate to the backend directory:
     ```bash
     cd C:\xampp\htdocs\govcareai\backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

6. **Configure Environment Variables:**
   - The project is already configured to work with XAMPP defaults
   - Database: `govcareai`
   - User: `root`
   - Password: (empty by default in XAMPP)
   - Host: `localhost`
   - Port: `3306`

7. **Start the Backend Server:**
   - In the same terminal, run:
     ```bash
     npm start
     ```
   - The backend will start on port 5000

8. **Access the Website:**
   - Open your browser and visit:
     - Main Website: `http://localhost/govcareai/frontend/index.html`
     - Backend API: `http://localhost:5000`

### Manual Installation (Alternative Method)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd govcareai
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Set up the database:**
   - Create a MySQL database named `govcareai`
   - Execute the SQL scripts in the `database/` folder
   - Update database credentials in `backend/.env`

4. **Start the backend server:**
   ```bash
   npm start
   ```

5. **Open the frontend:**
   - Navigate to `frontend/index.html` in your browser
   - Or serve the frontend directory with a local server

## 🎨 UI/UX Features

### Visual Design
- **Dark Theme** with neon blue, purple, green, and red accents
- **Glassmorphism Cards** with blur effects
- **Electric Glowing Buttons** with hover animations
- **Blink-Pulse Transitions** for priority indicators
- **3D Hover Lift Effects** on interactive elements
- **Cyberpunk Theme** with enhanced cinematic technology background:
  - Enhanced neon blue + neon purple + neon green glowing energy
  - Holographic UI layers floating in depth with stronger visibility
  - Electric circuit patterns with increased opacity
  - Glowing particle effects with brighter luminescence
  - Soft fog with enhanced diffusion
  - Glass panels with stronger neon edges
  - Digital grid with finer detail
  - Waveform pulses with more pronounced movement
  - Light streak reflections with increased intensity
  - Abstract motion blur with enhanced effect
  - High contrast futuristic matrix feel with improved clarity
- **GovCareAI Professional Theme** with government-grade security visualization:
  - Deep navy base with sophisticated dark gradients
  - Subtle neon gradients in teal and turquoise
  - Glass holographic textures with layered depth
  - Thin glowing circuit lines for technical authenticity
  - Deep digital shadows for enhanced dimensionality
  - Satellite HUD overlays for intelligence aesthetics
  - Data wave patterns simulating information flow
  - Fiber optic streaks representing high-speed connectivity
  - Clean grid geometry for structured precision
  - Layered holographic depth for 3D immersion
- **Professional Cyber Theme** (default):
  - Enhanced cyber grid pattern with increased visibility
  - Professional radial gradients with stronger opacity
  - Cyber circuit lines with improved animation
  - Data waves flowing at the bottom with enhanced presence
  - HUD corner elements with bolder styling
  - Center marker with pulsing animation
  - Professional glow effect with faster rotation
  - Digital shadows with enhanced depth perception

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Adaptive components for all screen sizes
- Touch-friendly interface elements

## 🔐 Security Features

- **Password Hashing** with bcrypt
- **JWT Token Authentication**
- **Input Validation** and sanitization
- **SQL Injection Prevention** with Sequelize ORM
- **CORS Protection**
- **Rate Limiting** (implementable)

## 🤖 AI Priority Scoring System

The AI model automatically assigns priority levels to complaints based on:

1. **Text Analysis (50% weight):**
   - Keywords: fire, flood, collapse, electric, sewage, crime, accident, pollution, medical

2. **Image Analysis (20% weight):**
   - Visual recognition of fire, smoke, garbage, broken infrastructure

3. **Location Scoring (30% weight):**
   - Urban areas: +30 points
   - Semi-urban areas: +15 points
   - Rural areas: +5 points

### Priority Determination
- **HIGH PRIORITY:** Score > 75
- **MODERATE PRIORITY:** Score > 40
- **LOW PRIORITY:** Score ≤ 40

## 📊 Database Schema

The system includes the following tables:
- `citizens` - Registered users
- `admin` - Administrative users
- `complaints` - Submitted complaints with AI scores
- `complaint_images` - Attached images
- `complaint_messages` - Communication threads
- `complaint_logs` - Audit trail of changes

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Citizen registration
- `POST /api/auth/login/citizen` - Citizen login
- `POST /api/auth/login/admin` - Admin login
- `POST /api/auth/forgot-password` - Password recovery

### Complaints
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints/my-complaints` - Get citizen's complaints
- `GET /api/complaints/all` - Get all complaints (admin)
- `PUT /api/complaints/:id` - Update complaint (admin)
- `DELETE /api/complaints/:id` - Delete complaint (admin)

### Admin Dashboard
- `GET /api/admin/complaints` - Get complaints with citizen data
- `PUT /api/admin/complaints/:id/status` - Update complaint status
- `PUT /api/admin/complaints/:id/priority` - Update complaint priority
- `POST /api/admin/complaints/:id/message` - Send message to citizen

## 🛠️ Technologies Used

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Custom CSS animations and transitions
- Responsive design with Flexbox and Grid

### Backend
- Node.js with Express.js
- MySQL database with Sequelize ORM
- JWT for authentication
- bcryptjs for password hashing
- multer for file uploads

### DevOps
- dotenv for environment configuration
- nodemon for development
- RESTful API design

## 📱 Pages Included

1. **Homepage** - Entry point with login options and theme toggle
2. **Citizen Login** - Authentication for citizens
3. **Citizen Registration** - New user signup
4. **Forgot Password** - Password recovery
5. **Report Complaint** - Submit new complaints with geolocation
6. **Track Complaint** - View and monitor submitted complaints
7. **Admin Login** - Secure administrative access
8. **Admin Dashboard** - Comprehensive complaint management
9. **Cyberpunk Background** - Dedicated page showcasing the enhanced cinematic background
10. **Cyberpunk Demo** - Interactive demonstration of enhanced cyberpunk background features
11. **GovCareAI Background** - Dedicated page showcasing the professional background
12. **GovCareAI Demo** - Interactive demonstration of professional background features
13. **Professional Cyber Background** - Dedicated page showcasing the enhanced professional cyber background
14. **Professional Cyber Demo** - Interactive demonstration of enhanced professional cyber background features

## 🚀 Future Enhancements

- Real-time WebSocket notifications
- Map integration for complaint locations
- Advanced chart analytics for administrators
- Sound effects for notifications
- Offline storage support
- Enhanced AI image analysis with computer vision
- Multi-language support
- Mobile app development

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 👥 Authors

GovCareAI Development Team

---

*Governing the Government with the Power of Artificial Intelligence*