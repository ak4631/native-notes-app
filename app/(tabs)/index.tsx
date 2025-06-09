
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
type Task = {
  id:string;
  title:string;
  completed: boolean;
};

export default function HomeScreen() {
  const [task,setTask] = useState<string>('');
  const [taskList,setTaskList] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await AsyncStorage.getItem('tasks');
        if (data) {
          setTaskList(JSON.parse(data));
        }
      } catch (error) {
        console.log('Error loading tasks:', error);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(taskList));
      } catch (error) {
        console.log('Error saving tasks:', error);
      }
    };

    saveTasks();
  }, [task]);

  const handleAddTask = () =>{
    if(task.trim()){
      console.log('Task Added:, ',task);
      setTaskList([...taskList,{id:Date.now().toString(),title:task,completed:false}]);
      setTask('');
    }
  };

  const handleToggleComplete = (id:string) =>{
    setTaskList((prev)=>prev.map((task)=>task.id === id ? {...task,completed:!task.completed}:task));
  };

  const handleDeleteTask = (id:string) =>{
    setTaskList(taskList.filter((t)=>t.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My To-Do App</Text>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={setTask}
        placeholder='Enter a task'
      />

      <Button title='Add Task' onPress={handleAddTask}></Button>

      <FlatList
        data={taskList}
        keyExtractor={(item)=>item.id}
        renderItem={({item}:{item:Task})=>(
          <TouchableOpacity onPress={() => handleToggleComplete(item.id)}>
            <View style={styles.taskItem}>
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.taskCompletedText,
                ]}
              >
                {item.title}
              </Text>
              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
        }
        style={{marginTop:20}}
      />
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, padding: 20, marginTop: 50,
//   },
//   heading: {
//     fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5,
//   },
//   taskItem: {
//     padding: 10, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 5,
//   },
//   emptyText: {
//     marginTop: 20, textAlign: 'center', color: '#777',
//   },
//   deleteText: {
//     color: 'red',marginLeft: 10,
//   },
//   taskText: {
//     fontSize: 16,
//   },
//   taskCompletedText: {
//     textDecorationLine: 'line-through',
//     color: '#999',
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 8,
  },
  taskText: {
    fontSize: 16,
    flexShrink: 1,
  },
  taskCompletedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteText: {
    color: 'red',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#777',
  },
});

