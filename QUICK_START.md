# FITR - Complete Setup & Run Guide

## 📋 Prerequisites

- **SQL Server** (LocalDB или полная версия)
- **.NET 6 SDK**
- **Node.js** (v14+)

## 🗄️ Database Setup

### Step 1: Create Database with All Data
```sql
-- Execute in SQL Server Management Studio
:r c:\Other\fitr-master\script2.sql
```
This creates:
- Database: `Splate`
- All tables (Platform, Node, Pin, Flow, etc.)
- Complete seed data (~2000+ rows)

### Step 2: Add Color Support for Nodes
```sql
:r c:\Other\fitr-master\ADD_COLOR_COLUMN.sql
```
Adds `Color` column to `Flow_Node` table for subflow visualization.

### Step 3: Add Authentication Tables
```sql
:r c:\Other\fitr-master\ADD_AUTH_TABLES.sql
```
Creates:
- `User_Role` (Admin, Teacher, Student)
- `User`
- `Assignment`
- `Assignment_Submission`
- Temporary admin user (email: admin@fitr.local)

## 🚀 API Setup

### Step 1: Check Connection String
Open `API/Server.Api/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=Splate;Trusted_Connection=True;..."
  }
}
```
Update `Server=` if needed (e.g., `localhost\\SQLEXPRESS` or `.\\SQLEXPRESS`).

### Step 2: Run API
```bash
cd API/Server.Api
dotnet run
```
API will start on `http://localhost:5000`

### Step 3: Initialize Admin Password
```bash
# Using curl or Postman
POST http://localhost:5000/api/auth/init-admin
Content-Type: application/json

{
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin password initialized successfully. You can now login."
}
```

## 🎨 UI Setup

### Step 1: Install Dependencies
```bash
cd UI
npm install
```

### Step 2: Run UI
```bash
npm start
```
UI will open at `http://localhost:3000`

## 🔐 Authentication Flow

### 1. Login as Admin
- Navigate to `http://localhost:3000/login`
- Email: `admin@fitr.local`
- Password: `admin123` (or what you set via API)
- You'll be redirected to `/admin` dashboard

### 2. Register New Users
- Navigate to `http://localhost:3000/signup`
- Select role: **Teacher** or **Student**
- Fill form and submit
- Status: "Pending approval"

### 3. Admin Approves Teachers
- Admin dashboard shows pending teachers
- Click "Approve" to grant access
- Teacher can now login

### 4. Teacher Approves Students
- Teacher dashboard shows pending students
- Click "Approve" to grant access
- Student can now login

## 📊 User Roles & Permissions

| Role | Can Do | Dashboard |
|------|--------|-----------|
| **Admin** | Approve/reject teachers | `/admin` |
| **Teacher** | Approve/reject students, create assignments | `/teacher` |
| **Student** | View/submit assignments | `/student` |
| **All** | Access flows, platforms, runs | `/flows`, `/platforms`, `/run` |

## ✨ Features Implemented

### 🎨 Color-Coded Subflows
- Nodes from different subflows get unique colors
- Algorithm: Golden angle (137.508°) for even distribution
- Regular nodes: Light gray (#f0f0f0)
- Subflow nodes: Pastel HSL colors

### 🔐 Full Authentication System
- JWT tokens (7-day expiration)
- BCrypt password hashing
- Role-based access control
- Approval workflow:
  - Admin → Teacher approval
  - Teacher → Student approval

### 👥 User Management
- Registration with email validation
- Profile display in navbar
- Logout functionality
- Protected routes per role

## 🧪 Testing the System

### Test Flow:
1. **Admin Login** → Approve a teacher
2. **Teacher Login** → Approve a student
3. **Student Login** → View dashboard
4. **All roles** → Navigate to Flows page
5. **Test Subflows** → Add Flow as subflow, see colors

### Test Accounts:
```
Admin:
  Email: admin@fitr.local
  Pass: admin123

Create your own Teacher/Student via /signup
```

## 🐛 Troubleshooting

### Database Connection Error
```
Server=localhost\\SQLEXPRESS;Database=Splate;...
```
Try different server names:
- `localhost`
- `localhost\\SQLEXPRESS`
- `.\\SQLEXPRESS`
- `(localdb)\\MSSQLLocalDB`

### API Port Already in Use
Edit `API/Server.Api/Properties/launchSettings.json`:
```json
"applicationUrl": "http://localhost:5001"
```

### CORS Error in UI
API already configured for `http://localhost:3000`. If UI runs on different port, update `API/Server.Api/Startup.cs`:
```csharp
.AllowAnyOrigin()
```

### "Invalid column name 'Color'"
Run `ADD_COLOR_COLUMN.sql` again.

### "Admin user not found"
Run `ADD_AUTH_TABLES.sql` to create tables and admin user.

### Can't Login - "Pending Approval"
- Teachers need Admin approval
- Students need Teacher approval
- Check `IsApproved` flag in User table

## 📁 Important Files

### Database Scripts:
- `script2.sql` - Main database with data
- `ADD_COLOR_COLUMN.sql` - Add Color support
- `ADD_AUTH_TABLES.sql` - Add authentication

### API:
- `Startup.cs` - JWT configuration
- `Controllers/AuthController.cs` - Login/Register
- `Controllers/AdminController.cs` - Teacher management
- `Controllers/TeacherController.cs` - Student management
- `Controllers/StudentController.cs` - Assignments

### UI:
- `auth/login/LoginPage.tsx` - Login form
- `auth/signUp/SignUpPage.tsx` - Registration form
- `auth/admin/AdminDashboard.tsx` - Admin panel
- `auth/teacher/TeacherDashboard.tsx` - Teacher panel
- `auth/student/StudentDashboard.tsx` - Student panel
- `flows/Flow.tsx` - Color generation logic
- `flows/components/Node/Node.tsx` - Node rendering with colors

## 🎯 Next Steps

- [ ] Implement Assignment creation (Teacher)
- [ ] Implement Assignment submission (Student)
- [ ] Implement Grading system (Teacher)
- [ ] Add password reset functionality
- [ ] Add email notifications
- [ ] Enhance UI/UX for dashboards

## 📞 Support

Check these files for detailed info:
- `SETUP_GUIDE.md` - Original setup guide
- `COLOR_FEATURE_GUIDE.md` - Color feature documentation
- `IMPLEMENTATION_STATUS.md` - What's implemented
- `MVP_README.md` - API endpoints reference

---

**🎉 You're all set! The system is ready to use.**
