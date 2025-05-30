import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [task, setTask] = useState('');         // สำหรับ input ที่ผู้ใช้พิมพ์
  const [todos, setTodos] = useState<{ id: string; title: string }[]>([]);       // รายการ to-do ทั้งหมด

  const addTask = () => {
    if (task.trim() === '') return; // ถ้าไม่มีอะไร ไม่เพิ่ม
    setTodos([...todos, { id: Date.now().toString(), title: task.trim() }]);// เพิ่ม task ใหม่
    setTask(''); // ล้างช่อง input
  };
  const deleteTask = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
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
      <Button title="เพิ่มรายการ" onPress={addTask} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoRow}>
            <Text style={styles.todoItem}>• {item.title}</Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteText}>ลบ</Text>
            </TouchableOpacity>
          </View>
        )}
        style={styles.list}
      />
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
  list: {
    marginTop: 20,
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
  deleteText: {
    color: 'red',
    fontSize: 16,
    marginLeft: 10,
  },
});