import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
type Task = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    is_priority: boolean;
    created_at:any;
    deadline_date?:string;
};

const useTasks = () => {
    const { user } = useAuth();
    const [taskList, setTaskList] = useState<Task[]>([]);
    const user_id = user?.id;
    const fetchTasks = async () => {
        if (user_id && user_id != "") {
            const { data, error } = await supabase.from('tasks').select('*').eq('is_deleted', 0).eq('user_id', user_id).eq('completed','0').order('created_at', { ascending: false });
            if (error) {
                console.error("Error Occured", error);
            }
            if (data != null) {
                setTaskList(data);
            }
        }

    }

    useEffect(() => {
        fetchTasks();
    }, []);

    return { fetchTasks, taskList }
}

export default useTasks;