import React, { useState } from "react";
import Papa from "papaparse";
import { useSchedule } from "../context/ScheduleContext";
import { toast } from "../hooks/use-toast";
import { Button } from "./ui/button";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { addSchedule } = useSchedule();

  const handleUpload = () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No File",
        description: "Please select a CSV file first.",
      });
      return;
    }
    setUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let successCount = 0;
        let failCount = 0;
        for (const row of results.data as any[]) {
          // Log row for debugging
          console.log("Parsed row:", row);
          // Validate required fields
          if (
            row.doctorName &&
            row.patientName &&
            row.dateTime &&
            row.department
          ) {
            try {
              await addSchedule({
                doctorName: row.doctorName,
                patientName: row.patientName,
                dateTime: row.dateTime,
                department: row.department,
              });
              successCount++;
            } catch {
              failCount++;
            }
          } else {
            failCount++;
          }
        }
        toast({
          title: "Import Complete",
          description: `Imported ${successCount} schedules${failCount ? `, ${failCount} failed` : ""}.`,
        });
        setFile(null);
        setUploading(false);
      },
      error: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to parse CSV file.",
        });
        setUploading(false);
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={uploading}
      />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload CSV"}
      </Button>
    </div>
  );
};

export default FileUpload;