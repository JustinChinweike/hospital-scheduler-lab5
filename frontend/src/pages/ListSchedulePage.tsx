import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { departments } from '../data/mockData';
import { ScheduleChart } from '../components/ScheduleChart';
import { useOffline } from '../context/OfflineContext';
import { useSchedule } from '../context/ScheduleContext';
import FileUpload from "../components/FileUpload";
import { toast } from "../hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

const ListSchedulePage = () => {
  const navigate = useNavigate();
  const { isOnline, isServerUp } = useOffline();
  const {
    filteredSchedules,
    setFilterCriteria,
    deleteSchedule,
    autoScheduleEnabled,
    toggleAutoSchedule,
  } = useSchedule();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  // Local filter state for UI controls
  const [filters, setFilters] = useState({
    doctorName: '',
    patientName: '',
    department: 'all',
  });

  // Update context filter criteria when filters change
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setFilterCriteria({
      doctorName: newFilters.doctorName,
      patientName: newFilters.patientName,
      department: newFilters.department,
    });
    setVisibleCount(10);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule(id);
      setShowDeleteDialog(false);
      setScheduleToDelete(null);
      toast({ title: "Deleted", description: "Schedule deleted successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete schedule." });
    }
  };

  const confirmDelete = (id: string) => {
    setScheduleToDelete(id);
    setShowDeleteDialog(true);
  };

  const clearFilters = () => {
    setFilters({
      doctorName: '',
      patientName: '',
      department: 'all',
    });
    setFilterCriteria({
      doctorName: '',
      patientName: '',
      department: 'all',
    });
    setVisibleCount(10);
  };

  if (!isOnline || !isServerUp) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">Error loading schedules</p>
          {!isOnline && <p className="text-sm text-gray-600">You are currently offline</p>}
          {!isServerUp && <p className="text-sm text-gray-600">Server is currently unavailable</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ChevronLeft className="mr-1" /> Back
      </Button>

      {/* Auto-scheduler toggle (optional, remove if you want it only on Dashboard) */}
      <div className="flex justify-end mb-4">
        <Button onClick={toggleAutoSchedule}>
          {autoScheduleEnabled
            ? "⛔ Disable Auto-Scheduler"
            : "✅ Enable Auto-Scheduler"}
        </Button>
      </div>

      <div className="w-full max-w-7xl mx-auto space-y-10">
        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ScheduleChart />
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              <Button variant="default" onClick={() => navigate("/add-schedule")}>Add New Schedule</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input placeholder="Filter by doctor name" value={filters.doctorName} onChange={(e) => handleFilterChange('doctorName', e.target.value)} />
            <Input placeholder="Filter by patient name" value={filters.patientName} onChange={(e) => handleFilterChange('patientName', e.target.value)} />
            <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <FileUpload />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No schedules found. Try adjusting your filters or add a new schedule.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSchedules.slice(0, visibleCount).map((schedule) => (
                  <TableRow key={schedule.id} className="hover:bg-gray-50">
                    <TableCell>{schedule.doctorName}</TableCell>
                    <TableCell>{schedule.patientName}</TableCell>
                    <TableCell>{schedule.department}</TableCell>
                    <TableCell>
                      {new Date(schedule.dateTime).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/edit-schedule/${schedule.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete(schedule.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* Load More Button */}
          {visibleCount < filteredSchedules.length && (
            <div className="flex justify-center my-4">
              <Button onClick={() => setVisibleCount((prev) => prev + 10)}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => scheduleToDelete && handleDelete(scheduleToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListSchedulePage;




// import React, { useState, useEffect } from 'react';
// import { Schedule } from '../types/schedule';
// import { Button } from '../components/ui/button';
// import { Input } from '../components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
// import { useNavigate } from "react-router-dom";
// import { ChevronLeft } from "lucide-react";
// import { departments } from '../data/mockData';
// import { ScheduleChart } from '../components/ScheduleChart';
// import { useOffline } from '../context/OfflineContext';
// import { useSchedule } from '../context/ScheduleContext';
// import FileUpload from "../components/FileUpload";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "../components/ui/alert-dialog";

// const ListSchedulePage = () => {
//   const navigate = useNavigate();
//   const { isOnline, isServerUp } = useOffline();
//   const { schedules, deleteSchedule } = useSchedule();
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
//   const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
//   const [visibleCount, setVisibleCount] = useState(10); // Show 10 rows initially

//   const [filters, setFilters] = useState({
//     doctorName: '',
//     patientName: '',
//     department: 'all',
//     sortBy: 'dateTime',
//     sortOrder: 'desc' as 'asc' | 'desc',
//   });

//   useEffect(() => {
//     // Apply filters whenever schedules or filters change
//     let result = [...schedules];

//     // Apply text filters
//     if (filters.doctorName) {
//       result = result.filter(schedule =>
//         schedule.doctorName.toLowerCase().includes(filters.doctorName.toLowerCase())
//       );
//     }

//     if (filters.patientName) {
//       result = result.filter(schedule =>
//         schedule.patientName.toLowerCase().includes(filters.patientName.toLowerCase())
//       );
//     }

//     if (filters.department && filters.department !== 'all') {
//       result = result.filter(schedule =>
//         schedule.department === filters.department
//       );
//     }

//     // Apply sorting
//     result.sort((a, b) => {
//       if (filters.sortBy === 'dateTime') {
//         const aDate = new Date(a.dateTime);
//         const bDate = new Date(b.dateTime);
//         return filters.sortOrder === 'asc'
//           ? aDate.getTime() - bDate.getTime()
//           : bDate.getTime() - aDate.getTime();
//       }

//       const aValue = a[filters.sortBy as keyof Schedule];
//       const bValue = b[filters.sortBy as keyof Schedule];

//       if (typeof aValue === 'string' && typeof bValue === 'string') {
//         return filters.sortOrder === 'asc'
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }
//       return 0;
//     });

//     setFilteredSchedules(result);
//   }, [schedules, filters]);

//   const handleFilterChange = (key: string, value: string) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setVisibleCount(10); // Reset pagination on filter change
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteSchedule(id);
//       setShowDeleteDialog(false);
//       setScheduleToDelete(null);
//     } catch (err) {
//       console.error("❌ Failed to delete schedule:", err);
//     }
//   };

//   const confirmDelete = (id: string) => {
//     setScheduleToDelete(id);
//     setShowDeleteDialog(true);
//   };

//   const clearFilters = () => {
//     setFilters({
//       doctorName: '',
//       patientName: '',
//       department: 'all',
//       sortBy: 'dateTime',
//       sortOrder: 'desc',
//     });
//     setVisibleCount(10); // Reset pagination on clear
//   };

//   if (!isOnline || !isServerUp) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <p className="text-red-500 font-medium">Error loading schedules</p>
//           {!isOnline && <p className="text-sm text-gray-600">You are currently offline</p>}
//           {!isServerUp && <p className="text-sm text-gray-600">Server is currently unavailable</p>}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <Button
//         variant="ghost"
//         className="mb-4"
//         onClick={() => navigate("/")}
//       >
//         <ChevronLeft className="mr-1" /> Back
//       </Button>

//       <div className="w-full max-w-7xl mx-auto space-y-10">
//         {/* Chart Section */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <ScheduleChart />
//         </div>

//         {/* Filters Section */}
//         <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold">Filters</h2>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 onClick={clearFilters}
//               >
//                 Clear Filters
//               </Button>
//               <Button
//                 variant="default"
//                 onClick={() => navigate("/add-schedule")}
//               >
//                 Add New Schedule
//               </Button>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             <Input
//               placeholder="Filter by doctor name"
//               value={filters.doctorName}
//               onChange={(e) => handleFilterChange('doctorName', e.target.value)}
//             />
//             <Input
//               placeholder="Filter by patient name"
//               value={filters.patientName}
//               onChange={(e) => handleFilterChange('patientName', e.target.value)}
//             />
//             <Select
//               value={filters.department}
//               onValueChange={(value) => handleFilterChange('department', value)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Filter by department" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Departments</SelectItem>
//                 {departments.map((dept) => (
//                   <SelectItem key={dept} value={dept}>
//                     {dept}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select
//               value={filters.sortBy}
//               onValueChange={(value) => handleFilterChange('sortBy', value)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="dateTime">Date</SelectItem>
//                 <SelectItem value="doctorName">Doctor</SelectItem>
//                 <SelectItem value="patientName">Patient</SelectItem>
//                 <SelectItem value="department">Department</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select
//               value={filters.sortOrder}
//               onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Order" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="asc">Ascending</SelectItem>
//                 <SelectItem value="desc">Descending</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* File Upload Section */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <FileUpload />
//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Doctor</TableHead>
//                 <TableHead>Patient</TableHead>
//                 <TableHead>Department</TableHead>
//                 <TableHead>Date & Time</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredSchedules.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5} className="text-center py-8">
//                     No schedules found. Try adjusting your filters or add a new schedule.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredSchedules.slice(0, visibleCount).map((schedule) => (
//                   <TableRow key={schedule.id} className="hover:bg-gray-50">
//                     <TableCell>{schedule.doctorName}</TableCell>
//                     <TableCell>{schedule.patientName}</TableCell>
//                     <TableCell>{schedule.department}</TableCell>
//                     <TableCell>
//                       {new Date(schedule.dateTime).toLocaleString()}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => navigate(`/edit-schedule/${schedule.id}`)}
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => confirmDelete(schedule.id)}
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//           {/* Load More Button */}
//           {visibleCount < filteredSchedules.length && (
//             <div className="flex justify-center my-4">
//               <Button onClick={() => setVisibleCount((prev) => prev + 10)}>
//                 Load More
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the schedule.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={() => scheduleToDelete && handleDelete(scheduleToDelete)}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default ListSchedulePage;