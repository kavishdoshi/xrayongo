"use client"

import { CalenderList } from "@/components/CalenderList"
import toast from "react-hot-toast";
import { add } from "date-fns";
import prisma from "@/lib/prisma"
import axios from "axios";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useState } from "react";
import { useRouter } from "next/navigation";

const getTimes = async (justDate: Date) => {
  // Time Range
  var beginning = add(justDate, { hours: 9 });
  const end = add(justDate, { hours: 18 });
  const interval = 60; //in minutes

  const times = [];

  // if date is today, remove the times that have already passed
  if(justDate.getDate() === new Date().getDate()){
    const currentHoursPassed = new Date().getHours() + 2;
    beginning = add(justDate, { hours: currentHoursPassed });
  }


  // TODO: Call an api to get the booked times for the day and remove from below array
  for (let i = beginning; i<= end; i = add(i, { minutes: interval })) {
    var data = {
      time: i.toLocaleString(),
    }
    const booked = await axios.post("/api/appointment", data);

    if(booked.data.appointments.length === 0)
    {
      times.push(i);
    }
    
  }

  return times;

}

interface BookAnAppointmentFormProps {
  email: string;
}


export const BookAnAppointmentForm:React.FC<BookAnAppointmentFormProps> = ({email}) => {
  const [disabled, setDisabled] = useState(false);
  const [date, setDate] = useState<Date>();
  const [timeList, setTimeList] = useState<Date[]>([]);
  const [addressline1, setAddressline1] = useState<string>("");
  const [addressline2, setAddressline2] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const router = useRouter();

  const handleDateChange = async (date: Date) => {
    setDate(date);
     const timeList = await getTimes(date);
      setTimeList(timeList);
  };

  const handleNextOnClick = async () => {
    try {
        setDisabled(true);
        var flag = 0;
        // get the values from the form

        if (addressline1.length < 5 || addressline2.length < 5){
          toast.error("Please enter a valid address");
          console.log(addressline1.length);
          flag = 1;
        }

        if (area == ""){
          toast.error("Please select an area");
          console.log(area);
          flag = 1;
        }

        if (city === ""){
          toast.error("Please select a city");
          console.log(city);
          flag = 1;
     
        }

        if (date === undefined){
          toast.error("Please select a date");
          console.log(date);
          flag = 1;
        }

        if(selectedTime === ""){
          toast.error("Please select a time");
          flag = 1;
        }

        if(countryCode === ""){
          toast.error("Please select a country code");
          console.log(countryCode);
          flag = 1;
        }

        if (phoneNumber.length !== 10){
          toast.error("Please enter a valid phone number");
          console.log(phoneNumber.length);
          flag = 1;
        }

        if(flag === 0){
          //API call to set this selection in a temporary database
          console.log("API call to set this selection in a temporary database");
          const data = {
            addressline1: addressline1,
            addressline2: addressline2,
            area: area,
            city: city,
            date: date,
            time: selectedTime,
            phonenumber: phoneNumber,
            countrycode: countryCode,
            email: email,
          }
          await axios.patch('/api/appointment', data);
          toast.success("Appointment booked successfully");
          router.push("/payment");
      
        }
        


    } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
    }
    finally{
      setDisabled(false);
    }
  }



  return (
    <Card >
      <CardHeader>
        <CardTitle>Book an appointment</CardTitle>
        <CardDescription>
          Please fill out the form to book an appointment
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="adress">Address</Label>
          <Input id="line1" placeholder=" Address Line 1"  value={addressline1} disabled={disabled} onChange={ (e) => setAddressline1(e.target.value)}/>
        </div>
        <div className="grid gap-2">
          <Input id="line2" placeholder="Address Line 2" disabled={disabled} value={addressline2} onChange={(e) => setAddressline2(e.target.value) }/>
        </div>
          <div className="grid gap-2">
            <Label htmlFor="area">Area</Label>
            <Select onValueChange={(e) => setArea(e)}>
              <SelectTrigger id="area" className="line-clamp-1 w-full truncate" disabled={disabled} >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vastrapur">Vastrapur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        <div className="grid gap-2">
            <Label htmlFor="City">City</Label>
            <Select onValueChange={(e) => setCity(e)} >
              <SelectTrigger id="cities" className="line-clamp-1 w-full truncate" disabled={disabled} >
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
              </SelectContent>
            </Select>
          </div>
            
        <div className="grid gap-6">   
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <CalenderList date={date} onSelect={handleDateChange} disabled={disabled}/>
        </div>
        </div>
        <div className="grid gap-6">   
        <div className="grid gap-2">
          <Label htmlFor="time">Time</Label>
          <Select onValueChange={(e)=> setSelectedTime(e)} >
              <SelectTrigger
                id="time"
                className="line-clamp-1 w-full truncate"
                disabled={disabled}
              >
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {
                  timeList.map((time) => (
                    <SelectItem key={time.toLocaleString()} value={time.toLocaleString()}>{time.toLocaleString().split(",")[1]}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
        </div>
        </div>
        <div className="grid gap-2">
          
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Select onValueChange={(e) => setCountryCode(e)}>
              <SelectTrigger id="code" disabled={disabled}>
                <SelectValue placeholder="Select country code"  defaultValue="1"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">+91</SelectItem>
              </SelectContent>
            </Select>
          <Input id="phone" placeholder="0000000000" disabled={disabled} onChange={(e) => setPhoneNumber(e.target.value)}/>
        </div>
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button disabled={disabled} variant="ghost">Cancel</Button>
        <Button onClick={handleNextOnClick} disabled={disabled}>Next</Button>
      </CardFooter>
      
    </Card>
  )
}