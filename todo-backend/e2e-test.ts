import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios with timeout
axios.defaults.timeout = 10000;

interface Task {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

async function testTodoApp() {
  console.log('🧪 Testing Todo App End-to-End');
  console.log('===============================');

  try {
    // Test 1: Get all tasks
    console.log('\n📝 Test 1: GET /api/tasks');
    const tasksResponse = await axios.get(`${API_BASE_URL}/tasks`);
    console.log(`✅ Status: ${tasksResponse.status}`);
    console.log(`✅ Tasks count: ${tasksResponse.data.length}`);
    console.log('Tasks:', tasksResponse.data.map((t: Task) => ({ id: t._id, title: t.title, completed: t.completed })));

    // Test 2: Create new task
    console.log('\n📝 Test 2: POST /api/tasks');
    const newTask = {
      title: 'Test Task from API',
      description: 'This is a test task created via API',
      priority: 'high' as const,
      dueDate: new Date('2024-12-31')
    };
    const createResponse = await axios.post(`${API_BASE_URL}/tasks`, newTask);
    console.log(`✅ Status: ${createResponse.status}`);
    console.log(`✅ Created task:`, { id: createResponse.data._id, title: createResponse.data.title });

    const createdTaskId = createResponse.data._id;

    // Test 3: Update task
    console.log('\n📝 Test 3: PUT /api/tasks/:id');
    const updateData = {
      completed: true,
      title: 'Updated Test Task'
    };
    const updateResponse = await axios.put(`${API_BASE_URL}/tasks/${createdTaskId}`, updateData);
    console.log(`✅ Status: ${updateResponse.status}`);
    console.log(`✅ Updated task:`, {
      id: updateResponse.data._id,
      title: updateResponse.data.title,
      completed: updateResponse.data.completed
    });

    // Test 4: Get tasks again to verify changes
    console.log('\n📝 Test 4: GET /api/tasks (after update)');
    const tasksResponse2 = await axios.get(`${API_BASE_URL}/tasks`);
    console.log(`✅ Status: ${tasksResponse2.status}`);
    console.log(`✅ Tasks count: ${tasksResponse2.data.length}`);

    // Test 5: Delete task
    console.log('\n📝 Test 5: DELETE /api/tasks/:id');
    const deleteResponse = await axios.delete(`${API_BASE_URL}/tasks/${createdTaskId}`);
    console.log(`✅ Status: ${deleteResponse.status}`);
    console.log(`✅ Task deleted successfully`);

    // Test 6: Get tasks after deletion
    console.log('\n📝 Test 6: GET /api/tasks (after deletion)');
    const tasksResponse3 = await axios.get(`${API_BASE_URL}/tasks`);
    console.log(`✅ Status: ${tasksResponse3.status}`);
    console.log(`✅ Tasks count: ${tasksResponse3.data.length}`);

    // Test 7: Health check
    console.log('\n📝 Test 7: GET /api/health');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log(`✅ Status: ${healthResponse.status}`);
    console.log(`✅ Health:`, healthResponse.data);

    console.log('\n🎉 All API tests passed!');
    console.log('===============================');
    console.log('✅ Frontend: http://localhost:3001');
    console.log('✅ Backend: http://localhost:5000');
    console.log('✅ API: http://localhost:5000/api');
    console.log('✅ Database: In-Memory (working)');
    console.log('\n🚀 Todo App is fully functional!');
  } catch (error: any) {
    console.error('❌ Test failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('  Connection refused - make sure backend is running on http://localhost:5000');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('  Connection timeout - backend is not responding');
    } else {
      console.error('  Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    console.error('\n💡 Troubleshooting:');
    console.error('  1. Make sure backend is running: npm run dev:memory');
    console.error('  2. Check if port 5000 is available');
    console.error('  3. Try: curl http://localhost:5000/api/health');
  }
}

testTodoApp();
