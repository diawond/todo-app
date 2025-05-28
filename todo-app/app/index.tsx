import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [task, setTask] = useState('');         // สำหรับ input ที่ผู้ใช้พิมพ์
  const [todos, setTodos] = useState<{ id: string; title: string }[]>([]);       // รายการ to-do ทั้งหมด

  const addTask = () => {
    if (task.trim() === '') return; // ถ้าไม่มีอะไร ไม่เพิ่ม
    setTodos([...todos, { id: Date.now().toString(), title: task.trim() }]);// เพิ่ม task ใหม่
    setTask(''); // ล้างช่อง input
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
        renderItem={({ item }) => <Text style={styles.todoItem}>• {item.title}</Text>}
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
  todoItem: {
    fontSize: 18,
    paddingVertical: 5,
  },
});
