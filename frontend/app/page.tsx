import Image from 'next/image'
import key from "./weatherKey"
import axios from "axios"
import queryString from 'query-string'
import moment from 'moment'
import Icon from '@mdi/react'
import {mdiWifi} from "@mdi/js"

import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: "Abi's Status",
  description: 'The status of Abi',
}

export default async function Home() {
  const weather:string|Boolean = await getWeather();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p className='text-5xl text-white text-center font-dancing'>Abi&apos;s Status</p>
      {weather === "error" ? <p>Wifi Status N/A</p> : <Icon path={mdiWifi} color={weather ? "red" : "green"} size={1}></Icon>}
      <Status weather={weather}></Status>
    </main>
  )
}

type StatusProps = {
  weather: string | Boolean
}
async function Status(props:StatusProps){
  let startTime:Date = new Date();
  startTime.setHours(8,0,0,0);
  const endTime:Date = new Date();
  endTime.setHours(18,0,0,0);

  if((+startTime - Date.now() < 0) && (+endTime - Date.now() > 0) && !props.weather){
    return (
      <p>     
        <Image alt="Abi headshot" width="200" height="200" src="/cropped_headshot.png"></Image>
        Abi should be available 🤔
      </p>
    )
  }
  else if(+startTime - Date.now() > 0){
    return (
      <div className='text-center flex flex-col items-center'>
        <p>Abi hasn&apos;t had her coffee yet. <br/> You probably don&apos;t want to contact her.</p>
        <Image alt="Coffee" width="200" height="200" src="/coffee.png"></Image>
      </div>
    )
  }
  else if(+endTime - Date.now() < 0){
    return (
      <div className='text-center flex flex-col items-center'>
        <p>Abi is fighting crime in Gotham with her evening. <br/> You can only reach her through the batmobile&apos;s number.</p>
        <Image alt="Bat speech bubble" width="200" height="200" src="/bat.png"></Image>
      </div>
    )
  }
  else if(props.weather){
    return (
      <div className='text-center flex flex-col items-center'>
        <p className='font-inter'>Storms are probably cutting out Abi&apos;s internet.</p>
        <span className='text-xs text-secondary'>Florida <em>hates</em> Abi&apos;s Internet.</span>
        <Image alt="Thunderstorm" width="200" height="200" src="/ts.png"></Image>
      </div>
    )
  }
  return <p>Oops no Abi status today</p>
}

async function getWeather(){
  // set the Timelines GET endpoint as the target URL
  const getTimelineURL = "https://api.tomorrow.io/v4/timelines";

  // get your key from app.tomorrow.io/development/keys
  const apikey = key;

  // pick the location, as a latlong pair
  let location = [29.79044554889197, -82.5563356034591];

  // list the fields
  const fields = ["weatherCode"];

  // choose the unit system, either metric or imperial
  const units = "imperial";

  // set the timesteps, like "current", "1h" and "1d"
  const timesteps = ["current"];

  // configure the time frame up to 6 hours back and 15 days out
  const now = moment.utc();
  const startTime = moment.utc(now).add(0, "minutes").toISOString();
  const endTime = moment.utc(now).add(1, "days").toISOString();

  // specify the timezone, using standard IANA timezone format
  const timezone = "America/New_York";

  // request the timelines with all the query string parameters as options
  const getTimelineParameters =  queryString.stringify({
      apikey,
      location,
      fields,
      units,
      timesteps,
      startTime,
      endTime,
      timezone,
  }, {arrayFormat: "comma"});

  try{
    const result = await axios.get(getTimelineURL + "?" + getTimelineParameters)
    return result.data.data.timelines[0].intervals[0].values.weatherCode===8000;
  }
  catch (error) {
    return "Error";
  }
}