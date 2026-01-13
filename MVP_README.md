# FITR MVP - Quick Start Guide

## Overview
This is an MVP implementation with:
- ✅ Complete Authentication System (Login, Register, JWT)
- ✅ Role-Based Access Control (Admin, Teacher, Student)
- ✅ Hierarchical Approval (Admin→Teacher, Teacher→Student)
- ✅ Assignment System (Create, Submit, Grade)
- ✅ Color Support for Flow Nodes

## Prerequisites
- SQL Server (LocalDB or Express)
- .NET 6 SDK
- Node.js 14+ (for React UI)
- Visual Studio 2022 or VS Code

## Quick Setup (5 minutes)

### 1. Database Setup
```sql
-- Run these in order:
1. Open SQL Server Management Studio
2. Create database: CREATE DATABASE FITR;
3. Run: 00_Master_CreateTables.sql
4. Run: 01_Seed_Data.sql
```

### 2. API Setup
```bash
cd API/Server.Api
dotnet restore
dotnet build

# Install BCrypt package
cd ../Server.Application
dotnet add package BCrypt.Net-Next

# Run API
cd ../Server.Api
dotnet run
```
API will start at: https://localhost:5001

### 3. Create Admin User
Since BCrypt hashing happens in code, you need to create admin through API:

**Option A: Using Postman/curl**
```bash
# Register admin
curl -X POST https://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@fitr.com",
    "password": "admin123",
    "roleName": "Admin"
  }'

# Then manually set IsApproved=1 in database:
UPDATE [User] SET IsApproved=1 WHERE Username='admin';
```

**Option B: Using Database**
1. Register through API first (it will hash password properly)
2. Then run: `UPDATE [User] SET IsApproved=1 WHERE Username='admin';`

### 4. Test Authentication

**Login:**
```bash
POST https://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "admin@fitr.com",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGc...",
  "userId": 1,
  "username": "admin",
  "email": "admin@fitr.com",
  "role": "Admin"
}
```

**Get Current User (requires token):**
```bash
GET https://localhost:5001/api/auth/me
Authorization: Bearer eyJhbGc...
```

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user (Teacher/Student)
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (requires auth)

### Admin (Requires Admin role)
- `GET /api/admin/pending-teachers` - List teachers waiting approval
- `POST /api/admin/approve-teacher/{userId}` - Approve teacher
- `POST /api/admin/reject-teacher/{userId}` - Reject teacher

### Teacher (Requires Teacher role)
- `GET /api/teacher/pending-students` - List students waiting approval
- `POST /api/teacher/approve-student/{userId}` - Approve student
- `POST /api/teacher/reject-student/{userId}` - Reject student
- `POST /api/teacher/assignments` - Create new assignment
- `GET /api/teacher/assignments` - List own assignments
- `GET /api/teacher/submissions/{assignmentId}` - Get submissions for assignment
- `POST /api/teacher/grade-submission` - Grade student submission

### Student (Requires Student role)
- `GET /api/student/assignments` - View available assignments
- `GET /api/student/submission/{assignmentId}` - Get own submission
- `POST /api/student/submit` - Submit assignment

## Testing Workflow

### 1. Admin Workflow
```bash
# Login as admin
POST /api/auth/login
{ "email": "admin@fitr.com", "password": "admin123" }

# Get pending teachers
GET /api/admin/pending-teachers
Authorization: Bearer <admin_token>

# Approve teacher
POST /api/admin/approve-teacher/2
Authorization: Bearer <admin_token>
```

### 2. Teacher Workflow
```bash
# Register as teacher
POST /api/auth/register
{ 
  "username": "teacher1", 
  "email": "teacher@test.com", 
  "password": "pass123",
  "roleName": "Teacher"
}

# After admin approves, login
POST /api/auth/login
{ "email": "teacher@test.com", "password": "pass123" }

# Approve students
GET /api/teacher/pending-students
POST /api/teacher/approve-student/3

# Create assignment
POST /api/teacher/assignments
Authorization: Bearer <teacher_token>
{
  "title": "Task 1",
  "description": "Create a flow",
  "dueDate": "2024-12-31",
  "flowId": 1
}

# View submissions
GET /api/teacher/submissions/1

# Grade submission
POST /api/teacher/grade-submission
{
  "submissionId": 1,
  "score": 95,
  "feedback": "Great work!"
}
```

### 3. Student Workflow
```bash
# Register as student
POST /api/auth/register
{
  "username": "student1",
  "email": "student@test.com",
  "password": "pass123",
  "roleName": "Student"
}

# After teacher approves, login
POST /api/auth/login
{ "email": "student@test.com", "password": "pass123" }

# View assignments
GET /api/student/assignments
Authorization: Bearer <student_token>

# Submit assignment
POST /api/student/submit
{
  "assignmentId": 1,
  "flowId": 2,
  "comments": "Here is my solution"
}

# Check submission status
GET /api/student/submission/1
```

## Architecture

```
API/
├── Server.Api/              # Controllers, Startup, DI
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── AdminController.cs
│   │   ├── TeacherController.cs
│   │   ├── StudentController.cs
│   │   ├── FlowController.cs
│   │   └── ...
│   └── DI/
│       └── AppConfiguration.cs
│
├── Server.Application/      # Services, Business Logic
│   ├── Contracts/
│   │   ├── IAuthService.cs
│   │   ├── IAdminService.cs
│   │   ├── ITeacherService.cs
│   │   └── IStudentService.cs
│   └── Services/
│       ├── AuthService.cs
│       ├── AdminService.cs
│       ├── TeacherService.cs
│       └── StudentService.cs
│
└── Server.Data/             # Repositories, Database
    ├── Contracts/
    │   ├── IUserRepository.cs
    │   ├── IAssignmentRepository.cs
    │   └── ...
    └── Repositories/
        ├── UserRepository.cs
        ├── AssignmentRepository.cs
        └── ...
```

## Security Features

✅ **Password Hashing**: BCrypt with salt (work factor 11)
✅ **JWT Tokens**: HS256 signing, 7-day expiration
✅ **Role-Based Authorization**: [Authorize(Roles = "Admin/Teacher/Student")]
✅ **Approval Workflow**: Users need approval before accessing system
✅ **Secure Claims**: User ID, Email, Username, Role in token

## Common Issues

### 1. BCrypt Package Missing
```bash
cd API/Server.Application
dotnet add package BCrypt.Net-Next
dotnet build
```

### 2. Database Connection Failed
- Check connection string in appsettings.Development.json
- Verify SQL Server is running
- Test connection: `sqlcmd -S localhost -d FITR -E`

### 3. JWT Token Invalid
- Check Jwt:Key in appsettings.json
- Ensure token is passed as: `Authorization: Bearer <token>`
- Token expires after 7 days

### 4. CORS Errors (when UI is added)
- Startup.cs has CORS configured for any origin
- For production, update to specific domain

### 5. Admin Can't Login
- Ensure IsApproved=1 in database
- Check password hash was generated properly
- Try registering fresh admin through API

## Next Steps (UI Implementation)

### React Components Needed:
1. **Auth Pages**
   - Login.tsx
   - Register.tsx
   - AuthContext.tsx (JWT token management)

2. **Admin Dashboard**
   - PendingTeachers.tsx
   - ApproveTeacher.tsx

3. **Teacher Dashboard**
   - PendingStudents.tsx
   - CreateAssignment.tsx
   - ViewSubmissions.tsx
   - GradeSubmission.tsx

4. **Student Dashboard**
   - ViewAssignments.tsx
   - SubmitAssignment.tsx
   - ViewMySubmissions.tsx

### Example Login Component:
```typescript
// src/pages/Login.tsx
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    const response = await fetch('https://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    // Redirect based on role
  };
  
  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};
```

## Current Status

✅ **Backend MVP Complete**
- All API endpoints implemented
- JWT authentication configured
- Role-based authorization working
- BCrypt password hashing
- Assignment workflow complete

⏳ **Frontend Pending**
- React components not yet created
- Can test all APIs with Postman/curl
- UI implementation ready to start

## Support

For issues:
1. Check this README
2. Review SETUP_GUIDE.md for detailed explanations
3. Check PROJECT_PLAN.md for architecture details
4. Test APIs with Postman first before blaming backend

---
**Version**: MVP 1.0
**Last Updated**: 2024
**Status**: Backend Complete, UI Pending
