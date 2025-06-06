import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { databases,ID } from '@/Backend/appwrite';  // นำเข้า appwrite client

const databaseId = '68407f8e002e90c20382'; // ID ของฐานข้อมูล
const collectionId = '68407fb800311d3d1fb9'; // ID ของคอลเลกชัน   

export default function App() {
  const [task, setTask] = useState('');         // สำหรับ input ที่ผู้ใช้พิมพ์
  const [todos, setTodos] = useState<any[]>([]);     // รายการ to-do ทั้งหมด
  const [isEditing, setIsEditing] = useState(false); //Editing task
  const [editingId, setEditingId] = useState<string | null>(null); // ID ของ task ที่กำลังแก้ไข  

  useEffect(() => {
    loadTasks(); // โหลด tasks เมื่อเริ่มต้นแอป
  }, []);

  const loadTasks = async () => {
    try {
      // ดึงรายการ to-do ทั้งหมดจาก Appwrite Database
      const res = await databases.listDocuments(databaseId, collectionId);
      setTodos(res.documents);
    } catch (err) {
      // ถ้าโหลดข้อมูลผิดพลาด
      console.error('Load error:', err);
    }
  };

  const addTask = async () => {
    if (task.trim() === '') return; // ถ้า input ว่าง ไม่ต้องเพิ่ม
    try {
      // สร้าง document ใหม่ใน Appwrite Database
      const newTask = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        { title: task.trim() }
      );
      // เพิ่ม task ใหม่เข้า state
      setTodos([...todos, newTask]);
      setTask(''); // ล้าง input
    } catch (err) {
      // ถ้าเพิ่มข้อมูลผิดพลาด
      console.error('Add error:', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      // ลบ document ใน Appwrite Database ตาม id
      await databases.deleteDocument(databaseId, collectionId, id);
      // เอา task ที่ถูกลบออกจาก state
      setTodos(todos.filter((t: any) => t.$id !== id));
    } catch (err) {
      // ถ้าลบข้อมูลผิดพลาด
      console.error('Delete error:', err);
    }
  };

  const editTask = (id: string) => {
    // หา task ที่ต้องการแก้ไขจาก state
    const todoToEdit = todos.find((todo: any) => todo.$id === id);
    if (todoToEdit) {
      setTask(todoToEdit.title); // ใส่ข้อความเดิมลง input
      setIsEditing(true);        // เปลี่ยนโหมดเป็นแก้ไข
      setEditingId(id);          // เก็บ id ของ task ที่แก้ไข
    }
  };

  const saveTask = async () => {
    if (task.trim() === '' || !editingId) return; // ถ้า input ว่างหรือไม่มี id ไม่ต้องบันทึก
    try {
      // อัปเดต document ใน Appwrite Database
      const updated = await databases.updateDocument(databaseId, collectionId, editingId, {
        title: task.trim(),
      });
      // อัปเดต task ใน state
      setTodos(todos.map((t: any) => (t.$id === editingId ? updated : t)));
      setTask('');           // ล้าง input
      setIsEditing(false);   // กลับสู่โหมดเพิ่ม
      setEditingId(null);    // ล้าง id ที่แก้ไข
    } catch (err) {
      // ถ้าอัปเดตข้อมูลผิดพลาด
      console.error('Save error:', err);
    }
  };

  const cancelEdit = () => {
    // ยกเลิกการแก้ไข
    setTask('');
    setIsEditing(false);
    setEditingId(null);
  };

   return (
    <View style={styles.container}>
      <Text style={styles.heading}>📝 My To-Do List</Text>

      <TextInput
        style={styles.input}
        placeholder="พิมพ์สิ่งที่ต้องทำ"
        value={task}
        onChangeText={setTask}
      />

      {/* ปุ่มเพิ่มหรือบันทึก */}
      {isEditing ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editSaveButton} onPress={saveTask}>
            <Text style={styles.buttonText}>✅ บันทึกการแก้ไข</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
            <Text style={styles.buttonText}>❌ ยกเลิก</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>➕ เพิ่มสิ่งที่ต้องทำ</Text>
        </TouchableOpacity>
      )}

      {/* กล่องรายการสีเทา */}
      <View style={styles.todoContainer}>
        <FlatList
          data={todos}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View style={styles.todoRow}>
              <Text style={styles.todoItem}>• {item.title}</Text>
              <View style={styles.todoActions}>
                <TouchableOpacity style={styles.editButton} onPress={() =>  editTask(item.$id)}>
                  <Text style={styles.buttonText}>✏️ แก้ไข</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.$id)}>
                  <Text style={styles.buttonText}>🗑 ลบ</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editSaveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  todoContainer: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  todoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  todoItem: {
    fontSize: 18,
    flex: 1,
  },
  todoActions: {
    flexDirection: 'row',
    gap: 6,
  },
  editButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
