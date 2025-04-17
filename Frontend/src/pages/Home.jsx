import React from "react";
import Navbar from "../components/Navbar";
import First from "../components/Home/First";
import Second from "../components/Home/Second";
import Third from "../components/Home/Third";

const Home = () => {
    return (
        <>
            <Navbar/>
            <div className="bg-[#F9F4EF]">
                <First/>
                <Second/>
                <Third/>
            </div>
        </>
    );
}

export default Home;