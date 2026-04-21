"use client";

import { useEffect, useState } from "react";

type RobotCommand = {
  code: string
  value: boolean | string | number
}

type MapType = {
  id: string
  name: string
}

type TuyaStatus = {
  code: string
  value: boolean | string | number
}

export default function RobotDashboard() {

  const [maps,setMaps] = useState<MapType[]>([])
  const [status,setStatus] = useState("Ready")

  const [robotMode,setRobotMode] = useState("unknown")
  const [cleanCount,setCleanCount] = useState<number | null>(null)
  const [cleanTime,setCleanTime] = useState<number | null>(null)
  const [cleanArea,setCleanArea] = useState<number | null>(null)

  async function loadMaps(){

    const res = await fetch("/api/robot/maps/list")
    const data = await res.json()

    setMaps(data)

  }

  async function saveMap(id:string,name:string){

    await fetch("/api/robot/maps/save",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({id,name})
    })

    loadMaps()

  }

  async function deleteMap(id:string){

    const confirmDelete = confirm("Delete this map?")
    if(!confirmDelete) return

    await fetch("/api/robot/maps/delete",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({id})
    })

    loadMaps()

  }

  async function sendCommand(command:RobotCommand,label:string){

    setStatus("Sending...")

    await fetch("/api/robot/control",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({command})
    })

    setStatus(label)

  }

useEffect(() => {

  const start = () => {

    const run = async () => {

      try {

        const res = await fetch("/api/robot/status")
        const data = await res.json()

        if (data.result) {

          const mode = data.result.find((s:TuyaStatus)=>s.code==="mode")
          const count = data.result.find((s:TuyaStatus)=>s.code==="clean_count")
          const time = data.result.find((s:TuyaStatus)=>s.code==="total_clean_time")
          const area = data.result.find((s:TuyaStatus)=>s.code==="total_clean_area")

          if(mode) setRobotMode(String(mode.value))
          if(count) setCleanCount(Number(count.value))
          if(time) setCleanTime(Number(time.value))
          if(area) setCleanArea(Number(area.value))

        }

        const mapsRes = await fetch("/api/robot/maps/list")
        const mapsData = await mapsRes.json()

        setMaps(mapsData)

      } catch(err){

        console.error(err)

      }

    }

    run()

    const interval = setInterval(run,5000)

    return ()=>clearInterval(interval)

  }

  const cleanup = start()

  return cleanup

},[])

  return (

    <div className="max-w-7xl mx-auto px-4 py-8 text-white">

      {/* TITLE */}

      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Robot Control Panel
      </h1>


      {/* STATUS */}

      <div className="bg-slate-900 p-5 rounded-xl mb-8">

        <h2 className="text-lg font-semibold mb-2">
          Robot Status
        </h2>

        <div className="flex flex-wrap gap-4 text-sm">

          <div>
            Mode:
            <span className="ml-2 text-green-400 font-semibold">
              {robotMode}
            </span>
          </div>

          <div>
            State:
            <span className="ml-2">
              {status}
            </span>
          </div>

        </div>

      </div>


      {/* MAPS */}

      <div className="mb-10">

        <h2 className="text-lg font-semibold mb-4">
          Maps
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {/* MAP 1 */}

          <div className="bg-slate-900 p-5 rounded-xl">

            <h3 className="font-semibold mb-2">
              Map 1
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              Parter
            </p>

            <div className="bg-black h-36 md:h-40 rounded-lg mb-4 flex items-center justify-center text-gray-500">
              map preview
            </div>

            <div className="space-y-2">

              <button
                onClick={()=>sendCommand({code:"power",value:true},"Start Map 1")}
                className="w-full bg-green-600 hover:bg-green-500 py-2 rounded cursor-pointer"
              >
                Start Cleaning
              </button>

              <button
                onClick={()=>saveMap("map1","Parter")}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded cursor-pointer"
              >
                Save Map
              </button>

              <button
                onClick={()=>deleteMap("map1")}
                className="w-full bg-red-600 hover:bg-red-500 py-2 rounded cursor-pointer"
              >
                Delete Map
              </button>

            </div>

          </div>


          {/* MAP 2 */}

          <div className="bg-slate-900 p-5 rounded-xl">

            <h3 className="font-semibold mb-2">
              Map 2
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              Etaj
            </p>

            <div className="bg-black h-36 md:h-40 rounded-lg mb-4 flex items-center justify-center text-gray-500">
              map preview
            </div>

            <div className="space-y-2">

              <button
                onClick={()=>sendCommand({code:"power",value:true},"Start Map 2")}
                className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded cursor-pointer"
              >
                Start Cleaning
              </button>

              <button
                onClick={()=>saveMap("map2","Etaj")}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded cursor-pointer"
              >
                Save Map
              </button>

              <button
                onClick={()=>deleteMap("map2")}
                className="w-full bg-red-600 hover:bg-red-500 py-2 rounded cursor-pointer"
              >
                Delete Map
              </button>

            </div>

          </div>


          {/* FUTURE MAP */}

          <div className="bg-slate-800 p-5 rounded-xl border border-dashed border-gray-600 flex flex-col justify-center items-center">

            <p className="text-gray-400 mb-3 text-sm">
              Add new map
            </p>

            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
              + Add Map
            </button>

          </div>

        </div>

      </div>



      {/* CONTROLS */}

      <div className="mb-10">

        <h2 className="text-lg font-semibold mb-4">
          Robot Controls
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">

          <button
            onClick={()=>sendCommand({code:"power",value:false},"Stop")}
            className="bg-red-600 py-3 rounded hover:bg-red-500 cursor-pointer"
          >
            Stop
          </button>

          <button
            onClick={()=>sendCommand({code:"mode",value:"chargego"},"Return Dock")}
            className="bg-yellow-600 py-3 rounded hover:bg-yellow-500 cursor-pointer"
          >
            Go Charger
          </button>

          <button
            onClick={()=>sendCommand({code:"seek",value:true},"Find Robot")}
            className="bg-purple-600 py-3 rounded hover:bg-purple-500 cursor-pointer"
          >
            Find Robot
          </button>

        </div>

      </div>



      {/* STATS */}

      <div>

        <h2 className="text-lg font-semibold mb-4">
          Cleaning Statistics
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">

          <div className="bg-slate-900 p-5 rounded-xl">
            <p className="text-sm text-gray-400">
              Clean Count
            </p>

            <p className="text-xl font-bold">
              {cleanCount ?? "..."}
            </p>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl">
            <p className="text-sm text-gray-400">
              Total Clean Time
            </p>

            <p className="text-xl font-bold">
              {cleanTime ?? "..."} min
            </p>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl">
            <p className="text-sm text-gray-400">
              Total Area
            </p>

            <p className="text-xl font-bold">
              {cleanArea ?? "..."} m²
            </p>
          </div>

        </div>

      </div>

    </div>

  )
}