"use client";

import React, { useEffect, useState } from "react";
import {
  format,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  startOfMonth,
} from "date-fns";

const ContributionGraph = () => {
  const [activityData, setActivityData] = useState<Record<string, number>>({});

  const startDate = startOfYear(new Date(2026, 0, 1));
  const endDate = endOfYear(new Date(2026, 11, 31));
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setActivityData(data));
  }, []);

  const cellSize = 13;
  const gap = 4;
  const totalCellWidth = cellSize + gap;

  const monthLabels = Array.from({ length: 12 }).map((_, i) => {
    const monthStart = startOfMonth(new Date(2026, i, 1));
    const dayOffset = allDays.findIndex(
      (day) => day.getTime() === monthStart.getTime()
    );
    return {
      name: format(monthStart, "MMM"),
      index: Math.floor(dayOffset / 7),
    };
  });

  const getColorClass = (count: number) => {
    if (!count || count === 0) return "bg-gray-100";
    if (count === 1) return "bg-green-200";
    if (count === 2) return "bg-green-400";
    if (count === 3) return "bg-green-600";
    return "bg-green-800";
  };

  return (
    <div className="flex flex-col items-center w-full overflow-x-auto p-6 bg-white rounded-lg border">
      <div className="relative inline-block">
        {/* 월별 라벨 */}
        <div className="flex mb-3 text-[11px] text-gray-500 h-4">
          <div className="w-10" />
          {monthLabels.map((month, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `${month.index * totalCellWidth + 40}px` }}
            >
              {month.name}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {/* 요일 라벨 */}
          <div className="flex flex-col gap-1 text-[11px] text-gray-400 pr-2 pt-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
              <div
                key={day}
                style={{ height: `${cellSize}px` }}
                className="flex items-center"
              >
                {i % 2 === 1 ? day : ""}
              </div>
            ))}
          </div>

          {/* 잔디 격자 */}
          <div
            className="grid grid-flow-col"
            style={{
              gridTemplateRows: `repeat(7, ${cellSize}px)`,
              gap: `${gap}px`,
            }}
          >
            {allDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const count = activityData[dateKey] || 0;

              return (
                <div
                  key={day.toISOString()}
                  title={`${dateKey}: ${count} activities`}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  className={`rounded-[2.5px] ${getColorClass(
                    count
                  )} hover:ring-2 hover:ring-gray-300 transition-all cursor-pointer`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
