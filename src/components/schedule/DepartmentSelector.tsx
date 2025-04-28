import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departments } from "@/data/mockData";

interface DepartmentSelectorProps {
  department: string;
  setDepartment: (value: string) => void;
  error?: string;
}

const DepartmentSelector = ({
  department,
  setDepartment,
  error,
}: DepartmentSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="department-select">Department</Label>
      <Select value={department} onValueChange={setDepartment}>
        <SelectTrigger id="department-select" className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Select a department" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DepartmentSelector;
