"use client"

import key from "./weatherKey"
import axios from "axios"
import queryString from 'query-string'
import Icon from '@mdi/react'
import {mdiCalendar, mdiWifi} from "@mdi/js"
import {useState, useEffect} from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from "next/image"
 
export const metadata: Metadata = {
  title: "Abi's Status",
  description: 'The status of Abi',
}

export default function Home() {
  // Tomorrow.io consts
  const getTimelineURL = "https://api.tomorrow.io/v4/weather/realtime";
  const apikey = key;
  let location = [29.79044554889197, -82.5563356034591];  // Alachua
  const fields = ["weatherCode"];
  const units = "imperial";
  const timezone = "America/New_York";

  const [time, setTime] = useState(Date.now());
  const [weather, setWeather] = useState<Boolean | string>(false);
  const [loading, setLoading] = useState<Boolean>(false);

  const loadData = ()=>{
    // Update time
    setTime(Date.now());
    
    // Update date
    const getTimelineParameters =  queryString.stringify({apikey, location, fields, units, timezone}, {arrayFormat: "comma"});
    axios.get(getTimelineURL + "?" + getTimelineParameters)
    .then((response) => {
      setWeather(response.data.data.weatherCode)
    })
    .catch(() => {
      setWeather("Error");
    })
    .finally(() =>{
      setLoading(false);
    });
  }
  
  // Load data on startup
  useEffect(()=>{
    loadData(); 
  }, [])

  // Set interval to load once every 200 seconds (api limits)
  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      loadData();
    }, 200000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="text-white flex min-h-screen flex-col items-center justify-between p-24 bg-[linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(160,15,215,1) 35%, rgba(0,212,255,1) 100%)]">
      <div className='px-8 text-white text-center font-dancing flex justify-between w-screen items-center'>
        <div className='flex'><Icon path={mdiCalendar} size={1} color="white"></Icon>8 AM - 6 PM EST</div>
        <span className='text-5xl '>Abi&apos;s Status</span>
        <div className='flex items-center'>Storms:&nbsp; {weather === "Error" ? <span>?</span> : <div style={{background: weather ? "red" : "lightgreen", width: "16px", height: "16px", borderRadius: "99999px"}}></div>}</div>
      </div>
      <div className='bg-white rounded-full w-8 h-8 flex justify-center items-center'>
        {loading ? <div className='animate-spin h-5 w-5 ma-2'><Icon path={mdiWifi} color="black" size={1} /></div> :
        weather === "Error" ? <p className="text-black">?</p> : <Icon path={mdiWifi} color={weather ? "red" : "lightgreen"} size={1}></Icon>}
      </div>
      <Status weather={weather} time={time}></Status>
    </main>
  )
}

type StatusProps = {
  weather: string | Boolean
  time: Number
}

function Status(props:StatusProps){
  let startTime:Date = new Date();
  startTime.setHours(8,0,0,0);
  const endTime:Date = new Date();
  endTime.setHours(18,0,0,0);

  if((+startTime - +props.time < 0) && (+endTime - +props.time > 0)){
    return (
      <p className="flex flex-col items-center">     
        <Image className='rounded-full' alt="Abi headshot" width="200" height="200" src="/cropped_headshot.png"/>
        {props.weather==="Error" ? "No data on storms so who knows!" : props.weather ?
          <div className='text-center flex flex-col items-center'>
            <p className='font-inter'>Storms are probably cutting out Abi&apos;s internet.</p>
            <span className='text-xs text-secondary'>Florida <em>hates</em> Abi&apos;s Internet.</span>
            <Image alt="Thunderstorm" width="200" height="200" src="/ts.png"/>
          </div>
        :
        " Abi should be available 🤔"}
      </p>
    )
  }
  else if(+startTime - +props.time > 0){
    return (
      <div className='text-center flex flex-col items-center'>
        <p>Abi hasn&apos;t had her coffee yet. <br/> You probably don&apos;t want to contact her.</p>
        <Image alt="Coffee" width="200" height="200" src="/coffee.png"/>
      </div>
    )
  }
  else if(+endTime - +props.time < 0){
    return (
      <div className='text-center flex flex-col items-center'>
        <p>Abi is fighting crime in Gotham with her evening. <br/> You can only reach her through the batmobile&apos;s number.</p>
        <Image alt="Bat speech bubble" width="200" height="200" src="/bat.png"/>
      </div>
    )
  }
  return <p>Oops no Abi status today</p>
}
