import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

type Task = {
  id:string;
  title:string;
  description:string;
  completed: boolean;
};

interface UseTaskSubscriptionProps {
  setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function useTaskSubscription({setTaskList}:UseTaskSubscriptionProps){
    const {user} = useAuth();

    useEffect(()=>{
        if(!user) return;
        let user_id = user?.id;
        const channel  = supabase.channel('tasks-realtime').on('postgres_changes',{event:'*',schema:'public',table:'tasks',filter:`user_id=eq.${user_id}`},(payload)=>{
            const {eventType,new:newRecord,old:oldRecord} = payload;

            setTaskList(prev => {
                switch(eventType){
                    case 'INSERT':
                        return [...prev,newRecord];
                    case 'UPDATE':
                        return prev.map(task=>task.id === newRecord.id ? newRecord:task);
                    case 'DELETE':
                        return prev.map(task => task.id !== oldRecord.id);
                    default:
                        return prev;
                }
            })
        }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    },[user]);
}