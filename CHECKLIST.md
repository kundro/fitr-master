# ✅ FITR Setup Checklist

## Database Setup
- [ ] Run `script2.sql` - Create database + all data
- [ ] Run `ADD_COLOR_COLUMN.sql` - Add Color support
- [ ] Run `ADD_AUTH_TABLES.sql` - Add auth tables

## API Setup  
- [ ] Check connection string in `appsettings.Development.json`
- [ ] Run: `cd API/Server.Api && dotnet run`
- [ ] Initialize admin: `POST http://localhost:5000/api/auth/init-admin` with `{"password": "admin123"}`

## UI Setup
- [ ] Run: `cd UI && npm install`
- [ ] Run: `npm start`
- [ ] Open: `http://localhost:3000`

## Test Authentication
- [ ] Login as admin: `admin@fitr.local` / `admin123`
- [ ] Register teacher via `/signup`
- [ ] Admin approves teacher
- [ ] Register student via `/signup`  
- [ ] Teacher approves student
- [ ] Test all dashboards

## Test Features
- [ ] Open any Flow
- [ ] Add another Flow as subflow
- [ ] Verify nodes have different colors
- [ ] Save Flow and reload - colors persist

## All Done! 🎉
