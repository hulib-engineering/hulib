'use client';
import {Clock, User, Note, CaretUp } from '@phosphor-icons/react';
import Image from 'next/image';

function DetailEventHuber() {
  return (
    <div className=" bg-[#F0F5FF] py-[16px] px-[20px] rounded-[16px] w-[396px] min-h-[360px] drop-shadow-sm shadow-[#1C1E211A] overflow-hidden">
      <div className="flex items-center">
        <h3 className="text-[20px] leading-[32px] text-[#171819] flex-1">Session with Liber</h3>
        <p className="mx-[8px] rounded-[100px] w-[107px] h-[32px] py-[2px] px-[10px] bg-[#FFC745] align-middle text-center text-[#000000]">Pending...</p>
        <CaretUp size={24} color="#000"/>
      </div>
      <div className="flex items-center mt-[16px]">
        <Clock size={16} color="#000"/>
        <p className="ml-[4px] font-[500] text-[14px] leading-[16px] text-[#2E3032]">Tue, 02/02/2025  |   14:00 - 14:30</p>
      </div>
      <div className="flex items-center mt-[16px]">
        <User size={16} color="#000"/>
        <p className="ml-[8px] font-[500] text-[14px] leading-[16px] text-[#171819]">2 Attendees</p>
      </div>
      <div className="flex flex-col mt-[16px]">
        <div className="flex items-center">
          <Image src="/assets/images/icons/avatar.svg" alt="avatar" width={32} height={32}/>
          <p className="flex items-center justify-center rounded-[100px] px-[10px] py[2px] mx-[8px] w-[63] h-[20px] bg-[#CDDDFE] text-[#0442BF] font-[500] text-[14px] leading-[16px]">Huber</p>
          <p className="text-[#EE0038] font-[500] text-[14px] leading-[16px]">[Thợ lặn]</p>
          <p className="ml-[8px] font-[500] text-[14px] leading-[16px] text-[#171819]">Đinh Tiến Đạt (You)</p>       
        </div>
        <div className="flex items-center mt-[16px]">
        <Image src="/assets/images/icons/avatar.svg" alt="avatar" width={32} height={32}/>
          <p className="flex items-center justify-center rounded-[100px] px-[10px] py[2px] mx-[8px] w-[63] h-[20px] bg-[#FFE3CC] text-[#FF7301] font-[500] text-[14px] leading-[16px]">Liber</p>
          <p className="text-[#A978D6] font-[500] text-[14px] leading-[16px]">[Thần bùm]</p>
          <p className="ml-[8px] font-[500] text-[14px] leading-[16px] text-[Hari Won] text-[#171819]">Harry won</p>       
        </div>
      </div>
      <div className="flex items-start mt-[16px]">
        <Note size={40} color="#000"/>
        <p className="ml-[8px] font-[400] text-[14px] leading-[20px] text-[#2E3032]">Embark on a journey through the vivid tapestry of my life story, where each chapter unfolds with a unique blend of triumphs</p>
      </div>
      <div className="flex items-center mt-[16px]">
        <button type="button" className="w-[141px] h-[44px] rounded-full border bg-[#fff] border-[#C2C6CF] text-[#0442BF] font-[500] text-[16px] leading-[20px]">Reject</button>
        <button type="button" className="ml-auto min-w-[205px] h-[44px] rounded-full text-[#fff] font-[500] text-[16px] leading-[20px] bg-[#0442BF]">Aprove</button>
      </div>
    </div>
  );
}

export default DetailEventHuber;
