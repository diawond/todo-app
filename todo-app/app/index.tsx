import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [task, setTask] = useState('');         // สำหรับ input ที่ผู้ใช้พิมพ์
  const [todos, setTodos] = useState<{ id: string; title: string }[]>([]);       // รายการ to-do ทั้งหมด
  const [isEditing, setIsEditing] = useState(false); //Editing task
  const [editingId, setEditingId] = useState<string | null>(null); // ID ของ task ที่กำลังแก้ไข  

  // ฟังก์ชันสำหรับเพิ่ม task ใหม่
  const addTask = () => {
    if (task.trim() === '') return; // ถ้าไม่มีอะไร ไม่เพิ่ม
    setTodos([...todos, { id: Date.now().toString(), title: task.trim() }]);// เพิ่ม task ใหม่
    setTask(''); // ล้างช่อง input
  };
  const deleteTask = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // ฟังก์ชันสำหรับแก้ไข task
  const editTask = (id: string) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setTask(todoToEdit.title); // ตั้งค่า input เป็นชื่อ task ที่ต้องการแก้ไข
      setIsEditing(true); // เปลี่ยนสถานะเป็นกำลังแก้ไข
      setEditingId(id); // ตั้งค่า ID ของ task ที่กำลังแก้ไข
    }
  };
  // ฟังก์ชันสำหรับบันทึกการแก้ไข
  const saveTask = () => {
    if (task.trim() === '') return; // ถ้าไม่มีอะไร ไม่บันทึก
    setTodos(todos.map((todo) =>
      todo.id === editingId ? { ...todo, title: task.trim() } : todo
    )); // อัปเดต task ที่ถูกแก้ไข
    setTask(''); // ล้างช่อง input
    setIsEditing(false); // เปลี่ยนสถานะกลับเป็นไม่กำลังแก้ไข
    setEditingId(null); // ล้าง ID ของ task ที่กำลังแก้ไข
  };

  // ถ้าเป็นการแก้ไข ให้แสดงปุ่มบันทึก แทนปุ่มเพิ่ม
  const renderAddButton = () => {
    setTask('');
    setIsEditing(false);
    setEditingId(null); 
  };

  // ฟังก์ชันสำหรับยกเลิกการแก้ไข
  const cancelEdit = () => {
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.todoRow}>
              <Text style={styles.todoItem}>• {item.title}</Text>
              <View style={styles.todoActions}>
                <TouchableOpacity style={styles.editButton} onPress={() => editTask(item.id)}>
                  <Text style={styles.buttonText}>✏️ แก้ไข</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
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
