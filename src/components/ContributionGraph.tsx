"use client";

import React from "react";

// 임시 데이터 (나중에 서버에서 실제 게시글 날짜 데이터를 받아와야 합니다)
const generateMockData = () => {
  const data: Record<string, number> = {};
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    data[dateStr] = Math.floor(Math.random() * 5); // 0~4개 사이의 랜덤 데이터
  }
  return data;
};

export default function ContributionGraph() {
  const data = generateMockData();
  const days = Array.from({ length: 91 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (90 - i));
    return date.toISOString().split("T")[0];
  });

  const getColor = (count: number) => {
    if (!count || count === 0) return "bg-gray-100";
    if (count === 1) return "bg-green-200";
    if (count === 2) return "bg-green-300";
    if (count === 3) return "bg-green-500";
    return "bg-green-700";
  };

  return (
    <div className="flex flex-wrap gap-1">
      {days.map((date) => (
        <div
          key={date}
          title={`${date}: ${data[date] || 0} posts`}
          className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${getColor(
            data[date] || 0
          )} transition-colors`}
        />
      ))}
    </div>
  );
}
