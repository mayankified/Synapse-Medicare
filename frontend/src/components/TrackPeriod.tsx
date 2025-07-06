"use client";

import "./polyfill-global";
import { useState } from "react";
import { jsPDF } from "jspdf";
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";


import { Button } from "@/components/ui/button";


import { Calendar, Plus, Minus, Download } from "lucide-react";


import "./TrackPeriod.css";
import TrackResults from "./TrackResults";

export default function TrackPeriod() {
    const [date, setDate] = useState(moment()); 
    const [focusedInput, setFocusedInput] = useState(false);
    const [count, setCount] = useState(5);
    const [cycleCount, setCycleCount] = useState(28);
    const [doReveal, setDoReveal] = useState(false);

    const handleDaysLast = (isMinus: boolean) => {
        setCount((prev) => (isMinus ? (prev > 1 ? prev - 1 : 10) : prev >= 10 ? 1 : prev + 1));
    };

    const handleMenstrualCycle = (isMinus: boolean) => {
        setCycleCount((prev) => (isMinus ? (prev > 18 ? prev - 1 : 40) : prev >= 40 ? 18 : prev + 1));
    };

    
    const check = (momentDate: moment.Moment) => {
        return !momentDate.isBetween(
            moment().subtract(1, "M").subtract(moment().date(), "days"),
            moment().add(3, "M").add(moment().date(), "days")
        );
    };

    const generatePDF = () => {
        const doc = new jsPDF("l", "pt", "A3");
        doc.html(document.querySelector("#Results") as HTMLElement, {
            callback: function (pdf) {
                pdf.save("Menstrual_Tracker.pdf");
            },
        });
    };

    return (
        <div className="flex flex-col h-[100vh]  items-center justify-center">
            <div
                className="absolute mx-auto w-full h-[100vh] z-[1] opacity-30 bg-no-repeat bg-contain"
                style={{
                    backgroundImage: "url('./vag.png')",
                    mixBlendMode: "multiply"  
                }}
            ></div>


            
            <h1 className="text-4xl font-extrabold text-rose-600 mb-4">
                🌸 Menstrual Cycle Tracker 🌸
            </h1>
            <p className="text-lg italic text-pink-500 mb-6">
                "Embrace your cycle, it’s a part of your beautiful journey. 🌸"
            </p>

            
            {!doReveal && (
                <div className="bg-purple-100 rounded-lg z-10 p-6 w-full max-w-4xl">
                    <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
                        
                        <div>
                            <h2 className="text-lg font-semibold mb-3">
                                When did your last period start?
                            </h2>
                            <div className="flex items-center justify-center space-x-2">
                                <div>
                                    <SingleDatePicker
                                        date={date}
                                        onDateChange={(date) => setDate(date!)}
                                        focused={focusedInput}
                                        onFocusChange={({ focused }) => setFocusedInput(focused!)}
                                        id="your_unique_id"
                                        displayFormat={() => "D"}
                                        renderDayContents={(momentDate: moment.Moment) => (
                                            <div>{momentDate.date()}</div>
                                        )}
                                        numberOfMonths={1}
                                        isOutsideRange={check}
                                        readOnly
                                        noBorder
                                        customInputIcon={<Calendar size={18} className="mr-2" />}
                                    />
                                </div>
                                <div className="text-left cursor-pointer" onClick={() => setFocusedInput(true)}>
                                    <div className="font-medium">{date.format("dddd")}</div>
                                    <div className="text-sm">{date.format("MMMM")}</div>
                                </div>
                            </div>
                        </div>

                        
                        <div>
                            <h2 className="text-lg font-semibold mb-3">
                                How many days did it last?
                            </h2>
                            <div className="flex items-center justify-center space-x-4">
                                <Button variant="outline" onClick={() => handleDaysLast(true)}>
                                    <Minus size={16} />
                                </Button>
                                <span className="text-xl font-bold">{count}</span>
                                <Button variant="outline" onClick={() => handleDaysLast(false)}>
                                    <Plus size={16} />
                                </Button>
                            </div>
                        </div>

                        
                        <div>
                            <h2 className="text-lg font-semibold mb-3">
                                Duration of menstrual cycle?
                            </h2>
                            <div className="flex items-center justify-center space-x-4">
                                <Button variant="outline" onClick={() => handleMenstrualCycle(true)}>
                                    <Minus size={16} />
                                </Button>
                                <span className="text-xl font-bold">{cycleCount}</span>
                                <Button variant="outline" onClick={() => handleMenstrualCycle(false)}>
                                    <Plus size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        {!doReveal ? (
                            <Button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold"
                                onClick={() => setDoReveal(true)}
                            >
                                Track Now
                            </Button>
                        ) : (
                            <Button variant="default" asChild className="bg-pink-500 hover:bg-pink-600 text-white font-semibold">
                                <a href="#Results">Look below</a>
                            </Button>
                        )}
                    </div>

                    
                    <p className="mt-4 text-[16px] font-semibold text-red-600 bg-pink-200 p-3 rounded-md text-center">
                        ⚠️ This tracker works best for individuals with <span className="font-bold">
                            regular cycles.
                        </span> If you have <span className="font-bold">
                            PCOS, thyroid imbalances, hormonal disorders, or irregular periods
                        </span>

                        , the predictions may not be accurate.
                        It’s always recommended to consult a healthcare professional for personalized insights.
                    </p>
                </div>
            )}

            
            {doReveal && (
                <div className="w-full max-w-5xl">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex flex-col md:flex-row items-center gap-4 mt-2 mb-4">
                            <Button asChild variant="default" className="bg-pink-500 text-white">
                                <a href="/track">Back</a>
                            </Button>
                            <h3 className="text-xl font-bold">
                                Menstruation estimation for the next 3 months
                            </h3>
                        </div>

                        
                        <div id="Results" className="mx-auto flex flex-col items-center justify-center">
                            <TrackResults startPeriodDate={date} daysLast={count} cycleCount={cycleCount} />
                        </div>

                        <p className="text-sm text-gray-500 mt-6">
                            Please note that this is only an estimation of your menstrual cycle.
                        </p>

                        
                        <div className="mt-4">
                            <Button className="bg-pink-500 text-white font-semibold" onClick={generatePDF}>
                                <Download size={16} className="mr-2" />
                                Download your calendar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
