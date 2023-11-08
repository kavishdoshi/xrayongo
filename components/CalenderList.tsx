"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { subDays } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CalenderListProps {
  className?: string;
  date: Date | undefined;
  onSelect (date: Date): void ;
  disabled: boolean

}


export const CalenderList: React.FC<CalenderListProps> = ({ className, date, onSelect , disabled}) => {


  return (

    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date: Date | undefined) => {
            if (date) {
              onSelect(date);
            }
          }}
          initialFocus
          disabled={(date) => date < subDays(new Date(), 1) }
        />
      </PopoverContent>
    </Popover>

  )
}
