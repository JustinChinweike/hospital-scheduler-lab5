
import { useState, useEffect } from "react";
import { useSchedule } from "@/context/ScheduleContext";
import { format, parseISO } from "date-fns";
import { departments } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { EditDeleteSchedule } from "@/components/EditDeleteSchedule";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ScheduleList = () => {
  const { filteredSchedules, setFilterCriteria } = useSchedule();
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDoctorName, setFilterDoctorName] = useState("");
  const [loaded, setLoaded] = useState(false);
  
  // Force a re-render after mounting to ensure data is loaded
  useEffect(() => {
    setLoaded(true);
    console.log("Schedule list mounted, schedules:", filteredSchedules);
  }, [filteredSchedules]);

  const handleFilterChange = () => {
    setFilterCriteria({
      doctorName: filterDoctorName,
      patientName: "",
      department: filterDepartment,
    });
    console.log("Applying filters:", filterDoctorName, filterDepartment);
  };

  const clearFilters = () => {
    setFilterDepartment("");
    setFilterDoctorName("");
    setFilterCriteria({
      doctorName: "",
      patientName: "",
      department: "",
    });
    console.log("Filters cleared");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto p-4">
      <Card className="flex-1 md:max-w-lg bg-green-900 text-white rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">LIST SCHEDULE AND FILTERING</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSchedules.length === 0 ? (
            <div className="text-center p-8">
              <p>No schedules found. Please adjust your filters or add new schedules.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSchedules.map((schedule) => (
                <Card 
                  key={schedule.id} 
                  className={`bg-white text-black rounded-lg border-0 hover:shadow-md transition-shadow cursor-pointer ${
                    selectedSchedule === schedule.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedSchedule(schedule.id)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-2">
                      <Label className="font-bold">DOCTOR NAME:</Label>
                      <span className="bg-gray-300 rounded px-2 py-1 text-center">
                        {schedule.doctorName}
                      </span>
                    </div>

                    <div className="grid grid-cols-2">
                      <Label className="font-bold">PATIENT NAME:</Label>
                      <span className="bg-gray-300 rounded px-2 py-1 text-center">
                        {schedule.patientName}
                      </span>
                    </div>

                    <div className="grid grid-cols-2">
                      <Label className="font-bold">DATE & TIME:</Label>
                      <span className="bg-gray-300 rounded px-2 py-1 text-center">
                        {format(parseISO(schedule.dateTime), "dd MMM HH:mm")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2">
                      <Label className="font-bold">DEPARTMENT:</Label>
                      <span className="bg-gray-300 rounded px-2 py-1 text-center">
                        {schedule.department}
                      </span>
                    </div>

                    {selectedSchedule === schedule.id && (
                      <div className="mt-4">
                        <p className="font-bold text-center mb-2">Actions:</p>
                        <div className="flex justify-center gap-4">
                          <EditDeleteSchedule scheduleId={schedule.id} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="md:w-1/3 bg-green-900 text-white p-6 rounded-3xl">
        <h2 className="text-xl font-bold mb-6">Filter By:</h2>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="filterDepartment">Department</Label>
            <Select 
              value={filterDepartment} 
              onValueChange={(value) => {
                console.log("Department selected:", value);
                setFilterDepartment(value);
              }}
            >
              <SelectTrigger id="filterDepartment" className="bg-teal-400 text-black border-0 mt-2">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {/* Fix: Changed empty string to "all" */}
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="filterDoctorName">Doctor Name</Label>
            <Input
              id="filterDoctorName"
              value={filterDoctorName}
              onChange={(e) => setFilterDoctorName(e.target.value)}
              placeholder="Search by doctor name"
              className="bg-teal-400 text-black border-0 placeholder:text-gray-700 mt-2"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleFilterChange}
              className="bg-teal-400 hover:bg-teal-500 text-black flex-1"
            >
              Apply Filters
            </Button>
            <Button 
              onClick={clearFilters}
              variant="outline" 
              className="border-teal-400 text-teal-400 hover:bg-teal-400/20 flex-1"
            >
              Clear
            </Button>
          </div>
          
          <div className="w-full flex justify-center mt-6">
            <img 
              src="/lovable-uploads/ed536754-06e9-4a4b-90b8-a5b397e1f7c6.png" 
              alt="Schedule Calendar Icon" 
              className="w-32 h-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
