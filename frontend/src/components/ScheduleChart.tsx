import * as React from "react";
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useSchedule } from '../context/ScheduleContext'; // <-- use your context

export function ScheduleChart() {
  const { schedules } = useSchedule(); // <-- get schedules from context
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!schedules) return;

    const departmentCounts = schedules.reduce((acc: { [key: string]: number }, schedule) => {
      acc[schedule.department] = (acc[schedule.department] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(departmentCounts)
      .map(([department, count]) => ({
        department,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    setChartData(chartData);
  }, [schedules]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schedules by Department</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                name="Number of Schedules"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}







// import * as React from "react";
// import { useEffect, useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { useQuery } from '@tanstack/react-query';
// import { Schedule } from '../types/schedule';

// interface ScheduleResponse {
//   data: Schedule[];
//   pagination: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }

// const fetchAllSchedules = async (): Promise<Schedule[]> => {
//   const response = await fetch('http://localhost:5000/schedules?limit=1000');
//   const data: ScheduleResponse = await response.json();
//   return data.data;
// };

// export function ScheduleChart() {
//   const [chartData, setChartData] = useState<any[]>([]);

//   const { data: schedules } = useQuery({
//     queryKey: ['all-schedules'],
//     queryFn: fetchAllSchedules,
//   });

//   useEffect(() => {
//     if (!schedules) return;

//     const departmentCounts = schedules.reduce((acc: { [key: string]: number }, schedule) => {
//       acc[schedule.department] = (acc[schedule.department] || 0) + 1;
//       return acc;
//     }, {});

//     const chartData = Object.entries(departmentCounts)
//       .map(([department, count]) => ({
//         department,
//         count,
//       }))
//       .sort((a, b) => b.count - a.count);

//     setChartData(chartData);
//   }, [schedules]);

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Schedules by Department</CardTitle>
//       </CardHeader>
//       <CardContent className="pt-6">
//         <div className="h-[300px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="department" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar
//                 dataKey="count"
//                 fill="#3b82f6"
//                 name="Number of Schedules"
//                 radius={[4, 4, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// } 