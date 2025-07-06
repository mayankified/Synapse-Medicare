import  { useState, useEffect } from "react";
import { DayPickerRangeController } from "react-dates";
import moment from "moment";
// Remove import of MUI Grid
// import Grid from "@mui/material/Grid"; // NOT needed anymore

type TrackResultsProps = {
  startPeriodDate: moment.Moment;
  daysLast: number;
  cycleCount: number;
};

export default function TrackResults({
  startPeriodDate,
  daysLast,
  cycleCount,
}: TrackResultsProps) {
  const [focusedInput, setFocusedInput] = useState<"START_DATE" | "END_DATE">(
    "START_DATE"
  );
  const [initialMonth, setInitialMonth] = useState<moment.Moment | null>(
    startPeriodDate
  );

  // We'll track the first/last days of the period in an array
  const [menses, setMenses] = useState<moment.Moment[]>([
    startPeriodDate.clone(),
    startPeriodDate.clone().add(daysLast, "days"),
  ]);

  // Basic mobile detection (NOT SSR-safe)
  const [isMobile] = useState<boolean>(window.innerWidth < 800);

  useEffect(() => {
    // Update the menses array when props change
    setMenses([
      startPeriodDate.clone(),
      startPeriodDate.clone().add(daysLast, "days"),
    ]);
    // Force DayPickerRangeController to reset the initialMonth
    setInitialMonth(null);
    setTimeout(() => setInitialMonth(startPeriodDate.clone()), 300);
  }, [startPeriodDate, daysLast]);

  // Check if a day should display an indicator (🩸)
  const check = (momentDate: moment.Moment) => {
    return (
      momentDate.isBetween(
        menses[0].clone().subtract(1, "days"),
        menses[1].clone()
      ) ||
      momentDate.isBetween(
        menses[0].clone().add(cycleCount, "days").subtract(1, "days"),
        menses[1].clone().add(cycleCount, "days")
      ) ||
      momentDate.isBetween(
        menses[0]
          .clone()
          .add(cycleCount * 2, "days")
          .subtract(1, "days"),
        menses[1].clone().add(cycleCount * 2, "days")
      ) ||
      momentDate.isBetween(
        menses[0]
          .clone()
          .add(cycleCount * 3, "days")
          .subtract(1, "days"),
        menses[1].clone().add(cycleCount * 3, "days")
      )
    );
  };

  // Check if a day should be highlighted
  const checkHighlight = (momentDate: moment.Moment) => {
    return (
      momentDate.isBetween(
        menses[0].clone().subtract(1, "days"),
        menses[1].clone().subtract(1, "days")
      ) ||
      momentDate.isBetween(
        menses[0].clone().add(cycleCount, "days").subtract(1, "days"),
        menses[1].clone().add(cycleCount, "days").subtract(1, "days")
      ) ||
      momentDate.isBetween(
        menses[0]
          .clone()
          .add(cycleCount * 2, "days")
          .subtract(1, "days"),
        menses[1]
          .clone()
          .add(cycleCount * 2, "days")
          .subtract(1, "days")
      ) ||
      momentDate.isBetween(
        menses[0]
          .clone()
          .add(cycleCount * 3, "days")
          .subtract(1, "days"),
        menses[1]
          .clone()
          .add(cycleCount * 3, "days")
          .subtract(1, "days")
      )
    );
  };

  return (
    <div className="w-full">
      <DayPickerRangeController
        // Tied to your date range, if you want to manipulate it
        // startDate={startDate}
        // endDate={endDate}
        // onDatesChange={({ startDate, endDate }) => { ... }}

        // Focus / Calendar Props
        // @ts-ignore
        focusedInput={focusedInput}
        onFocusChange={(fi) => {
          // If you want to actually switch focus:
          // @ts-ignore
          if (fi) setFocusedInput(fi);
        }}
        initialVisibleMonth={() => (initialMonth ? initialMonth : moment())}
        numberOfMonths={isMobile ? 1 : 3}

        // Restrict calendar range
        minDate={moment().subtract(1, "M")}
        maxDate={moment().add(3, "M")}

        // Custom day rendering
        renderDayContents={(momentDate) => (
          <div className="flex flex-col items-center text-sm">
            {check(momentDate) && <span>🩸</span>}
            <span>{momentDate.date()}</span>
          </div>
        )}

        // Highlight days
        isDayHighlighted={(momentDate) => checkHighlight(momentDate)}
      />
    </div>
  );
}
