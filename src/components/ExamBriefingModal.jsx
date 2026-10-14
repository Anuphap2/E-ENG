import React from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Send, 
  X, 
  Award, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function ExamBriefingModal({ isOpen, onClose, onConfirmStart }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>CBT Simulation Mode</span>
              </span>
              <span className="text-xs text-slate-300 font-mono">10700320 Final Exam</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white mt-2">
            คำแนะนำก่อนเริ่มการสอบเสมือนจริง (Exam Simulation)
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            ระบบจำลองบรรยากาศและกติกาเหมือนห้องสอบจริงเพื่อฝึกฝนการบริหารเวลาและความแม่นยำ
          </p>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5">
          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <span className="text-[11px] text-slate-500 font-medium block">จำนวนข้อสอบ</span>
              <span className="text-xl font-black text-slate-900 block mt-0.5">80 ข้อ</span>
              <span className="text-[10px] text-slate-400">4 Units ละ 20 ข้อ</span>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-2xl">
              <span className="text-[11px] text-indigo-700 font-medium block">เวลาทำข้อสอบ</span>
              <span className="text-xl font-black text-indigo-950 block mt-0.5">90 นาที</span>
              <span className="text-[10px] text-indigo-600">นับถอยหลัง Real-Time</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
              <span className="text-[11px] text-amber-800 font-medium block">คะแนนเก็บจริง</span>
              <span className="text-xl font-black text-amber-950 block mt-0.5">25.00 คะแนน</span>
              <span className="text-[10px] text-amber-700">25% ของเกรดปลายภาค</span>
            </div>
          </div>

          {/* Rules and Regulations */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>กติกาและฟีเจอร์ในโหมดสอบจริง:</span>
            </h4>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                <span><strong>ไม่แสดงเฉลยทันที:</strong> คำตอบจะถูกบันทึกไว้ในระบบ จะเฉลยและสรุปผลคะแนนอย่างละเอียดหลังกดส่งข้อสอบเท่านั้น</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                <span><strong>เครื่องมือตัดช้อยส์ (✂️):</strong> คลิกรูปกรรไกรข้างตัวเลือกเพื่อขีดฆ่าช้อยส์ที่ไม่มั่นใจ ช่วยตัดตัวเลือกลวง</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                <span><strong>ปักหมุดข้อสอบ (🔖):</strong> สามารถกดปักหมุดข้อที่ยังไม่แน่ใจเพื่อย้อนกลับมาทบทวนก่อนกดส่งข้อสอบ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                <span><strong>ส่งข้อสอบอัตโนมัติ:</strong> เมื่อเวลา 90 นาทีหมดลง ระบบจะส่งข้อสอบและแสดงใบรายงานผลคะแนนให้ทันที</span>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              ยกเลิก / กลับไปโหมดฝึกฝน
            </button>
            <button
              onClick={() => {
                onClose();
                onConfirmStart();
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>เริ่มสอบเสมือนจริงทันที (Start Exam)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
