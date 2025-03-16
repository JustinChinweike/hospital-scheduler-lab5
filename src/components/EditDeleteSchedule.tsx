
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSchedule } from "@/context/ScheduleContext";
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
} from "@/components/ui/alert-dialog";

interface EditDeleteScheduleProps {
  scheduleId: string;
}

export const EditDeleteSchedule: React.FC<EditDeleteScheduleProps> = ({ scheduleId }) => {
  const navigate = useNavigate();
  const { deleteSchedule } = useSchedule();

  const handleEdit = () => {
    navigate(`/edit-schedule/${scheduleId}`);
  };

  const handleDelete = () => {
    deleteSchedule(scheduleId);
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
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/b51ee7fa-6f61-4228-811c-ece7f1bb2bf2.png" 
              alt="Trash can with paper" 
              className="w-40 h-40 object-contain"
            />
          </div>
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
