"use client"

import Header from "../header";
import TravelgroupListView from "@/components/travelgroups/travelgroup-list-view";
import { getTravelGroupList } from "@/lib/travelgroup-api";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getMe } from "@/lib/travelgroup-api";

export default function Home() {
  const [travelGroupList, setTravelGroupList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const userData = await getMe();
      localStorage.setItem("user", JSON.stringify(userData));
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const data = await getTravelGroupList();
      setTravelGroupList(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Header text="모임 관리" icon="back" parent="/"></Header>

      <div className="travelgroup-container">        
        <TravelgroupListView travelGroupList={travelGroupList} />
        
        <button
          className="add-button bottom-button-postion"
          onClick={() => router.push('/travelgroups/post')}
        >
          <p className="add-button-text bold">+</p>
        </button>
      </div>
    </div>
  );
}