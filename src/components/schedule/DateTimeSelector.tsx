
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimeSelectorProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
  dateError: string;
  timeError: string;
}

const DateTimeSelector = ({
  date,
  setDate,
  time,
  setTime,
  dateError,
  timeError,
}: DateTimeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="date">DATE & TIME:</Label>
      <div className="flex gap-4">
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full bg-teal-100 border-teal-200 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {dateError && (
            <p className="text-destructive text-sm">{dateError}</p>
          )}
        </div>

        <div className="flex-1">
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-teal-100 border-teal-200 h-10"
          />
          {timeError && (
            <p className="text-destructive text-sm">{timeError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelector;
