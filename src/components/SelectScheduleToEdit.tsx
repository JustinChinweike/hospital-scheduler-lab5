
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "@/context/ScheduleContext";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const SelectScheduleToEdit = () => {
  const navigate = useNavigate();
  const { schedules } = useSchedule();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSchedules = schedules.filter(schedule => 
    schedule.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSchedule = (id: string) => {
    navigate(`/edit-schedule/${id}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-center mb-8">SELECT SCHEDULE TO EDIT</h1>
      
      <div className="mb-6">
        <Label htmlFor="search">Search by doctor or patient name</Label>
        <Input
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search..."
          className="mt-2"
        />
      </div>
      
      {filteredSchedules.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p>No schedules found. Please adjust your search or add new schedules.</p>
          <Button 
            className="mt-4"
            onClick={() => navigate("/add-schedule")}
          >
            Add New Schedule
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <Card 
              key={schedule.id} 
              className="hover:shadow-md transition-shadow cursor-pointer border-blue-200"
              onClick={() => handleSelectSchedule(schedule.id)}
            >
              <CardContent className="p-4 grid grid-cols-2 gap-2">
                <div>
                  <p className="font-semibold">Doctor:</p>
                  <p>{schedule.doctorName}</p>
                </div>
                <div>
                  <p className="font-semibold">Patient:</p>
                  <p>{schedule.patientName}</p>
                </div>
                <div>
                  <p className="font-semibold">Date & Time:</p>
                  <p>{format(parseISO(schedule.dateTime), "PPP HH:mm")}</p>
                </div>
                <div>
                  <p className="font-semibold">Department:</p>
                  <p>{schedule.department}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default SelectScheduleToEdit;
