import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateTimeSelectorProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  dateError?: string;
  timeError?: string;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  dateError,
  timeError
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                dateError && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {dateError && <p className="text-sm text-red-500">{dateError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input
          type="time"
          id="time"
          value={selectedTime}
          onChange={(e) => onTimeChange(e.target.value)}
          className={cn(timeError && "border-red-500")}
        />
        {timeError && <p className="text-sm text-red-500">{timeError}</p>}
      </div>
    </div>
  );
};
