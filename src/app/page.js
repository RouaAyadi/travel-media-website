import React from 'react';
import { fetchAllPosts } from "../../utils/user";
import Homepage from "./components/Homepage";

export default async function Home() {
  const tripResp = await fetchAllPosts();
  return ( 
    <div className="container mx-auto ">
      <Homepage trips={tripResp?.data}  ></Homepage>
    </div>
  )
}