import * as React from "react";
import { useState } from "react";
import { useSchedule } from "../context/ScheduleContext";
import { format, parseISO } from "date-fns";
import { departments } from "../data/mockData";
import { Button } from "../components/ui/button";
import { EditDeleteSchedule } from "../components/EditDeleteSchedule";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const ScheduleList = () => {
  const { filteredSchedules, setFilterCriteria } = useSchedule();
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterDoctorName, setFilterDoctorName] = useState("");
  const [filterPatientName, setFilterPatientName] = useState("");

  const [visibleCount, setVisibleCount] = useState(6);
  const visibleSchedules = filteredSchedules.slice(0, visibleCount);

  const handleFilterChange = () => {
    setFilterCriteria({
      doctorName: filterDoctorName,
      patientName: filterPatientName,
      department: filterDepartment,
    });
  };

  const clearFilters = () => {
    setFilterDepartment("all");
    setFilterDoctorName("");
    setFilterPatientName("");
    setFilterCriteria({
      doctorName: "",
      patientName: "",
      department: "",
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto p-4">
      <Card className="flex-1 md:max-w-lg bg-green-900 text-white rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            LIST SCHEDULE AND FILTERING
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visibleSchedules.length === 0 ? (
            <div className="text-center p-8">
              <p>No schedules found. Adjust your filters or add schedules.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {visibleSchedules.map((schedule) => (
                <Card
                  key={schedule.id}
                  className={`bg-white text-black rounded-lg hover:shadow-md cursor-pointer ${
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
                      <div className="mt-4 flex justify-center gap-4">
                        <EditDeleteSchedule scheduleId={schedule.id} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredSchedules.length && (
            <div className="flex justify-center mt-4">
              <Button onClick={() => setVisibleCount((prev) => prev + 6)}>
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Sidebar */}
      <div className="md:w-1/3 bg-green-900 text-white p-6 rounded-3xl">
        <h2 className="text-xl font-bold mb-6">Filter By:</h2>
        <div className="space-y-6">
          <div>
            <Label htmlFor="filterDepartment">Department</Label>
            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger className="bg-teal-400 text-black border-0 mt-2">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
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
              className="bg-teal-400 text-black border-0 mt-2"
            />
          </div>
          <div>
         <Label htmlFor="filterPatientName">Patient Name</Label>
        <Input
        id="filterPatientName"
        value={filterPatientName}
        onChange={(e) => setFilterPatientName(e.target.value)}
        placeholder="Search by patient name"
        className="bg-teal-400 text-black border-0 mt-2"
      />
      </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleFilterChange} className="bg-teal-400 text-black flex-1">
              Apply Filters
            </Button>
            <Button onClick={clearFilters} variant="outline" className="border-teal-400 text-teal-400 flex-1">
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;