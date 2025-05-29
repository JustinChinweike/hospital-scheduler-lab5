// src/components/AutoScheduler.tsx
import { useEffect } from "react";
import { useSchedule } from "../context/ScheduleContext";

const AutoScheduler = () => {
  useEffect(() => {
    // Just active when the component is mounted
    console.log("AutoScheduler is active (server emits new data every 5s)");
  }, []);

  return null;
};

export default AutoScheduler;