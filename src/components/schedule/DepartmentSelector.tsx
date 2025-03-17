
import { departments } from "@/data/mockData";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepartmentSelectorProps {
  department: string;
  setDepartment: (department: string) => void;
  error: string;
}

const DepartmentSelector = ({
  department,
  setDepartment,
  error,
}: DepartmentSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="department">DEPARTMENT:</Label>
      <Select value={department} onValueChange={setDepartment}>
        <SelectTrigger className="bg-teal-100 border-teal-200">
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};

export default DepartmentSelector;
