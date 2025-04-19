import React from "react";
import Navbar from "../components/Navbar";
import First from "../components/Home/First";
import Second from "../components/Home/Second";
import Third from "../components/Home/Third";
import { useEffect } from "react";

const Home = () => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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