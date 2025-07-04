# 📝 Todo App

Ứng dụng quản lý công việc (Todo) được xây dựng với stack công nghệ hiện đại.

## 🚀 Công nghệ sử dụng

### Frontend
- **React** với **TypeScript**
- **Tailwind CSS** cho styling
- **Axios** cho HTTP client

### Backend
- **Node.js** với **Express**
- **TypeScript**
- **MongoDB** với **Mongoose**

## 📁 Cấu trúc dự án

```
todo-app/
├── todo-backend/          # Backend API
│   ├── src/
│   │   ├── index.ts       # Entry point
│   │   ├── models/        # MongoDB models
│   │   └── routes/        # API routes
│   └── package.json
└── todo-frontend/         # Frontend React app
    ├── src/
    │   ├── components/    # React components
    │   ├── services/      # API services
    │   └── types/         # TypeScript types
    └── package.json
```

## ⚙️ Cài đặt và chạy dự án

### 1. Cài đặt Backend

```bash
cd todo-backend
npm install
```

### 2. Cấu hình MongoDB

Tạo file `.env` trong thư mục `todo-backend`:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/todo-app?retryWrites=true&w=majority
PORT=5000
```

### 3. Chạy Backend

```bash
cd todo-backend
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`

### 4. Cài đặt Frontend

```bash
cd todo-frontend
npm install
```

### 5. Chạy Frontend

```bash
cd todo-frontend
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🔗 API Endpoints

- `GET /api/tasks` - Lấy danh sách tất cả tasks
- `POST /api/tasks` - Tạo task mới
- `PUT /api/tasks/:id` - Cập nhật task
- `DELETE /api/tasks/:id` - Xóa task

## ✨ Tính năng

- ✅ Thêm task mới
- ✅ Đánh dấu hoàn thành/chưa hoàn thành
- ✅ Xóa task
- ✅ Hiển thị số lượng task hoàn thành
- ✅ Responsive design với Tailwind CSS
- ✅ Error handling và loading states

## 🛠️ Scripts hữu ích

### Backend
```bash
npm run dev      # Chạy development mode
npm run build    # Build production
npm start        # Chạy production
```

### Frontend
```bash
npm start        # Chạy development mode
npm run build    # Build production
npm test         # Chạy tests
```
