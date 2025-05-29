// src/components/StatisticsSummary.tsx
import React, { useEffect, useState } from "react";
import { useSchedule } from "../context/ScheduleContext";

const StatisticsSummary = () => {
  const { schedules } = useSchedule();

  const [stats, setStats] = useState({
    totalAppointments: 0,
    busiestDoctor: "",
    popularDepartment: "",
  });

  const calculateStats = () => {
    const totalAppointments = schedules.length;

    const doctorCounts = schedules.reduce((acc, curr) => {
      acc[curr.doctorName] = (acc[curr.doctorName] || 0) + 1;
      return acc;
    }, {});

    const busiestDoctor = Object.keys(doctorCounts).reduce((a, b) =>
      doctorCounts[a] > doctorCounts[b] ? a : b,
      "None"
    );

    const departmentCounts = schedules.reduce((acc, curr) => {
      acc[curr.department] = (acc[curr.department] || 0) + 1;
      return acc;
    }, {});

    const popularDepartment = Object.keys(departmentCounts).reduce((a, b) =>
      departmentCounts[a] > departmentCounts[b] ? a : b,
      "None"
    );

    setStats({
      totalAppointments,
      busiestDoctor,
      popularDepartment,
    });
  };

  useEffect(() => {
    calculateStats(); // Initial calculation

    const interval = setInterval(() => {
      calculateStats(); // Real-time updates every 5 seconds
      console.log("Statistics updated in real-time.");
    }, 5000);

    // Clean up the interval when component unmounts
    return () => clearInterval(interval);
  }, [schedules]);

  return (
    <div className="mb-6 bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">📊 Statistics Summary (Real-Time)</h2>
      <p>Total Appointments: <strong>{stats.totalAppointments}</strong></p>
      <p>Busiest Doctor: <strong>{stats.busiestDoctor}</strong></p>
      <p>Most Popular Department: <strong>{stats.popularDepartment}</strong></p>
    </div>
  );
};

export default StatisticsSummary;
