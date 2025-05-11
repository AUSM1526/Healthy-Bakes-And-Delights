import React from "react";
import Navbar from "../components/Navbar";
import First from "../components/Home/First";
import Second from "../components/Home/Second";
import Third from "../components/Home/Third";
import Spinner from "../components/Spinner";
import { useState } from "react";
import { useEffect } from "react";

const Home = () => {
    
    useEffect(() => {
        simulateLoading();
        window.scrollTo(0, 0);
    }, []);

    const [loading, setLoading] = useState(false);

    const simulateLoading = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    return (
        <>
            <Navbar/>
            {loading && <Spinner/>}
            {!loading && (
                <div className="bg-[#F9F4EF]">
                    <First/>
                    <Second/>
                    <Third/>
                </div>
            )}
        </>
    );
}

export default Home;