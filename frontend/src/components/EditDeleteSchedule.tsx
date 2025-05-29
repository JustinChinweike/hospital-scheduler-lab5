
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useSchedule } from "../context/ScheduleContext";
import { useOffline } from "../context/OfflineContext";
import { toast } from "../components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

interface EditDeleteScheduleProps {
  scheduleId: string;
}

export const EditDeleteSchedule: React.FC<EditDeleteScheduleProps> = ({ scheduleId }) => {
  const { isOnline, isServerUp, queueOperation } = useOffline();
  const navigate = useNavigate();
  const { deleteSchedule } = useSchedule();

  const handleEdit = () => {
    navigate(`/edit-schedule/${scheduleId}`);
  };

  const handleDelete = async () => {
    if (isOnline && isServerUp) {
      await deleteSchedule(scheduleId);
      toast({ title: "Deleted", description: "Schedule deleted." });
    } else {
      queueOperation({
        id: scheduleId,
        type: "DELETE",
        timestamp: Date.now(),
      });
      toast({
        title: "Offline",
        description: "Delete will be synced when you're back online.",
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Button 
        onClick={handleEdit}
        className="bg-blue-600 hover:bg-blue-700 flex-1"
      >
        EDIT
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 flex-1"
          >
            DELETE
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              ARE YOU SURE YOU WANT TO DELETE THIS SCHEDULE?
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="flex gap-6">
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white flex-1 py-6 rounded-full"
            >
              DELETE
            </AlertDialogAction>
            <AlertDialogCancel className="bg-gray-300 hover:bg-gray-400 flex-1 py-6 rounded-full">
              CANCEL
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
