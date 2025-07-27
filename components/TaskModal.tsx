import { supabase } from '@/lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Alert,
    Button,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomCheckbox from './CheckBox';


type TaskItem = {
    id?: string;
    title?: string;
    description?: string;
    is_priority?: boolean;
    deadline_date?: string | null;
};

type TaskModalProps = {
    user_data: any; // You can strongly type this as per your Supabase user object
    fetchFnCall: () => void;
    title_header?: string;
    item_details?: TaskItem;
};

const TaskModal: React.FC<TaskModalProps> = ({ user_data, fetchFnCall, title_header = "", item_details = {} }) => {
    const [openModal, setOpenModal] = useState(false);
    const [task, setTask] = useState<string>(item_details?.title ? item_details?.title : "");
    const [isPriority, setIsPriority] = useState<boolean>(item_details?.is_priority ? item_details?.is_priority : false);
    const [description, setDescription] = useState<string>(item_details?.description ? item_details?.description : "");
    const [editTaskId, setEditTaskId] = useState<string>(item_details?.id ? item_details?.id : "");
    const [deadline, setDeadline] = useState<Date | null>(item_details?.deadline_date ? new Date(item_details?.deadline_date) : null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handlePriorityToggle = (value: boolean) => {
        setIsPriority(value);
    }

    const handleAddTask = async () => {
        // console.log("user",user);
        if (task.trim()) {
            let user_id = user_data?.id;
            console.log('Task Added:, ', task);
            const { data, error } = await supabase
                .from('tasks')
                .insert([
                    { title: task, description: description, completed: 0, user_id: user_id, is_priority: isPriority, deadline_date: deadline },
                ])
            setTask('');
            setDescription('');
            setIsPriority(false);
            setDeadline(null);
            if (error) {
                console.error(error)
            }
            else {
                setOpenModal(false);
                fetchFnCall();
            }
        }
    };

    const handleUpdateTask = async () => {
        const { data, error } = await supabase
            .from('tasks')
            .update({ title: task, description: description, completed: 0, is_priority: isPriority, deadline_date: deadline })
            .eq('id', editTaskId)
            .select();

        if (data != null) {
            Alert.alert('Success', 'Task Updated Successfully', [
                {
                    text: 'OK',
                    onPress: () => {
                        setOpenModal(false);
                        fetchFnCall();
                    },
                },
            ]);

        }
        if (error) {
            console.error("Error updating Supabase:", error);
            return;
        }
    };

    return (
        <View>
            <Button title={title_header} onPress={() => setOpenModal(true)} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={openModal}
                onRequestClose={() => setOpenModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>{title_header} Task</Text>
                        <View style={styles.inputSection}>
                            <TextInput
                                style={styles.input}
                                value={task}
                                onChangeText={setTask}
                                placeholder='Enter task title'
                                placeholderTextColor="#aaa"
                            />
                            <TextInput
                                style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder='Enter a description'
                                placeholderTextColor="#aaa"
                                multiline={true}
                                numberOfLines={4}
                            />
                            <View style={styles.datePickerSection}>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                                    <Text style={styles.dateButtonText}>
                                        {deadline ? new Date(deadline).toLocaleDateString() : 'Select Deadline'}
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={deadline || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) {
                                                setDeadline(selectedDate);
                                            }
                                        }}
                                    />
                                )}
                            </View>
                            <View style={styles.checkboxRow}>
                                <CustomCheckbox stateVal={isPriority} stateFunc={handlePriorityToggle} title="Priority" />
                            </View>


                            {/* {
                                title_header == "Edit" ?
                                    <TouchableOpacity style={styles.addButton} onPress={handleUpdateTask}>
                                        <Text style={styles.addButtonText}>➕ Update Task</Text>
                                    </TouchableOpacity> :
                                    <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                                        <Text style={styles.addButtonText}>➕ Add Task</Text>
                                    </TouchableOpacity>
                            } */}

                        </View>
                        <View style={styles.footerButtons}>
                            {
                                title_header === "Edit" ? (
                                    <TouchableOpacity style={styles.addButton} onPress={handleUpdateTask}>
                                        <Text style={styles.addButtonText}>✔️ Update Task</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                                        <Text style={styles.addButtonText}>➕ Add Task</Text>
                                    </TouchableOpacity>
                                )
                            }

                            <TouchableOpacity style={styles.closeButton} onPress={() => setOpenModal(false)}>
                                <Text style={styles.closeButtonText}>✖️ Close</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity onPress={() => setOpenModal(false)}>
                            <Text style={{ color: 'red', marginTop: 20 }}>Close</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TaskModal;

// const styles = StyleSheet.create({
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalContent: {
//         width: '90%',
//         backgroundColor: 'white',
//         padding: 20,
//         borderRadius: 12,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     inputSection: {
//         width: '100%',
//     },
//     input: {
//         backgroundColor: '#fff',
//         padding: 14,
//         borderRadius: 10,
//         fontSize: 16,
//         marginBottom: 12,
//         borderColor: '#ccc',
//         borderWidth: 1,
//     },
//     checkboxRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     datePickerSection: {
//         marginBottom: 16,
//     },
//     dateButton: {
//         padding: 14,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 8,
//         backgroundColor: '#f9f9f9',
//     },
//     dateButtonText: {
//         fontSize: 16,
//         color: '#333',
//     },
//     addButton: {
//         backgroundColor: '#4CAF50',
//         paddingVertical: 14,
//         borderRadius: 10,
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     addButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#ffffff',
        padding: 24,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    inputSection: {
        width: '100%',
    },
    input: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        color: '#222',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    datePickerSection: {
        marginBottom: 16,
    },
    dateButton: {
        padding: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#555',
    },
    closeText: {
        color: '#ff4d4f',
        marginTop: 20,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10, // optional spacing for better look
    },
    closeButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 12,
        alignItems: 'center',
        flex: 1,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 12,
        alignItems: 'center',
        flex: 1,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});