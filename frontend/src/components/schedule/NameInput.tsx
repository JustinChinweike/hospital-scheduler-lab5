import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NameInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const NameInput = ({ id, label, value, onChange, error }: NameInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default NameInput;
