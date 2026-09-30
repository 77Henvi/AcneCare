"use client";

import React from "react";

const trustItems = [
  {
    icon: (
      <svg className="h-6 w-6 stroke-[#2E5033]" fill="none" viewBox="0 0 24 24" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "อิงหลักการแพทย์ผิวหนัง",
    subtitle: "ภาควิชาตจวิทยา ศิริราช",
  },
  {
    icon: (
      <svg className="h-6 w-6 stroke-[#2E5033]" fill="none" viewBox="0 0 24 24" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
      </svg>
    ),
    title: "จำแนกสิว 7 ชนิด",
    subtitle: "ตรวจจับตามตำแหน่ง 5 โซน",
  },
  {
    icon: (
      <svg className="h-6 w-6 stroke-[#2E5033]" fill="none" viewBox="0 0 24 24" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "ประมวลผลบนเครื่อง (Client-Side)",
    subtitle: "ไม่ส่งภาพขึ้นเซิร์ฟเวอร์ ปลอดภัย 100%",
  },
  {
    icon: (
      <svg className="h-6 w-6 stroke-[#2E5033]" fill="none" viewBox="0 0 24 24" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
    ),
    title: "จับคู่ตัวยามาตรฐานการแพทย์",
    subtitle: "BP, BHA, Adapalene, Azelaic",
  },
];

export default function TrustBar() {
  return (
    <div className="border-b border-sand-300/60 bg-white py-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-8 md:grid-cols-4 md:gap-6">
        {trustItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 py-1">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF2EC]">
              {item.icon}
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1C3321] sm:text-sm">{item.title}</h3>
              <p className="text-[11px] text-[#445E49] sm:text-xs">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
