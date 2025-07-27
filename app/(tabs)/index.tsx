import TaskModal from '@/components/TaskModal';
import { useAuth } from '@/context/AuthContext';
import useTasks from '@/hooks/useTasks';
import { supabase } from '@/lib/supabase';
// import CheckBox from '@react-native-community/checkbox';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  is_priority: boolean;
  created_at: any;
  deadline_date?: string;
};

export default function HomeScreen() {

  const { user, signOut } = useAuth();
  const { fetchTasks, taskList } = useTasks();

  const handleModalChanges = () => {
    fetchTasks();
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    let val = 0;
    if (!completed) {
      val = 1;
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: val })
      .eq('id', id)
      .select();

    if (data != null) {
      fetchTasks()
    }
    if (error) {
      console.error("Error updating Supabase:", error);
      return;
    }
  };

  const handleDeleteTask = async (id: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 'is_deleted': 1 })
      .eq('id', id)
      .select();

    if (data != null) {
      fetchTasks()
    }
    if (error) {
      console.error("Error updating Supabase:", error);
      return;
    }
  };


  return (
    // <View style={styles.container}>
    //   <Text style={styles.heading}>Note</Text>
    //   <View style={{ margin: 20 }}>
    //     <TaskModal user_data={user} fetchFnCall = {()=>handleModalChanges()} title_header="Add"/>
    //   </View>
    //   <TouchableOpacity onPress={signOut} style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
    //     <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>Logout</Text>
    //   </TouchableOpacity>

    //   <FlatList
    //     data={taskList}
    //     keyExtractor={(item) => item.id}
    //     renderItem={({ item }: { item: Task }) => {
    //       const deadlineInfo = item.deadline_date
    //         ? (() => {
    //           const now = new Date();
    //           const deadlineDate = new Date(item.deadline_date);
    //           const diffMs = deadlineDate.getTime() - now.getTime();
    //           const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    //           if (diffMs < 0) return '⚠️ Past Deadline';
    //           if (diffDays === 0) return '⚠️ Due Today';
    //           return `⏳ ${diffDays} day(s) left`;
    //         })()
    //         : null;

    //       return (
    //         <View style={item.is_priority ? styles.taskItemPriority : styles.taskItem}>
    //           <TouchableOpacity
    //             style={{ flex: 1 }}
    //             onPress={() => handleToggleComplete(item.id, item.completed)}
    //           >
    //             <Text
    //               style={[
    //                 styles.taskTitle,
    //                 item.completed && styles.taskCompletedText,
    //               ]}
    //             >
    //               {item.title}
    //             </Text>

    //             <Text style={styles.taskDescription}>{item.description}</Text>

    //             {deadlineInfo && (
    //               <Text style={{ color: 'red', marginTop: 4, fontWeight: 'bold' }}>
    //                 {deadlineInfo}
    //               </Text>
    //             )}

    //             <Text style={styles.taskDate}>
    //               {new Date(item.created_at).toLocaleString('en-IN', {
    //                 dateStyle: 'medium',
    //                 timeStyle: 'short',
    //               })}
    //             </Text>
    //           </TouchableOpacity>

    //           <View style={styles.actionColumn}>
    //             <TouchableOpacity>
    //               <TaskModal user_data={user} fetchFnCall = {()=>handleModalChanges()} title_header="Edit" item_details={item}/>
    //             </TouchableOpacity>
    //             <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
    //               <Text style={styles.deleteText}>Delete</Text>
    //             </TouchableOpacity>
    //           </View>
    //         </View>
    //       );
    //     }}
    //     ListEmptyComponent={
    //       <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
    //     }
    //     style={{ marginTop: 20 }}
    //   />

    // </View>
    <View style={styles.container}>
      <Text style={styles.heading}>Note</Text>

      {/* Add Task Button */}
      <View style={{ marginVertical: 20 }}>
        <TaskModal
          user_data={user}
          fetchFnCall={handleModalChanges}
          title_header="Add"
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={signOut}
        style={{ alignSelf: 'flex-end', marginBottom: 20 }}
      >
        <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>

      {/* Task List */}
      <FlatList
        data={taskList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
        }
        style={{ marginTop: 20 }}
        renderItem={({ item }: { item: Task }) => {
          const deadlineInfo = item.deadline_date
            ? (() => {
              const now = new Date();
              const deadlineDate = new Date(item.deadline_date);
              const diffMs = deadlineDate.getTime() - now.getTime();
              const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

              if (diffMs < 0) return '⚠️ Past Deadline';
              if (diffDays === 0) return '⚠️ Due Today';
              return `⏳ ${diffDays} day(s) left`;
            })()
            : null;

          return (
            <View
              style={item.is_priority ? styles.taskItemPriority : styles.taskItem}
            >
              {/* Task Info */}
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleToggleComplete(item.id, item.completed)}
              >
                <Text
                  style={[
                    styles.taskTitle,
                    item.completed && styles.taskCompletedText,
                  ]}
                >
                  {item.title}
                </Text>

                <Text style={styles.taskDescription}>{item.description}</Text>

                {deadlineInfo && (
                  <Text
                    style={{
                      color: 'red',
                      marginTop: 4,
                      fontWeight: 'bold',
                    }}
                  >
                    {deadlineInfo}
                  </Text>
                )}

                <Text style={styles.taskDate}>
                  {new Date(item.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </Text>
              </TouchableOpacity>

              {/* Actions */}
              <View style={styles.actionColumn}>
                <TaskModal
                  user_data={user}
                  fetchFnCall={handleModalChanges}
                  title_header="Edit"
                  item_details={item}
                />
                <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f5f9',
  },
  datePickerSection: {
    marginBottom: 16,
  },
  dateButton: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  // heading: {
  //   fontSize: 28,
  //   fontWeight: 'bold',
  //   marginBottom: 20,
  //   textAlign: 'center',
  //   color: '#2e2e2e',
  // },
  inputSection: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  // taskDate: {
  //   fontSize: 12,
  //   color: '#888',
  //   marginTop: 4,
  // },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
  },
  addButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  taskItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 2,
  },

  taskItemPriority: {
    backgroundColor: '#ffe8e8',
    borderColor: '#e74c3c',
    borderWidth: 1,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 2,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  taskCompletedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  taskDescription: {
    fontSize: 14,
    color: '#555',
  },

  taskDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },

  actionColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 10,
  },

  deleteText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    marginTop: 8,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#aaa',
    fontSize: 16,
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },

  // taskItem: {
  // flexDirection: 'row',
  // justifyContent: 'space-between',
  // alignItems: 'center',
  // padding: 16,
  // backgroundColor: '#ffffff',
  // borderRadius: 12,
  // marginBottom: 10,
  // shadowColor: '#000',
  // shadowOffset: { width: 0, height: 3 },
  // shadowOpacity: 0.1,
  // shadowRadius: 4,
  // elevation: 3,
  // },
  // taskItemPriority: {
  // flexDirection: 'row',
  // justifyContent: 'space-between',
  // alignItems: 'center',
  // padding: 16,
  // backgroundColor: '#fff1f1',
  // borderLeftWidth: 6,
  // borderLeftColor: '#e74c3c',
  // borderRadius: 12,
  // marginBottom: 10,
  // shadowColor: '#000',
  // shadowOffset: { width: 0, height: 3 },
  // shadowOpacity: 0.1,
  // shadowRadius: 4,
  // elevation: 3,
  // },
  // taskItem: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'flex-start',
  //   backgroundColor: '#fff',
  //   padding: 12,
  //   borderRadius: 10,
  //   marginBottom: 10,
  //   elevation: 2,
  // },

  // taskItemPriority: {
  //   backgroundColor: '#fff5f5',
  //   borderLeftColor: 'red',
  //   borderLeftWidth: 5,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   padding: 16,
  //   borderRadius: 12,
  //   marginBottom: 10,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 3 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  // taskItem: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'flex-start',
  //   backgroundColor: '#fff',
  //   padding: 12,
  //   borderRadius: 10,
  //   marginBottom: 10,
  //   elevation: 2,
  // },

  // taskItemPriority: {
  //   backgroundColor: '#fff5f5',
  //   borderLeftColor: 'red',
  //   borderLeftWidth: 5,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'flex-start',
  //   padding: 12,
  //   borderRadius: 10,
  //   marginBottom: 10,
  //   elevation: 2,
  // },

  // actionColumn: {
  //   justifyContent: 'center',
  //   alignItems: 'flex-end',
  //   gap: 10,
  //   marginLeft: 10,
  // },

  editText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // deleteText: {
  //   color: 'crimson',
  //   fontWeight: 'bold',
  //   fontSize: 14,
  // },


  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskText: {
    fontSize: 16,
    flexShrink: 1,
    color: '#2e2e2e',
  },
  // taskCompletedText: {
  //   textDecorationLine: 'line-through',
  //   color: '#888',
  // },
  // deleteText: {
  //   color: '#e74c3c',
  //   fontWeight: 'bold',
  //   fontSize: 14,
  //   marginLeft: 12,
  // },
  // emptyText: {
  //   textAlign: 'center',
  //   color: '#888',
  //   marginTop: 40,
  //   fontSize: 16,
  // },
  // taskTitle: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#2e2e2e',
  //   marginBottom: 4,
  // },

  // taskDescription: {
  //   fontSize: 14,
  //   color: '#666',
  // },
});


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     marginTop: 50
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   taskItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#f0f0f0',
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   taskItemPriority: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#e567679d',
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   taskText: {
//     fontSize: 16,
//     flexShrink: 1,
//   },
//   taskCompletedText: {
//     textDecorationLine: 'line-through',
//     color: '#999',
//   },
//   deleteText: {
//     color: 'red',
//     marginLeft: 10,
//     fontWeight: 'bold',
//   },
//   emptyText: {
//     marginTop: 20,
//     textAlign: 'center',
//     color: '#777',
//   },
// });

