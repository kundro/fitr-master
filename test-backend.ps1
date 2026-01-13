# Backend Test Script
# Run this after setting up database and starting API

Write-Host "===== FITR MVP Backend Test =====" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://localhost:5001"
$adminEmail = "admin@fitr.com"
$adminPassword = "admin123"

# Test 1: Register Teacher
Write-Host "Test 1: Registering Teacher..." -ForegroundColor Yellow
$teacherBody = @{
    username = "teacher1"
    email = "teacher@test.com"
    password = "pass123"
    roleName = "Teacher"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $teacherBody -ContentType "application/json" -SkipCertificateCheck
    Write-Host "✓ Teacher registered successfully" -ForegroundColor Green
    Write-Host "  User ID: $($response.userId)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to register teacher: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Register Student
Write-Host "Test 2: Registering Student..." -ForegroundColor Yellow
$studentBody = @{
    username = "student1"
    email = "student@test.com"
    password = "pass123"
    roleName = "Student"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $studentBody -ContentType "application/json" -SkipCertificateCheck
    Write-Host "✓ Student registered successfully" -ForegroundColor Green
    Write-Host "  User ID: $($response.userId)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to register student: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Login as Admin (must be approved first)
Write-Host "Test 3: Admin Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $adminEmail
    password = $adminPassword
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -SkipCertificateCheck
    $adminToken = $response.token
    Write-Host "✓ Admin logged in successfully" -ForegroundColor Green
    Write-Host "  Token: $($adminToken.Substring(0, 20))..." -ForegroundColor Gray
    
    # Test 4: Get Current User
    Write-Host ""
    Write-Host "Test 4: Getting Current User..." -ForegroundColor Yellow
    $headers = @{
        Authorization = "Bearer $adminToken"
    }
    $currentUser = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method Get -Headers $headers -SkipCertificateCheck
    Write-Host "✓ Current user retrieved" -ForegroundColor Green
    Write-Host "  Username: $($currentUser.username)" -ForegroundColor Gray
    Write-Host "  Email: $($currentUser.email)" -ForegroundColor Gray
    Write-Host "  Role: $($currentUser.role)" -ForegroundColor Gray
    
    # Test 5: Get Pending Teachers
    Write-Host ""
    Write-Host "Test 5: Getting Pending Teachers..." -ForegroundColor Yellow
    $pendingTeachers = Invoke-RestMethod -Uri "$baseUrl/api/admin/pending-teachers" -Method Get -Headers $headers -SkipCertificateCheck
    Write-Host "✓ Pending teachers retrieved" -ForegroundColor Green
    Write-Host "  Count: $($pendingTeachers.Count)" -ForegroundColor Gray
    
    if ($pendingTeachers.Count -gt 0) {
        $teacherId = $pendingTeachers[0].id
        Write-Host "  First Teacher: $($pendingTeachers[0].username)" -ForegroundColor Gray
        
        # Test 6: Approve Teacher
        Write-Host ""
        Write-Host "Test 6: Approving Teacher..." -ForegroundColor Yellow
        Invoke-RestMethod -Uri "$baseUrl/api/admin/approve-teacher/$teacherId" -Method Post -Headers $headers -SkipCertificateCheck | Out-Null
        Write-Host "✓ Teacher approved successfully" -ForegroundColor Green
    }
    
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "NOTE: If admin login fails, make sure to:" -ForegroundColor Yellow
    Write-Host "1. Register admin through API first" -ForegroundColor Yellow
    Write-Host "2. Run this SQL: UPDATE [User] SET IsApproved=1 WHERE Username='admin'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===== Test Complete =====" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check all tests passed" -ForegroundColor Gray
Write-Host "2. If admin login failed, follow instructions above" -ForegroundColor Gray
Write-Host "3. Test remaining endpoints with Postman" -ForegroundColor Gray
Write-Host "4. Start building React UI" -ForegroundColor Gray
