import { useState } from "react";
import { apiClient } from "@/api/apiClient";
import { toast } from "@/hooks/use-toast";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file)
      return toast({
        title: "No File",
        description: "Please select a file first.",
      });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("doctorName", "File Doctor");
    formData.append("patientName", "File Patient");
    formData.append("dateTime", new Date().toISOString());
    formData.append("department", "Radiology");

    try {
      await apiClient.post("/schedules", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded * 100) / (e.total || 1))),
      });
      toast({
        title: "File Uploaded",
        description: "Appointment created with file.",
      });
      setFile(null);
      setProgress(0);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Upload failed",
      });
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*,application/pdf,video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      {progress > 0 && <p>Uploading… {progress}%</p>}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;














// // src/components/FileUpload.tsx
// import React, { useState } from "react";
// import { apiClient } from "@/api/apiClient";
// import { toast } from "@/hooks/use-toast";

// const FileUpload = () => {
//   const [file, setFile] = useState<File | null>(null);

//   const handleUpload = async () => {
//     if (!file) return toast({ title: "No File", description: "Please select a file first." });

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("doctorName", "File Doctor");
//     formData.append("patientName", "File Patient");
//     formData.append("dateTime", new Date().toISOString());
//     formData.append("department", "Radiology");

//     const res = await apiClient.post("/schedules", formData);
//     toast({ title: "File Uploaded", description: "Appointment created with file." });
//   };

//   return (
//     <div>
//       <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// };

// export default FileUpload;
