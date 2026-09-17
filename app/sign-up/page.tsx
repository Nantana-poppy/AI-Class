"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { mockBrandLogo } from "@/lib/mock-data";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signin" ? "signin" : "signup";

  const [mode, setMode] = useState<"signup" | "signin">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === "signup") {
      if (!name.trim()) {
        setErrorMessage("กรุณากรอกชื่อ-นามสกุล");
        return;
      }
      if (!email.trim()) {
        setErrorMessage("กรุณากรอกอีเมล");
        return;
      }
      if (password.length < 8) {
        setErrorMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
        return;
      }

      setIsLoading(true);
      try {
        const { error } = await authClient.signUp.email({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim(),
          callbackURL: "/dashboard",
        });

        if (error) {
          setErrorMessage(error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง");
          setIsLoading(false);
          return;
        }

        setSuccessMessage("สมัครสมาชิกสำเร็จ! กำลังนำคุณไปยังแดชบอร์ด...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 800);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
        setErrorMessage(message);
        setIsLoading(false);
      }
    } else {
      // Sign In mode
      if (!email.trim()) {
        setErrorMessage("กรุณากรอกอีเมล");
        return;
      }
      if (!password) {
        setErrorMessage("กรุณากรอกรหัสผ่าน");
        return;
      }

      setIsLoading(true);
      try {
        const { error } = await authClient.signIn.email({
          email: email.trim().toLowerCase(),
          password,
          rememberMe,
          callbackURL: "/dashboard",
        });

        if (error) {
          setErrorMessage(
            error.message?.includes("Invalid") || error.message?.includes("credentials")
              ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง"
              : error.message || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"
          );
          setIsLoading(false);
          return;
        }

        setSuccessMessage("เข้าสู่ระบบสำเร็จ! กำลังนำคุณไปยังแดชบอร์ด...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 800);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
        setErrorMessage(message);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 dark:bg-slate-950">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 dark:bg-slate-900 dark:border-slate-800">
        {/* Left Side: Brand Feature Showcase (Hidden on small screens) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-gradient-to-br from-[#131b2e] via-[#1a233d] to-[#251f5c] text-white relative overflow-hidden">
          {/* Decorative Background Circles */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#4b41e1]/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#009668]/15 blur-3xl pointer-events-none" />

          {/* Top Logo & App Title */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md p-1.5 border border-white/20 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mockBrandLogo.src}
                  alt={mockBrandLogo.alt}
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[17px] font-bold tracking-tight text-white leading-tight">
                  Follow-up Board
                </span>
                <span className="text-[11px] font-medium text-slate-300">
                  CRM &amp; Sales Tracker
                </span>
              </div>
            </Link>
          </div>

          {/* Middle Value Proposition */}
          <div className="relative z-10 flex flex-col gap-6 my-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#e2dfff]/20 text-indigo-200 border border-indigo-400/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ระบบติดตามลูกค้ารุ่นใหม่
              </span>
              <h2 className="font-display text-[26px] font-bold leading-snug text-white">
                จัดการทุกรายการติดตาม ปิดการขายได้รวดเร็วยิ่งขึ้น
              </h2>
              <p className="text-[14px] text-slate-300 mt-2 leading-relaxed">
                เชื่อมต่อข้อมูลลูกค้า ประวัติการติดต่อ และตารางนัดหมาย รวมไว้ในที่เดียว พร้อมแดชบอร์ดสรุปผลแบบเรียลไทม์
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-3.5 pt-2">
              <div className="flex items-center gap-3 text-[13px] text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-emerald-400">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <span>แจ้งเตือนลูกค้าที่ต้องติดต่อประจำวัน ไม่ตกหล่น</span>
              </div>

              <div className="flex items-center gap-3 text-[13px] text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-indigo-300">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </div>
                <span>คลิกเดียวโทรออก ทัก LINE หรือส่งอีเมลได้ทันที</span>
              </div>

              <div className="flex items-center gap-3 text-[13px] text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-amber-300">
                  <span className="material-symbols-outlined text-[18px]">monitoring</span>
                </div>
                <span>แดชบอร์ดวิเคราะห์อัตราความสำเร็จและเป้าหมายรายสัปดาห์</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[12px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">
                lock
              </span>
              ปลอดภัยด้วยมาตรฐาน Better Auth
            </span>
            <span>v0.1.0</span>
          </div>
        </div>

        {/* Right Side: Authentication Form (Sign Up / Sign In) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Mobile Top Brand Header */}
          <div className="lg:hidden flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#131b2e] p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mockBrandLogo.src}
                alt={mockBrandLogo.alt}
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[16px] font-bold text-slate-900 dark:text-white">
                Follow-up Board
              </span>
              <span className="text-[11px] text-slate-500">ระบบติดตามลูกค้าและงานขาย</span>
            </div>
          </div>

          {/* Segmented Mode Toggle Tabs */}
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 ${
                mode === "signup"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>สมัครสมาชิก (Sign Up)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 ${
                mode === "signin"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>เข้าสู่ระบบ (Sign In)</span>
            </button>
          </div>

          {/* Title & Description */}
          <div className="mb-6">
            <h1 className="font-display text-[24px] font-bold text-slate-900 dark:text-white">
              {mode === "signup" ? "สร้างบัญชีผู้ใช้งานใหม่" : "ยินดีต้อนรับกลับมา"}
            </h1>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1">
              {mode === "signup"
                ? "กรอกข้อมูลด้านล่างเพื่อเริ่มใช้งาน Follow-up Board สำหรับทีมของคุณ"
                : "กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบและจัดการงานติดตาม"}
            </p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-[13px] flex items-start gap-2.5 animate-fadeIn dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300">
              <span className="material-symbols-outlined text-[18px] text-rose-600 flex-shrink-0 mt-0.5">
                error
              </span>
              <span className="flex-1 font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[13px] flex items-start gap-2.5 animate-fadeIn dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-300">
              <span className="material-symbols-outlined text-[18px] text-emerald-600 flex-shrink-0 mt-0.5">
                check_circle
              </span>
              <span className="flex-1 font-medium">{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name Field (Sign Up only) */}
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
                >
                  ชื่อ - นามสกุล <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[18px] text-slate-400 pointer-events-none">
                    person
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น วีรภัทร ยอดขวัญ"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:border-[#4b41e1] transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
              >
                อีเมล (Email) <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[18px] text-slate-400 pointer-events-none">
                  mail
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:border-[#4b41e1] transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
                >
                  รหัสผ่าน (Password) <span className="text-rose-500">*</span>
                </label>
                {mode === "signup" && (
                  <span className="text-[11px] text-slate-400">อย่างน้อย 8 ตัวอักษร</span>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[18px] text-slate-400 pointer-events-none">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:border-[#4b41e1] transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Sign Up only) */}
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
                >
                  ยืนยันรหัสผ่าน (Confirm Password) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[18px] text-slate-400 pointer-events-none">
                    lock_reset
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4b41e1]/20 focus:border-[#4b41e1] transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Sign In Options: Remember Me & Forgot Password */}
            {mode === "signin" && (
              <div className="flex items-center justify-between text-[13px] pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4b41e1] border-slate-300 focus:ring-[#4b41e1]"
                  />
                  <span>จดจำการเข้าสู่ระบบ</span>
                </label>
                <span className="text-slate-400 hover:text-slate-600 cursor-pointer dark:hover:text-slate-300">
                  ลืมรหัสผ่าน?
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#4b41e1] text-white font-semibold text-[14px] hover:bg-[#3f36c5] active:bg-[#3730a3] transition-all shadow-md shadow-[#4b41e1]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{mode === "signup" ? "กำลังสร้างบัญชี..." : "กำลังเข้าสู่ระบบ..."}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    {mode === "signup" ? "how_to_reg" : "arrow_forward"}
                  </span>
                  <span>{mode === "signup" ? "สมัครสมาชิกและเริ่มต้นใช้งาน" : "เข้าสู่ระบบ"}</span>
                </>
              )}
            </button>
          </form>

          {/* Switch Mode Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-[13px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            {mode === "signup" ? (
              <p>
                มีบัญชีผู้ใช้งานอยู่แล้วใช่ไหม?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-[#4b41e1] font-semibold hover:underline dark:text-indigo-400"
                >
                  เข้าสู่ระบบที่นี่
                </button>
              </p>
            ) : (
              <p>
                ยังไม่มีบัญชีใช่ไหม?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-[#4b41e1] font-semibold hover:underline dark:text-indigo-400"
                >
                  สมัครสมาชิกใหม่ที่นี่
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#4b41e1]/20 border-t-[#4b41e1] rounded-full animate-spin" />
            <span className="text-[13px] text-slate-500">กำลังโหลด...</span>
          </div>
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}

