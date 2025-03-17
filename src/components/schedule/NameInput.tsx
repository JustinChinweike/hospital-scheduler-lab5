
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NameInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
}

const NameInput = ({ id, label, value, onChange, error }: NameInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}:</Label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        className="bg-teal-100 border-teal-200"
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};

export default NameInput;
