# 📊 Database Schema Documentation

## Todo App Database Design

### Collections

#### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String (required, 1-200 chars),
  completed: Boolean (default: false),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  description: String (optional, max 1000 chars),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

### Indexes

#### Performance Indexes
1. **createdAt_-1** - For sorting tasks by creation date (descending)
2. **completed_1** - For filtering completed/pending tasks
3. **completed_1_createdAt_-1** - Compound index for filtering and sorting
4. **priority_1** - For filtering by priority
5. **title_text** - Text search index for task titles

### Virtual Fields

#### age
- **Type**: Number (computed)
- **Description**: Age of task in days
- **Formula**: `(Date.now() - createdAt) / (1000 * 60 * 60 * 24)`

### Validation Rules

#### Title
- Required field
- Minimum length: 1 character
- Maximum length: 200 characters
- Trimmed whitespace

#### Description
- Optional field
- Maximum length: 1000 characters
- Trimmed whitespace

#### Priority
- Enum values: 'low', 'medium', 'high'
- Default: 'medium'

### Middleware

#### Pre-save Hook
- Automatically updates `updatedAt` field when document is modified
- Only triggers for existing documents (not new ones)

### Sample Data Structure

```javascript
{
  "_id": "64abc123def456789012345",
  "title": "Học React và TypeScript",
  "completed": false,
  "priority": "high",
  "description": "Hoàn thành khóa học React và TypeScript trên platform online",
  "createdAt": "2025-06-02T14:30:00.000Z",
  "updatedAt": "2025-06-02T14:30:00.000Z",
  "age": 0 // Virtual field
}
```

### Query Patterns

#### Common Queries

1. **Get all tasks (sorted by creation date)**
```javascript
db.tasks.find({}).sort({ createdAt: -1 })
```

2. **Get pending tasks**
```javascript
db.tasks.find({ completed: false }).sort({ createdAt: -1 })
```

3. **Get completed tasks**
```javascript
db.tasks.find({ completed: true }).sort({ createdAt: -1 })
```

4. **Search tasks by title**
```javascript
db.tasks.find({ $text: { $search: "search term" } })
```

5. **Get high priority tasks**
```javascript
db.tasks.find({ priority: "high" }).sort({ createdAt: -1 })
```

6. **Get tasks created today**
```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

db.tasks.find({
  createdAt: {
    $gte: today,
    $lt: tomorrow
  }
}).sort({ createdAt: -1 })
```

### Statistics Queries

#### Task completion rate
```javascript
const totalTasks = db.tasks.countDocuments({});
const completedTasks = db.tasks.countDocuments({ completed: true });
const completionRate = (completedTasks / totalTasks) * 100;
```

#### Tasks by priority
```javascript
db.tasks.aggregate([
  {
    $group: {
      _id: "$priority",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
])
```

#### Tasks created per day (last 7 days)
```javascript
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

db.tasks.aggregate([
  {
    $match: {
      createdAt: { $gte: sevenDaysAgo }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$createdAt"
        }
      },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
])
```

### Backup Strategy

#### Daily Backups
- Automated backup script runs daily
- Backups stored in `/backups` directory
- JSON format with metadata

#### Restore Process
```bash
npm run backup:restore -- backup-file.json
```

### Performance Considerations

1. **Indexes** - All frequently queried fields are indexed
2. **Pagination** - Use limit() and skip() for large datasets
3. **Projection** - Select only needed fields to reduce data transfer
4. **Connection Pooling** - Configured with maxPoolSize: 10

### Security

1. **Validation** - All inputs validated at schema level
2. **Sanitization** - Text fields trimmed and length-limited
3. **Environment Variables** - Database credentials in .env file
4. **Connection Encryption** - SSL enabled for Atlas connection
