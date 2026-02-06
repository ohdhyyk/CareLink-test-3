import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { ViewState, Profile, Connection, Wish } from './types';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { BrandLogo } from './components/BrandLogo';
import * as api from './services/api';
import { Check, LogOut, Loader2, Sparkles, Link as LinkIcon, Lock, Activity, Shield, ArrowRight, Trash2, HeartCrack, BarChart3, MoreVertical, X, Edit2, Zap, Moon, Send, Globe, Heart, Users, UserPlus, AlertCircle, User, Flame, ChevronDown, Mail, HeartHandshake, Leaf, Sprout, Palette, Menu, Phone, MapPin, Quote, Sun, Copy } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, Variants } from 'framer-motion';

// --- TRANSLATIONS ---

const translations = {
  en: {
    admin: "Admin",
    signIn: "Sign In",
    getStarted: "Get Started",
    tagline: "Daily Shared Care",
    
    // Nav
    navHome: "Home",
    navAbout: "About",
    navFeatures: "Features",
    navContact: "Contact",

    // Landing - Hero
    heroTitle: "Care, broken down into",
    heroTitleHighlight: "everyday moments.",
    heroDesc: "We all wish the people we care about to be healthier. Carelink turns that big wish into small, shared actions you can actually do.",
    heroCTA: "Start with someone you care about",
    heroSecondary: "See how it works",

    // Landing - Problem
    problemTitle: "Good intentions are everywhere.",
    problemSubtitle: "Lasting change is not.",
    problemDesc: "Wanting someone to be healthier is natural. But the wish is often too big, too vague, and too hard to act on alone. Carelink helps break it into small, human moments of care.",

    // Landing - Philosophy
    philosophyTitle: "Health doesn’t start with discipline.",
    philosophyHighlight: "It starts with care.",
    philosophyDesc: "Carelink is built around real relationships — not pressure, streaks, or self-control. It's about being there for each other, one small wish at a time.",

    // Landing - Mechanism
    mechanismTitle: "Small wishes, shared between people who care.",
    mechanismDesc: "Simple, everyday wishes. Supported by someone you trust. Easy to do, easier to keep.",

    // Landing - Impact
    impactTitle: "Small actions, over time, make a real difference.",
    impactDesc: "Carelink quietly helps those moments add up — into healthier habits and meaningful change.",

    // Landing - Contact
    contactTitle: "Get in Touch",
    contactDesc: "Have questions or want to partner with us? We'd love to hear from you.",
    contactBtn: "Copy Email",
    emailCopied: "Copied!",

    footer: "Built for better connections.",
    
    // Auth & App (Existing)
    createAccount: "Create Free Account",
    private: "Private & Encrypted",
    realtime: "Real-time Sync",
    partnerCard: "My Person",
    online: "Online",
    exampleWish1: "Don't forget to take your meds!",
    exampleWish2: "Go for a walk outside.",
    completed: "Completed",
    welcomeBack: "Welcome Back",
    createAccTitle: "Create Account",
    beginJourney: "Begin your journey of shared care.",
    emailLabel: "Email",
    passLabel: "Password",
    haveAcc: "Already have an account?",
    noAcc: "Don't have an account?",
    backHome: "Back to Home",
    authError: "Authentication Error",
    loginError: "Invalid login credentials",
    step1: "Sign Up",
    setUsername: "Set your Username",
    setUsernameDesc: "This is how your family or friend will find you.",
    continue: "Continue",
    connectTitle: "Connect with Someone",
    connectDesc: "Enter their username to start sharing wishes.",
    partnerUsername: "Their username",
    connectError: "Connection failed",
    step2: "Connect",
    logout: "Logout",
    yourProfile: "Profile & Settings",
    connectedTo: "Connected to",
    notConnected: "Not connected",
    connectNow: "Connect Now",
    connectPromptTitle: "Welcome to Carelink!",
    connectPromptDesc: "To start sharing wishes and tracking habits, connect with a partner, family member, or friend.",
    connectButton: "Find Connection",
    editProfile: "Edit Profile",
    totalWishes: "Total Wishes",
    completionRate: "Completion Rate",
    quote: "Small acts, when multiplied by millions of people, can transform the world.",
    sendWishTitle: "Send a Wish",
    sendWishDesc: "Send a healthy thought to",
    placeholder: "Eat some fruit, do 10 minutes exercise...",
    dailyLimit: "daily",
    send: "Send",
    forYou: "For You",
    noWishesReceived: "No wishes received today yet.",
    sentByYou: "Sent by You",
    sent: "sent",
    noWishesSent: "You haven't sent any wishes today.",
    activity: "Activity (7 Days)",
    streak: "Care Streak",
    streakDesc: "Days you both completed wishes",
    unlink: "Unlink Account",
    unlinkConfirm: "Are you sure you want to disconnect? This cannot be undone.",
    unlinkError: "Failed to disconnect",
    deleteError: "Failed to delete wish",
    updateUserTitle: "Update Username",
    updateUserDesc: "Change your public username. Your connection will see this update immediately.",
    saveChanges: "Save Changes",
    statsTitle: "Statistics",
    statsDesc: "Your shared journey at a glance.",
    chartExpl: "Wishes sent per day over the last week.",
    compExpl: "Percentage of wishes marked as completed.",
    profileInfo: "Personal Information"
  },
  zh: {
    admin: "管理员",
    signIn: "登录",
    getStarted: "开始使用",
    tagline: "每日分享关爱",

    navHome: "首页",
    navAbout: "关于我们",
    navFeatures: "功能",
    navContact: "联系我们",

    heroTitle: "关爱，拆解成",
    heroTitleHighlight: "每一个日常瞬间。",
    heroDesc: "我们都希望自己在乎的人更健康。Carelink 将这份宏大的愿望转化为你们可以共同完成的微小行动。",
    heroCTA: "和你在乎的人开始",
    heroSecondary: "了解工作原理",

    problemTitle: "善意常有。",
    problemSubtitle: "改变难以此维持。",
    problemDesc: "希望某人更健康是人之常情。但这个愿望往往太大、太模糊，独自一人难以坚持。Carelink 帮你将其拆解为充满人情味的关怀瞬间。",

    philosophyTitle: "健康不始于自律。",
    philosophyHighlight: "而始于关爱。",
    philosophyDesc: "Carelink 建立在真实的关系之上——没有压力，没有打卡，不需要苦行般的自控。它是关于彼此陪伴，一次一个小小的愿望。",

    mechanismTitle: "微小的愿望，在在乎的人之间传递。",
    mechanismDesc: "简单、日常的愿望。有你信任的人支持。易于开始，更易于坚持。",

    impactTitle: "积少成多，微小的行动也能带来真正的改变。",
    impactDesc: "Carelink 静静地帮助这些瞬间累积——汇聚成更健康的习惯和有意义的改变。",

    contactTitle: "联系我们",
    contactDesc: "有任何问题或合作意向？我们期待听到您的声音。",
    contactBtn: "复制邮箱",
    emailCopied: "已复制！",

    footer: "为更好的连接而构建。",

    // Auth & App
    createAccount: "创建免费账户",
    private: "私密且加密",
    realtime: "实时同步",
    partnerCard: "关心的人",
    online: "在线",
    exampleWish1: "记得按时吃药哦！",
    exampleWish2: "出去散散步吧。",
    completed: "已完成",
    welcomeBack: "欢迎回来",
    createAccTitle: "创建账户",
    beginJourney: "开启你们的共同关怀之旅。",
    emailLabel: "邮箱",
    passLabel: "密码",
    haveAcc: "已有账户？",
    noAcc: "还没有账户？",
    backHome: "返回首页",
    authError: "认证错误",
    loginError: "登录凭证无效",
    step1: "注册",
    setUsername: "设置用户名",
    setUsernameDesc: "你的亲友将通过此名称找到你。",
    continue: "继续",
    connectTitle: "建立连接",
    connectDesc: "输入对方的用户名开始分享愿望。",
    partnerUsername: "对方的用户名",
    connectError: "连接失败",
    step2: "连接",
    logout: "退出登录",
    yourProfile: "个人资料与设置",
    connectedTo: "已连接到",
    notConnected: "未连接",
    connectNow: "立即连接",
    connectPromptTitle: "欢迎来到 Carelink！",
    connectPromptDesc: "要开始分享愿望和追踪习惯，请连接一位伴侣、家人或朋友。",
    connectButton: "寻找连接",
    editProfile: "编辑资料",
    totalWishes: "愿望总数",
    completionRate: "完成率",
    quote: "微小的行动，乘以数百万人，可以改变世界。",
    sendWishTitle: "发送愿望",
    sendWishDesc: "发送一个健康的提醒给",
    placeholder: "吃点水果，做10分钟运动...",
    dailyLimit: "每日",
    send: "发送",
    forYou: "收到的",
    noWishesReceived: "今天还没有收到愿望。",
    sentByYou: "发出的",
    sent: "条",
    noWishesSent: "你今天还没有发送愿望。",
    activity: "活跃度 (7天)",
    streak: "关爱打卡",
    streakDesc: "双方共同完成愿望的天数",
    unlink: "断开连接",
    unlinkConfirm: "你确定要断开连接吗？此操作无法撤销。",
    unlinkError: "断开连接失败",
    deleteError: "删除愿望失败",
    updateUserTitle: "更新用户名",
    updateUserDesc: "更改你的公开用户名。对方将立即看到此更新。",
    saveChanges: "保存更改",
    statsTitle: "统计数据",
    statsDesc: "你们的共同旅程概览。",
    chartExpl: "过去一周每天发送的愿望。",
    compExpl: "愿望完成的百分比。",
    profileInfo: "个人信息"
  },
  tw: {
    admin: "管理員",
    signIn: "登入",
    getStarted: "開始使用",
    tagline: "每日分享關愛",

    navHome: "首頁",
    navAbout: "關於我們",
    navFeatures: "功能",
    navContact: "聯繫我們",

    heroTitle: "關愛，拆解成",
    heroTitleHighlight: "每一個日常瞬間。",
    heroDesc: "我們都希望自己在乎的人更健康。Carelink 將這份宏大的願望轉化為你們可以共同完成的微小行動。",
    heroCTA: "和你在乎的人開始",
    heroSecondary: "了解工作原理",

    problemTitle: "善意常有。",
    problemSubtitle: "改變難以此維持。",
    problemDesc: "希望某人更健康是人之常情。但這個願望往往太大、太模糊，獨自一人難以堅持。Carelink 幫你將其拆解為充滿人情味的關懷瞬間。",

    philosophyTitle: "健康不始於自律。",
    philosophyHighlight: "而始於關愛。",
    philosophyDesc: "Carelink 建立在真實的關係之上——沒有壓力，沒有打卡，不需要苦行般的自控。它是關於彼此陪伴，一次一個小小的願望。",

    mechanismTitle: "微小的願望，在在乎的人之間傳遞。",
    mechanismDesc: "簡單、日常的願望。有你信任的人支持。易於開始，更易於堅持。",

    impactTitle: "積少成多，微小的行動也能帶來真正的改變。",
    impactDesc: "Carelink 靜靜地幫助這些瞬間累積——匯聚成更健康的習慣和有意義的改變。",

    contactTitle: "聯繫我們",
    contactDesc: "有任何問題或合作意向？我們期待聽到您的聲音。",
    contactBtn: "複製郵箱",
    emailCopied: "已複製！",

    footer: "為更好的連結而構建。",
    
    // Auth & App
    createAccount: "創建免費賬戶",
    private: "私密且加密",
    realtime: "即時同步",
    partnerCard: "關心的人",
    online: "在線",
    exampleWish1: "記得按時吃藥哦！",
    exampleWish2: "出去散散步吧。",
    completed: "已完成",
    welcomeBack: "歡迎回來",
    createAccTitle: "創建賬戶",
    beginJourney: "開啟你們的共同關懷之旅。",
    emailLabel: "信箱",
    passLabel: "密碼",
    haveAcc: "已有賬戶？",
    noAcc: "還沒有賬戶？",
    backHome: "返回首頁",
    authError: "認證錯誤",
    loginError: "登入憑證無效",
    step1: "註冊",
    setUsername: "設置用戶名",
    setUsernameDesc: "你的親友將通過此名稱找到你。",
    continue: "繼續",
    connectTitle: "建立連結",
    connectDesc: "輸入對方的用戶名開始分享願望。",
    partnerUsername: "對方的用戶名",
    connectError: "連接失敗",
    step2: "連接",
    logout: "登出",
    yourProfile: "個人資料與設置",
    connectedTo: "已連接到",
    notConnected: "未連接",
    connectNow: "立即連接",
    connectPromptTitle: "歡迎來到 Carelink！",
    connectPromptDesc: "要開始分享願望和追蹤習慣，請連接一位伴侶、家人或朋友。",
    connectButton: "尋找連接",
    editProfile: "編輯資料",
    totalWishes: "願望總數",
    completionRate: "完成率",
    quote: "微小的行動，乘以數百萬人，可以改變世界。",
    sendWishTitle: "發送願望",
    sendWishDesc: "發送一個健康的提醒給",
    placeholder: "吃點水果，做10分鐘運動...",
    dailyLimit: "每日",
    send: "發送",
    forYou: "收到的",
    noWishesReceived: "今天還沒有收到願望。",
    sentByYou: "發出的",
    sent: "條",
    noWishesSent: "你今天還沒有發送願望。",
    activity: "活躍度 (7天)",
    streak: "Care Streak",
    streakDesc: "雙方共同完成願望的天數",
    unlink: "斷開連接",
    unlinkConfirm: "你確定要斷開連接嗎？此操作無法撤銷。",
    unlinkError: "斷開連接失敗",
    deleteError: "刪除願望失敗",
    updateUserTitle: "更新用戶名",
    updateUserDesc: "更改你的公開用戶名。對方將立即看到此更新。",
    saveChanges: "保存更改",
    statsTitle: "統計數據",
    statsDesc: "你們的共同旅程概覽。",
    chartExpl: "過去一週每天發送的願望。",
    compExpl: "願望完成的百分比。",
    profileInfo: "個人信息"
  },
  no: {
    admin: "Admin",
    signIn: "Logg inn",
    getStarted: "Kom i gang",
    tagline: "Daglig delt omsorg",

    navHome: "Hjem",
    navAbout: "Om oss",
    navFeatures: "Funksjoner",
    navContact: "Kontakt",

    heroTitle: "Omsorg, delt opp i",
    heroTitleHighlight: "hverdagsøyeblikk.",
    heroDesc: "Vi ønsker alle at de vi er glad i skal være sunnere. Carelink gjør det store ønsket om til små, delte handlinger dere faktisk kan gjøre.",
    heroCTA: "Start med noen du er glad i",
    heroSecondary: "Se hvordan det fungerer",

    problemTitle: "Gode intensjoner er overalt.",
    problemSubtitle: "Varig endring er det ikke.",
    problemDesc: "Å ønske at noen skal være sunnere er naturlig. Men ønsket er ofte for stort, for vagt og for vanskelig å handle på alene. Carelink hjelper med å bryte det ned til små, menneskelige øyeblikk av omsorg.",

    philosophyTitle: "Helse starter ikke med disiplin.",
    philosophyHighlight: "Det starter med omsorg.",
    philosophyDesc: "Carelink er bygget rundt ekte relasjoner - ikke press, rekker eller selvkontroll. Det handler om å være der for hverandre, ett lite ønske av gangen.",

    mechanismTitle: "Små ønsker, delt mellom mennesker som bryr seg.",
    mechanismDesc: "Enkle hverdagsønsker. Støttet av noen du stoler på. Lett å gjøre, lettere å holde.",

    impactTitle: "Små handlinger, over tid, utgjør en virkelig forskjell.",
    impactDesc: "Carelink hjelper stille disse øyeblikkene å legge seg sammen - til sunnere vaner og meningsfull endring.",

    contactTitle: "Ta kontakt",
    contactDesc: "Har du spørsmål eller ønsker å samarbeide med oss? Vi vil gjerne høre fra deg.",
    contactBtn: "Kopier e-post",
    emailCopied: "Kopiert!",

    footer: "Bygget for bedre forbindelser.",
    
    // Auth & App
    createAccount: "Lag gratis konto",
    private: "Privat og kryptert",
    realtime: "Sanntidssynkronisering",
    partnerCard: "Min person",
    online: "Pålogget",
    exampleWish1: "Ikke glem å ta medisinen din!",
    exampleWish2: "Gå en tur ut.",
    completed: "Fullført",
    welcomeBack: "Velkommen tilbake",
    createAccTitle: "Opprett konto",
    beginJourney: "Start reisen med delt omsorg.",
    emailLabel: "E-post",
    passLabel: "Passord",
    haveAcc: "Har du allerede en konto?",
    noAcc: "Har du ikke en konto?",
    backHome: "Tilbake til hjem",
    authError: "Autentiseringsfeil",
    loginError: "Ugyldig brukernavn eller passord",
    step1: "Registrer deg",
    setUsername: "Velg brukernavn",
    setUsernameDesc: "Slik vil familien eller vennen din finne deg.",
    continue: "Fortsett",
    connectTitle: "Koble til noen",
    connectDesc: "Skriv inn brukernavnet deres for å dele ønsker.",
    partnerUsername: "Deres brukernavn",
    connectError: "Tilkobling mislyktes",
    step2: "Koble til",
    logout: "Logg ut",
    yourProfile: "Profil og Innstillinger",
    connectedTo: "Koblet til",
    notConnected: "Ikke tilkoblet",
    connectNow: "Koble til nå",
    connectPromptTitle: "Velkommen til Carelink!",
    connectPromptDesc: "Koble deg til en partner, et familiemedlem eller en venn for å dele ønsker.",
    connectButton: "Finn tilkobling",
    editProfile: "Rediger profil",
    totalWishes: "Totale ønsker",
    completionRate: "Fullføringsgrad",
    quote: "Små handlinger, multiplisert med millioner av mennesker, kan forandre verden.",
    sendWishTitle: "Send et ønske",
    sendWishDesc: "Send en sunn tanke til",
    placeholder: "Spis litt frukt, gjør 10 minutter trening...",
    dailyLimit: "daglig",
    send: "Send",
    forYou: "Til deg",
    noWishesReceived: "Ingen ønsker mottatt i dag ennå.",
    sentByYou: "Sendt av deg",
    sent: "sendt",
    noWishesSent: "Du har ikke sendt noen ønsker i dag.",
    activity: "Aktivitet (7 dager)",
    streak: "Care Streak",
    streakDesc: "Dager dere begge fullførte ønsker",
    unlink: "Koble fra konto",
    unlinkConfirm: "Er du sikker på at du vil koble fra? Dette kan ikke angres.",
    unlinkError: "Kunne ikke koble fra",
    deleteError: "Kunne ikke slette ønske",
    updateUserTitle: "Oppdater brukernavn",
    updateUserDesc: "Endre ditt offentlige brukernavn. Forbindelsen din vil se dette umiddelbart.",
    saveChanges: "Lagre endringer",
    statsTitle: "Statistikk",
    statsDesc: "Deres felles reise i et øyeblikk.",
    chartExpl: "Ønsker sendt per day den siste uken.",
    compExpl: "Prosentandel av ønsker markert som fullført.",
    profileInfo: "Personlig informasjon"
  }
};

type Language = 'en' | 'zh' | 'tw' | 'no';
type Theme = 'green' | 'pink';

// --- SHARED UI COMPONENTS ---

const TechGrid = ({ theme, darkMode }: { theme: Theme, darkMode: boolean }) => (
  <div className="fixed inset-0 z-[-1] pointer-events-none" style={{ perspective: '1000px' }}>
    <div 
      className={`absolute inset-0 ${darkMode ? 'opacity-[0.05]' : 'opacity-[0.03]'}`}
      style={{
        backgroundImage: `linear-gradient(${theme === 'green' ? '#0d9488' : '#e11d48'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'green' ? '#0d9488' : '#e11d48'} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        transform: 'rotateX(20deg) translateY(-10%) scale(1.5)',
      }}
    />
    <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-slate-950 via-transparent to-slate-950/80' : 'from-white via-transparent to-white/80'}`} />
  </div>
);

const AnimatedBackground = ({ theme, darkMode }: { theme: Theme, darkMode: boolean }) => (
  <div className={`fixed inset-0 z-[-2] overflow-hidden pointer-events-none transition-colors duration-1000 ${darkMode ? 'bg-slate-950' : (theme === 'green' ? 'bg-cyan-50' : 'bg-rose-50')}`}>
    <TechGrid theme={theme} darkMode={darkMode} />
    {/* Optimization: Reduced blurs on mobile and added will-change-transform for performance */}
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 45, 0],
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[80px] md:blur-[120px] will-change-transform ${theme === 'green' ? 'bg-teal-300/40' : 'bg-rose-300/40'}`} 
      style={{ transform: 'translate3d(0,0,0)' }}
    />
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1],
        x: [0, -50, 0],
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[80px] md:blur-[120px] will-change-transform ${theme === 'green' ? 'bg-blue-300/40' : 'bg-sky-300/40'}`} 
      style={{ transform: 'translate3d(0,0,0)' }}
    />
    <motion.div 
      animate={{ 
        scale: [1, 1.3, 1],
        y: [0, 50, 0],
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      className={`absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full blur-[60px] md:blur-[100px] will-change-transform ${theme === 'green' ? 'bg-cyan-200/30' : 'bg-pink-200/30'}`} 
      style={{ transform: 'translate3d(0,0,0)' }}
    />
  </div>
);

const GlassCard = ({ children, className = "", darkMode }: { children?: React.ReactNode, className?: string, darkMode?: boolean }) => (
  <div className={`${darkMode ? 'bg-slate-900/60 border-slate-800 shadow-black/20' : 'bg-white/70 border-white/60 shadow-slate-200/50'} backdrop-blur-xl border shadow-xl rounded-3xl ${className}`}>
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md", darkMode }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode; maxWidth?: string; darkMode: boolean }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className={`absolute inset-0 ${darkMode ? 'bg-black/60' : 'bg-slate-900/20'} backdrop-blur-sm transition-opacity`} onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className={`relative ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'} rounded-3xl shadow-2xl w-full ${maxWidth} overflow-hidden max-h-[90vh] flex flex-col`}
      >
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'} flex justify-between items-center sticky top-0 z-10`}>
           <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'} text-lg`}>{title}</h3>
           <button onClick={onClose} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}><X className="h-5 w-5"/></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
           {children}
        </div>
      </motion.div>
    </div>
  );
};

const CompactLanguageSwitcher = ({ current, setLang, theme, darkMode }: { current: Language, setLang: (l: Language) => void, theme: Theme, darkMode: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const textColor = darkMode ? (theme === 'green' ? 'text-teal-400' : 'text-rose-400') : (theme === 'green' ? 'text-teal-700' : 'text-rose-700');
  const hoverBg = darkMode ? (theme === 'green' ? 'hover:bg-teal-900/30' : 'hover:bg-rose-900/30') : (theme === 'green' ? 'hover:bg-teal-50' : 'hover:bg-rose-50');
  const activeBg = darkMode ? (theme === 'green' ? 'bg-teal-900/30 text-teal-400' : 'bg-rose-900/30 text-rose-400') : (theme === 'green' ? 'bg-teal-50/50 text-teal-600' : 'bg-rose-50/50 text-rose-600');
  const btnBg = darkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-white/50 hover:bg-white';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-3 py-2 rounded-full ${btnBg} border border-transparent transition-all font-bold ${textColor} text-sm shadow-sm`}
      >
        <Globe className="h-4 w-4" />
        {current.toUpperCase()}
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={`absolute right-0 top-full mt-1 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} rounded-xl shadow-lg border py-1 min-w-[120px] overflow-hidden z-50`}
          >
            {(['en', 'zh', 'tw', 'no'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => { setLang(lang); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm ${hoverBg} transition-colors ${current === lang ? `font-bold ${activeBg}` : (darkMode ? 'text-slate-400' : 'text-slate-600')}`}
              >
                {lang === 'en' ? 'English' : lang === 'zh' ? '简体中文' : lang === 'tw' ? '繁體中文' : 'Norsk'}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- VIEW COMPONENTS ---

const LandingView = ({ setView, lang, setLang, theme, setTheme, darkMode, setDarkMode }: { setView: (v: ViewState) => void, lang: Language, setLang: (l: Language) => void, theme: Theme, setTheme: (t: Theme) => void, darkMode: boolean, setDarkMode: (d: boolean) => void }) => {
  const txt = translations[lang];
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Theme-aware styles
  const t = {
    text: darkMode ? 'text-slate-100' : 'text-slate-900',
    textMuted: darkMode ? 'text-slate-400' : 'text-slate-600',
    bg: darkMode ? 'bg-slate-950' : 'bg-slate-50/50',
    card: darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/70 border-white/60',
    nav: darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/60 border-white/20',
    navText: darkMode ? 'text-slate-300' : 'text-slate-600',
    navHover: theme === 'green' ? (darkMode ? 'hover:text-teal-400' : 'hover:text-teal-600') : (darkMode ? 'hover:text-rose-400' : 'hover:text-rose-600'),
  };

  const colors = {
    primary: theme === 'green' ? 'text-teal-600' : 'text-rose-600',
    bgBadge: darkMode ? (theme === 'green' ? 'bg-teal-900/30' : 'bg-rose-900/30') : (theme === 'green' ? 'bg-teal-50' : 'bg-rose-50'),
    borderBadge: darkMode ? (theme === 'green' ? 'border-teal-800' : 'border-rose-800') : (theme === 'green' ? 'border-teal-100' : 'border-rose-100'),
    textBadge: darkMode ? (theme === 'green' ? 'text-teal-400' : 'text-rose-400') : (theme === 'green' ? 'text-teal-700' : 'text-rose-700'),
    gradientText: theme === 'green' ? 'from-teal-500 via-cyan-500 to-blue-500' : 'from-rose-500 via-pink-500 to-sky-500',
    btnGradient: theme === 'green' ? 'from-teal-500 to-cyan-500' : 'from-rose-500 to-pink-500',
    btnShadow: theme === 'green' ? 'shadow-teal-500/30' : 'shadow-rose-500/30',
    iconColor: theme === 'green' ? 'text-teal-400' : 'text-rose-400',
    iconColor2: theme === 'green' ? 'text-cyan-400' : 'text-sky-400',
    cardGradient: theme === 'green' ? 'from-cyan-200/50 via-teal-200/50 to-blue-200/50' : 'from-pink-200/50 via-rose-200/50 to-sky-200/50',
    cardInnerGradient: theme === 'green' ? 'from-teal-50 to-white' : 'from-rose-50 to-white',
    cardInnerText: theme === 'green' ? 'text-teal-900' : 'text-rose-900',
    avatarBg: theme === 'green' ? 'from-cyan-100 to-teal-100' : 'from-pink-100 to-rose-100',
    avatarText: theme === 'green' ? 'text-teal-600' : 'text-rose-600',
    onlineDot: theme === 'green' ? 'bg-teal-500' : 'bg-rose-500',
    iconCircle: theme === 'green' ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-600',
    checkColor: theme === 'green' ? 'text-teal-600' : 'text-rose-600',
    checkBorder: theme === 'green' ? 'border-teal-200' : 'border-rose-200',
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("Carelink.yc@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} relative overflow-x-hidden font-sans transition-colors duration-500`}>
      <AnimatedBackground theme={theme} darkMode={darkMode} />
      
      {/* Navbar */}
      <nav className={`fixed w-full z-50 top-0 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center backdrop-blur-lg ${t.nav} border-b transition-all`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <BrandLogo className="h-16 md:h-20 w-auto" />
        </div>

        <div className="flex items-center gap-4 md:gap-6">
           {/* Desktop Links - Moved to Right */}
           <div className={`hidden md:flex items-center gap-6 text-sm font-medium ${t.navText} mr-2`}>
              <button onClick={() => scrollToSection('home')} className={`${t.navHover} transition-colors`}>{txt.navHome}</button>
              <button onClick={() => scrollToSection('about')} className={`${t.navHover} transition-colors`}>{txt.navAbout}</button>
              <button onClick={() => scrollToSection('features')} className={`${t.navHover} transition-colors`}>{txt.navFeatures}</button>
              <button onClick={() => scrollToSection('contact')} className={`${t.navHover} transition-colors`}>{txt.navContact}</button>
           </div>

           <div className="hidden md:flex items-center gap-2">
              <CompactLanguageSwitcher current={lang} setLang={setLang} theme={theme} darkMode={darkMode} />
              
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-400 hover:text-slate-600 shadow-sm'} transition-colors`}
              >
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              <button 
                onClick={() => setTheme(theme === 'green' ? 'pink' : 'green')}
                className={`p-2 rounded-full ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white shadow-sm hover:bg-slate-50'} transition-colors group`}
              >
                <Palette className={`h-4 w-4 ${theme === 'green' ? 'text-teal-500' : 'text-rose-500'}`} />
              </button>

              <Button 
                  className={`ml-2 shadow-lg ${colors.btnShadow} bg-gradient-to-r ${colors.btnGradient} border-none hover:scale-105 transition-transform rounded-full px-5 py-2 text-sm text-white`} 
                  onClick={() => setView('AUTH')}
              >
                {txt.getStarted}
              </Button>
           </div>

           {/* Mobile Menu Toggle */}
           <div className="md:hidden flex items-center gap-3">
              <CompactLanguageSwitcher current={lang} setLang={setLang} theme={theme} darkMode={darkMode} />
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 ${t.navText}`}>
                  {mobileMenuOpen ? <X /> : <Menu />}
              </button>
           </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed inset-0 z-40 ${darkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-xl pt-24 px-6 flex flex-col gap-6 md:hidden`}
          >
             <button onClick={() => scrollToSection('home')} className={`text-xl font-bold ${t.text}`}>{txt.navHome}</button>
             <button onClick={() => scrollToSection('about')} className={`text-xl font-bold ${t.text}`}>{txt.navAbout}</button>
             <button onClick={() => scrollToSection('features')} className={`text-xl font-bold ${t.text}`}>{txt.navFeatures}</button>
             <button onClick={() => scrollToSection('contact')} className={`text-xl font-bold ${t.text}`}>{txt.navContact}</button>
             
             <div className="flex items-center gap-4 py-4">
                <span className={t.textMuted}>Theme:</span>
                <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-full ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-500'}`}>
                   {darkMode ? <Moon size={20}/> : <Sun size={20}/>}
                </button>
                <button onClick={() => setTheme(theme === 'green' ? 'pink' : 'green')} className={`p-3 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                   <Palette size={20} className={theme === 'green' ? 'text-teal-500' : 'text-rose-500'}/>
                </button>
             </div>

             <div className={`h-px ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} w-full my-2`} />
             <Button onClick={() => setView('AUTH')} className="w-full justify-center py-4 text-lg bg-teal-600">{txt.getStarted}</Button>
             <button onClick={() => setView('ADMIN_LOGIN')} className="text-sm text-slate-400 mt-auto mb-8 text-center">{txt.admin}</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header id="home" className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6 md:space-y-8 text-center lg:text-left relative z-10"
          >
            <motion.div variants={itemVariants} className={`inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full ${colors.bgBadge} border ${colors.borderBadge} ${colors.textBadge} text-xs md:text-sm font-bold tracking-wide uppercase shadow-sm`}>
              <Sparkles className="h-3 w-3" /> {txt.tagline}
            </motion.div>
            
            <motion.h1 variants={itemVariants} className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight ${t.text} leading-[1.1]`}>
              {txt.heroTitle} <br/>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.gradientText} animate-pulse`}>{txt.heroTitleHighlight}</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className={`text-lg md:text-xl ${t.textMuted} leading-relaxed max-w-2xl mx-auto lg:mx-0`}>
              {txt.heroDesc}
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start pt-2">
              <Button 
                onClick={() => setView('AUTH')} 
                className={`h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-full bg-gradient-to-r ${colors.btnGradient} shadow-xl ${colors.btnShadow} hover:-translate-y-1 transition-transform text-white`}
              >
                {txt.heroCTA}
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-4 md:gap-8 pt-4 md:pt-8 text-slate-400 text-xs md:text-sm font-medium">
               <div className="flex items-center gap-2"><Shield className={`h-4 w-4 ${colors.iconColor}`}/> {txt.private}</div>
               <div className="flex items-center gap-2"><Zap className={`h-4 w-4 ${colors.iconColor2}`}/> {txt.realtime}</div>
            </motion.div>
          </motion.div>

          <motion.div 
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative mt-8 lg:mt-0 perspective-1000 hidden md:block"
          >
             <div className={`absolute inset-0 bg-gradient-to-tr ${colors.cardGradient} rounded-full blur-3xl animate-pulse opacity-60`} />
             <GlassCard darkMode={darkMode} className="relative p-6 max-w-sm mx-auto transform rotate-[-3deg] hover:rotate-0 transition-all duration-500 hover:shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${colors.avatarBg} flex items-center justify-center ${colors.avatarText} font-bold border border-white`}>
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                         <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{txt.partnerCard}</p>
                         <p className={`text-xs ${theme === 'green' ? 'text-teal-500' : 'text-rose-500'} font-medium flex items-center gap-1`}>
                           <span className={`block h-2 w-2 rounded-full ${colors.onlineDot}`}></span> {txt.online}
                         </p>
                      </div>
                   </div>
                   <BrandLogo className="h-8 w-auto" />
                </div>
                <div className="space-y-3">
                   <div className={`bg-gradient-to-r ${darkMode ? (theme === 'green' ? 'from-teal-900/50 to-slate-900' : 'from-rose-900/50 to-slate-900') : colors.cardInnerGradient} p-4 rounded-2xl border ${colors.borderBadge} shadow-sm`}>
                      <p className={`${darkMode ? 'text-slate-200' : colors.cardInnerText} font-medium text-sm`}>"{txt.exampleWish1}"</p>
                      <div className="mt-2 flex justify-end">
                         <span className={`text-[10px] ${darkMode ? 'bg-slate-800 text-white border-slate-700' : `bg-white ${colors.checkColor} border ${colors.checkBorder}`} px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1`}>
                           <Check className="h-3 w-3" /> {txt.completed}
                         </span>
                      </div>
                   </div>
                   <div className={`${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-slate-100'} p-4 rounded-2xl border`}>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} font-medium text-sm`}>"{txt.exampleWish2}"</p>
                   </div>
                </div>
             </GlassCard>
          </motion.div>
        </div>
      </header>

      {/* Problem Section */}
      <section id="about" className={`py-20 md:py-32 px-4 md:px-6 ${t.bg} relative overflow-hidden`}>
        {/* Abstract shape */}
        <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${darkMode ? 'from-slate-900 to-transparent' : 'from-white to-transparent'} pointer-events-none`} />
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
           <motion.div 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="order-2 md:order-1"
           >
              <div className="relative">
                 <div className={`absolute -inset-4 bg-gradient-to-r ${theme === 'green' ? 'from-teal-100 to-cyan-100' : 'from-rose-100 to-pink-100'} rounded-[2rem] blur-2xl opacity-60`} />
                 <GlassCard darkMode={darkMode} className="relative p-8">
                    <Heart className={`w-12 h-12 ${colors.iconColor} mb-6`} />
                    <h3 className={`text-2xl font-bold ${t.text} mb-2`}>{txt.problemTitle}</h3>
                    <p className={`${t.textMuted} leading-relaxed`}>
                       {txt.problemDesc}
                    </p>
                 </GlassCard>
              </div>
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="order-1 md:order-2 space-y-6"
           >
              <h2 className={`text-4xl md:text-5xl font-bold ${t.text} leading-tight`}>
                 {txt.problemSubtitle}
              </h2>
              <div className={`h-1.5 w-24 rounded-full bg-gradient-to-r ${colors.btnGradient}`} />
              <p className={`text-lg ${t.textMuted} font-medium`}>
                 We bridge the gap between intention and action.
              </p>
           </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-40 px-4 md:px-6 relative overflow-hidden transition-colors duration-500">
         <div className="max-w-4xl mx-auto relative z-10 text-center space-y-10">
            <motion.div 
               initial={{ scale: 0 }}
               whileInView={{ scale: 1 }}
               viewport={{ once: true }}
               className={`inline-flex items-center justify-center p-4 rounded-full ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'} border mb-4`}
            >
                <Quote className={`h-8 w-8 ${theme === 'green' ? 'text-teal-500' : 'text-rose-500'}`} />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`text-4xl md:text-6xl font-bold tracking-tight leading-tight ${t.text}`}
            >
              {txt.philosophyTitle} <br/>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.gradientText}`}>{txt.philosophyHighlight}</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`${t.textMuted} text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed`}
            >
              {txt.philosophyDesc}
            </motion.p>
         </div>
      </section>

      {/* Mechanism Section */}
      <section id="features" className={`py-20 md:py-32 px-4 md:px-6 bg-gradient-to-b ${darkMode ? 'from-slate-950 to-slate-900' : `from-white ${theme === 'green' ? 'to-teal-50/50' : 'to-rose-50/50'}`}`}>
         <div className="max-w-6xl mx-auto">
             <div className="text-center mb-20 space-y-4">
                 <h2 className={`text-3xl md:text-5xl font-bold ${t.text}`}>{txt.mechanismTitle}</h2>
                 <p className={`${t.textMuted} text-xl max-w-2xl mx-auto`}>{txt.mechanismDesc}</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8">
               {[
                  { icon: Leaf, title: "Simple", desc: "Small actions, no big gestures." },
                  { icon: Users, title: "Shared", desc: "Just you and your favorite person." },
                  { icon: Sprout, title: "Sustainable", desc: "Habits that actually stick." }
               ].map((item, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.15 }}
                     whileHover={{ y: -10 }}
                     className={`${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-white shadow-slate-200/40'} backdrop-blur-md p-10 rounded-[2rem] border shadow-xl text-center relative overflow-hidden group`}
                  >
                     <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme === 'green' ? 'from-teal-400 to-cyan-400' : 'from-rose-400 to-pink-400'} scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                     <div className={`${darkMode ? 'bg-slate-800 text-slate-300' : colors.iconCircle} w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-8 w-8" />
                     </div>
                     <h3 className={`font-bold ${t.text} text-xl mb-3`}>{item.title}</h3>
                     <p className={t.textMuted}>{item.desc}</p>
                  </motion.div>
               ))}
             </div>
         </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 md:py-40 px-4 md:px-6 text-center overflow-hidden relative">
          <div className="max-w-3xl mx-auto space-y-10 relative z-10">
              <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className={`text-4xl md:text-6xl font-bold ${t.text} leading-tight`}
              >
                {txt.impactTitle}
              </motion.h2>
              <p className={`text-xl md:text-2xl ${t.textMuted}`}>{txt.impactDesc}</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => setView('AUTH')} 
                  className={`h-16 px-12 text-xl rounded-full bg-gradient-to-r ${colors.btnGradient} shadow-xl ${colors.btnShadow} text-white hover:-translate-y-1 transition-transform mx-auto border-none`}
                >
                  {txt.heroCTA}
                </Button>
              </motion.div>
          </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 px-4 md:px-6 ${darkMode ? 'bg-slate-950 border-t border-slate-900' : 'bg-white border-t border-slate-50'}`}>
         <div className="max-w-3xl mx-auto text-center space-y-8">
            <div>
                <h2 className={`text-3xl md:text-5xl font-bold ${t.text} mb-4`}>{txt.contactTitle}</h2>
                <p className={`${t.textMuted} text-lg`}>{txt.contactDesc}</p>
            </div>
            
            <GlassCard darkMode={darkMode} className="p-10 inline-flex flex-col items-center justify-center gap-6 w-full max-w-lg mx-auto">
               <div className={`h-20 w-20 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} flex items-center justify-center mb-2`}>
                  <Mail className={`h-8 w-8 ${theme === 'green' ? 'text-teal-500' : 'text-rose-500'}`} />
               </div>
               
               <div>
                  <p className={`text-2xl md:text-3xl font-bold ${t.text} break-all`}>Carelink.yc@gmail.com</p>
               </div>

               <Button 
                  onClick={handleCopyEmail} 
                  className={`w-full max-w-xs ${darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700' : 'bg-slate-900 text-white hover:bg-slate-800'} rounded-xl py-3 flex items-center justify-center gap-2 shadow-lg`}
               >
                  {copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                  {copied ? txt.emailCopied : txt.contactBtn}
               </Button>
            </GlassCard>
         </div>
      </section>

      <footer className={`py-12 text-center text-sm ${darkMode ? 'bg-slate-950 text-slate-500 border-t border-slate-900' : 'bg-slate-50 text-slate-400 border-t border-slate-100'}`}>
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           <BrandLogo className="h-8 w-auto" />
        </div>
        <p>&copy; {new Date().getFullYear()} Carelink Inc. {txt.footer}</p>
      </footer>
    </div>
  );
};

const AuthView = ({ 
  isSignUp, 
  setIsSignUp, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  onSubmit, 
  loading, 
  error, 
  onBack,
  lang,
  theme,
  darkMode
}: any) => {
  const txt = translations[lang];
  return (
    <div className={`min-h-screen relative flex items-center justify-center p-4 font-sans ${darkMode ? 'bg-slate-950' : 'bg-[#f8fafc]'}`}>
      <div className={`${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'} rounded-[2.5rem] shadow-2xl p-8 md:p-12 w-full max-w-[440px] mx-auto transition-colors`}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
             <div className="scale-110">
               <BrandLogo className="h-24 w-auto" />
             </div>
          </div>
          <h2 className={`text-3xl font-extrabold mb-2 tracking-tight ${darkMode ? 'text-white' : 'text-[#0f172a]'}`}>{isSignUp ? txt.createAccTitle : txt.welcomeBack}</h2>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} font-medium text-sm`}>{txt.beginJourney}</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-5">
          <Input 
            type="email" 
            label={txt.emailLabel}
            placeholder="you@example.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            autoFocus
            className={`rounded-xl border-2 focus:border-[#14b8a6] focus:ring-0 font-medium h-12 ${darkMode ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500' : 'border-slate-200 text-slate-800 placeholder-slate-400'}`}
            labelClassName={`${darkMode ? 'text-slate-400' : 'text-slate-700'} font-bold text-sm mb-1.5`}
            darkMode={darkMode}
          />
          <Input 
            type="password" 
            label={txt.passLabel}
            placeholder="••••••••" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className={`rounded-xl border-2 focus:border-[#14b8a6] focus:ring-0 font-medium h-12 tracking-widest ${darkMode ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500' : 'border-slate-200 text-slate-800 placeholder-slate-400'}`}
            labelClassName={`${darkMode ? 'text-slate-400' : 'text-slate-700'} font-bold text-sm mb-1.5`}
            darkMode={darkMode}
          />
          {error && (
             <motion.div 
               initial={{ opacity: 0, y: -10 }} 
               animate={{ opacity: 1, y: 0 }} 
               className={`p-3 border text-sm rounded-xl flex items-start gap-2 ${darkMode ? 'bg-red-900/20 border-red-900 text-red-200' : 'bg-red-50 border-red-100 text-red-600'}`}
             >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                   <span className="font-bold block">{txt.authError}</span>
                   {error === "Invalid login credentials" ? txt.loginError : error}
                </div>
             </motion.div>
          )}
          <Button type="submit" className={`w-full bg-[#14b8a6] hover:bg-[#0d9488] shadow-lg shadow-teal-500/20 rounded-xl py-3.5 text-base font-bold text-white transition-all`} isLoading={loading}>
            {isSignUp ? txt.step1 : txt.signIn}
          </Button>
        </form>
        
        <div className={`text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-8 mb-6 font-medium`}>
          {isSignUp ? txt.haveAcc : "Don't have an account?"}{' '}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className={`text-[#14b8a6] font-bold hover:underline ml-1`}>
            {isSignUp ? txt.signIn : "Sign Up"}
          </button>
        </div>
        
        <div className="text-center">
           <button type="button" onClick={onBack} className={`${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'} text-sm font-medium flex items-center justify-center gap-1.5 mx-auto transition-colors`}>
             <ArrowRight className="h-3.5 w-3.5 rotate-180" /> {txt.backHome}
           </button>
        </div>
      </div>
    </div>
  );
};

const OnboardingView = ({ username, setUsername, onSubmit, loading, error, onLogout, lang, theme, darkMode }: any) => {
  const txt = translations[lang];
  return (
    <div className={`min-h-screen relative flex items-center justify-center p-4 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      <AnimatedBackground theme={theme} darkMode={darkMode} />
      <GlassCard darkMode={darkMode} className="p-8 w-full max-w-md mx-auto space-y-6">
         <h2 className={`text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-slate-800'}`}>{txt.setUsername}</h2>
         <p className={`text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{txt.setUsernameDesc}</p>
         <form onSubmit={onSubmit} className="space-y-4">
           <Input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} required darkMode={darkMode} />
           {error && <div className="text-red-500 text-sm text-center">{error}</div>}
           <Button type="submit" className={`w-full ${theme === 'green' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-rose-500 hover:bg-rose-600'} text-white border-none`} isLoading={loading}>{txt.continue}</Button>
         </form>
         <Button variant="outline" className={`w-full ${darkMode ? 'border-slate-700 text-slate-300 hover:border-slate-500' : ''}`} onClick={onLogout}>{txt.logout}</Button>
      </GlassCard>
    </div>
  );
};

const ConnectView = ({ partnerName, setPartnerName, onSubmit, loading, error, myUsername, onLogout, lang, theme, darkMode }: any) => {
  const txt = translations[lang];
  return (
    <div className={`min-h-screen relative flex items-center justify-center p-4 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      <AnimatedBackground theme={theme} darkMode={darkMode} />
      <GlassCard darkMode={darkMode} className="p-8 w-full max-w-md mx-auto space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className={`${darkMode ? 'bg-slate-800' : (theme === 'green' ? 'bg-cyan-100' : 'bg-rose-100')} p-4 rounded-full mb-4 animate-bounce`}>
            <LinkIcon className={`h-6 w-6 ${theme === 'green' ? 'text-cyan-600' : 'text-rose-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{txt.connectTitle}</h2>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm mt-1`}>Hello, <span className={`font-semibold ${theme === 'green' ? 'text-teal-500' : 'text-rose-500'}`}>{myUsername}</span>.</p>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-2`}>{txt.connectDesc}</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input placeholder={txt.partnerUsername} value={partnerName} onChange={e => setPartnerName(e.target.value)} required darkMode={darkMode} />
          {error && <div className={`p-3 ${darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-600'} text-sm rounded-lg`}>{error === "User not found" ? txt.connectError : error}</div>}
          <Button type="submit" className={`w-full ${theme === 'green' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-rose-600 hover:bg-rose-700'} text-white border-none`} isLoading={loading}>{txt.step2}</Button>
        </form>
        <Button variant="outline" className={`w-full ${darkMode ? 'border-slate-700 text-slate-300 hover:border-slate-500' : ''}`} onClick={onLogout}>{txt.logout}</Button>
      </GlassCard>
    </div>
  );
};

const DashboardView = ({ 
  profile, 
  partnerProfile, 
  wishes, 
  historyWishes,
  stats, 
  remaining, 
  wishInput, 
  setWishInput, 
  onSendWish, 
  onToggleWish, 
  onDeleteWish, 
  onLogout, 
  onDelink, 
  loading, 
  error,
  onUpdateUsername,
  onGoToConnect,
  lang,
  setLang,
  userEmail,
  theme,
  setTheme,
  darkMode,
  setDarkMode
}: any) => {
  const txt = translations[lang];
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username || '');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Colors Logic
  const c = {
    primary: theme === 'green' ? 'teal' : 'rose',
    secondary: theme === 'green' ? 'cyan' : 'pink',
    gradient: theme === 'green' ? 'from-teal-500 to-cyan-500' : 'from-rose-500 to-pink-500',
    text: darkMode ? 'text-slate-100' : 'text-slate-800',
    textMuted: darkMode ? 'text-slate-400' : 'text-slate-500',
    accentText: theme === 'green' ? (darkMode ? 'text-teal-400' : 'text-teal-600') : (darkMode ? 'text-rose-400' : 'text-rose-600'),
    bgAccent: theme === 'green' ? (darkMode ? 'bg-teal-900/30' : 'bg-teal-50') : (darkMode ? 'bg-rose-900/30' : 'bg-rose-50'),
    border: darkMode ? 'border-slate-700' : 'border-slate-200',
    card: darkMode ? 'bg-slate-900/60' : 'bg-white/80',
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      await onUpdateUsername(newUsername);
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleSendAndAnimate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSendWish(e);
    if (!error && wishInput.trim()) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }
  };

  const calculateStreak = () => {
    if (!partnerProfile || !historyWishes) return 0;
    const completionsByDate: { [key: string]: Set<string> } = {};
    historyWishes.forEach((w: Wish) => {
        if (!w.is_completed) return;
        const date = new Date(w.created_at).toDateString();
        if (!completionsByDate[date]) completionsByDate[date] = new Set();
        completionsByDate[date].add(w.sender_id);
    });
    let streak = 0;
    const checkDate = new Date();
    while (true) {
        const dateKey = checkDate.toDateString();
        const senders = completionsByDate[dateKey];
        const bothCompleted = senders && senders.has(profile.id) && senders.has(partnerProfile.id);
        if (bothCompleted) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            if (checkDate.toDateString() === new Date().toDateString()) {
                 checkDate.setDate(checkDate.getDate() - 1);
                 continue; 
            }
            break;
        }
    }
    return streak;
  };

  const streakCount = calculateStreak();
  const myWishes = wishes.filter((w: Wish) => w.sender_id === profile?.id);
  const partnerWishes = wishes.filter((w: Wish) => w.sender_id === partnerProfile?.id);

  return (
    <div className={`min-h-screen relative flex flex-col font-sans ${c.text}`}>
      <AnimatedBackground theme={theme} darkMode={darkMode} />
      
      {/* Navigation */}
      <nav className={`backdrop-blur-md shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-40 border-b ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <BrandLogo className="h-12 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <CompactLanguageSwitcher current={lang} setLang={setLang} theme={theme} darkMode={darkMode} />
          
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-400'} transition-colors`}>
             {darkMode ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button onClick={() => setTheme(theme === 'green' ? 'pink' : 'green')} className={`p-2 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} transition-colors`}>
             <Palette size={16} className={c.accentText} />
          </button>

          <button 
             onClick={() => setShowProfileModal(true)} 
             className={`p-2 rounded-full transition-colors shadow-sm border ${c.bgAccent} ${c.accentText} ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}
          >
             <User className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {error && (
           <div className="lg:col-span-12 mb-2">
              <div className={`border p-4 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 ${darkMode ? 'bg-red-900/20 border-red-900 text-red-200' : 'bg-red-50 border-red-100 text-red-600'}`}>
                 <AlertCircle className="h-5 w-5 shrink-0" />
                 <span className="font-medium text-sm">{error}</span>
              </div>
           </div>
        )}

        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            {partnerProfile ? (
            <>
               <GlassCard darkMode={darkMode} className="p-6 overflow-hidden relative group">
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${c.gradient}`} />
                  <div className="flex items-center gap-4 mb-4">
                     <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${theme === 'green' ? 'from-teal-100 to-cyan-100' : 'from-rose-100 to-pink-100'} flex items-center justify-center ${theme === 'green' ? 'text-teal-700' : 'text-rose-700'} font-bold text-xl border-2 border-white shadow-sm`}>
                        {partnerProfile.username.charAt(0).toUpperCase()}
                     </div>
                     <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${c.accentText}`}>{txt.connectedTo}</p>
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>{partnerProfile.username}</h3>
                     </div>
                  </div>
                  <div className={`rounded-xl p-3 flex items-center gap-2 border ${c.bgAccent} ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                      <div className={`h-2 w-2 rounded-full animate-pulse ${theme === 'green' ? 'bg-teal-500' : 'bg-rose-500'}`} />
                      <span className={`text-xs font-medium ${c.accentText}`}>{txt.online}</span>
                  </div>
               </GlassCard>

               <GlassCard darkMode={darkMode} className="p-6 relative overflow-hidden bg-gradient-to-br from-orange-50/10 to-rose-50/10 border-orange-100/20">
                  <div className="flex items-center justify-between relative z-10">
                      <div>
                         <p className="font-bold text-orange-500 text-lg">{txt.streak}</p>
                         <p className="text-xs text-orange-400/80 max-w-[120px]">{txt.streakDesc}</p>
                      </div>
                      <div className="text-right">
                         <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-red-500 flex items-center gap-1">
                            {streakCount} <Flame className="h-8 w-8 text-orange-500 fill-orange-500 animate-pulse" />
                         </span>
                      </div>
                  </div>
               </GlassCard>
            </>
            ) : (
             <GlassCard darkMode={darkMode} className={`p-6 text-center border-dashed border-2 ${darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-300 bg-slate-50/50'}`}>
                 <div className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-400'}`}>
                    <UserPlus className="h-6 w-6"/>
                 </div>
                 <p className={`${c.textMuted} font-medium`}>{txt.notConnected}</p>
                 <Button onClick={onGoToConnect} variant="outline" className={`mt-4 w-full ${darkMode ? 'border-slate-600 text-slate-300' : 'border-slate-300 text-slate-600'}`}>
                    {txt.connectNow}
                 </Button>
             </GlassCard>
            )}
            
            <div className={`hidden lg:block p-6 bg-gradient-to-br ${c.gradient} rounded-3xl shadow-xl shadow-teal-500/20 text-center text-white`}>
               <p className="text-sm font-medium italic opacity-90 leading-relaxed">"{txt.quote}"</p>
            </div>
        </div>

        {/* CENTER/RIGHT COLUMN */}
        <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
           
           {!partnerProfile ? (
             <GlassCard darkMode={darkMode} className={`p-10 text-center space-y-6 py-16 border-dashed border-2 ${theme === 'green' ? (darkMode ? 'border-teal-900' : 'border-teal-200/50') : (darkMode ? 'border-rose-900' : 'border-rose-200/50')}`}>
                <div className={`${theme === 'green' ? (darkMode ? 'bg-teal-900/50 text-teal-400' : 'bg-cyan-100 text-cyan-600') : (darkMode ? 'bg-rose-900/50 text-rose-400' : 'bg-pink-100 text-pink-600')} h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse ring-8 ring-opacity-20 ring-current`}>
                   <LinkIcon className="h-10 w-10" />
                </div>
                <div>
                   <h3 className={`text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{txt.connectPromptTitle}</h3>
                   <p className={`${c.textMuted} max-w-md mx-auto text-lg`}>{txt.connectPromptDesc}</p>
                </div>
                <Button onClick={onGoToConnect} className={`px-10 py-4 text-lg bg-gradient-to-r ${c.gradient} rounded-full shadow-lg hover:scale-105 transform transition-transform border-none text-white`}>
                   {txt.connectButton}
                </Button>
             </GlassCard>
           ) : (
             <div className="relative">
              <AnimatePresence>
                {isAnimating && (
                   <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 0, x: 0 }}
                      animate={{ 
                         opacity: [0, 1, 1, 0], 
                         scale: [0.5, 1.2, 0.8], 
                         y: -400, 
                         x: 200,
                         rotate: 15
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute z-50 pointer-events-none left-1/2 top-1/2"
                   >
                     <div className={`bg-gradient-to-tr ${c.gradient} p-4 rounded-full shadow-2xl`}>
                        <Send className="h-8 w-8 text-white" />
                     </div>
                   </motion.div>
                )}
              </AnimatePresence>

              <GlassCard darkMode={darkMode} className={`p-6 md:p-8 border-t-4 ${theme === 'green' ? 'border-t-teal-400' : 'border-t-rose-400'} shadow-2xl`}>
                <div className="text-center mb-6 space-y-2">
                  <div className={`inline-flex items-center justify-center p-2 rounded-full mb-2 ${c.bgAccent} ${c.accentText}`}>
                     <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{txt.sendWishTitle}</h3>
                  <p className={`text-sm ${c.textMuted}`}>{txt.sendWishDesc} <span className={`font-semibold ${c.accentText}`}>{partnerProfile.username}</span>.</p>
                </div>
                
                <form onSubmit={handleSendAndAnimate} className="space-y-4">
                  <textarea
                    rows={2}
                    className={`w-full px-4 py-4 border rounded-2xl focus:ring-4 outline-none transition-all text-lg resize-none text-center shadow-inner ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:ring-slate-600' : 'bg-white/50 border-slate-200 focus:ring-teal-200 focus:border-teal-400 placeholder-slate-400'}`}
                    placeholder={txt.placeholder}
                    value={wishInput}
                    onChange={e => setWishInput(e.target.value)}
                    disabled={remaining <= 0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if(wishInput.trim() && remaining > 0) handleSendAndAnimate(e);
                      }
                    }}
                  />
                  <div className="flex items-center justify-between gap-4">
                     <div className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>
                        <span className={`${remaining === 0 ? 'text-red-500' : (theme === 'green' ? 'text-teal-500' : 'text-rose-500')} text-sm`}>{remaining}</span> / 10 {txt.dailyLimit}
                     </div>
                     <Button type="submit" disabled={!wishInput.trim() || remaining <= 0} isLoading={loading} className={`px-8 py-3 rounded-xl bg-gradient-to-r ${c.gradient} w-full sm:w-auto font-bold tracking-wide text-white border-none hover:scale-105 transition-transform`}>
                       {txt.send} <ArrowRight className="h-4 w-4 ml-2" />
                     </Button>
                  </div>
                </form>
              </GlassCard>
           </div>
           )}

           {/* Wishes Feed */}
           {partnerProfile && (
           <div className="grid gap-6">
              
              <div className="space-y-4">
                 <div className="flex items-center gap-3 px-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${theme === 'green' ? 'bg-cyan-100 text-cyan-700' : 'bg-rose-100 text-rose-700'}`}>{partnerProfile.username.charAt(0).toUpperCase()}</div>
                    <h4 className={`font-bold text-lg ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{txt.forYou}</h4>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ml-auto ${theme === 'green' ? 'bg-cyan-50 text-cyan-600' : 'bg-rose-50 text-rose-600'}`}>{partnerWishes.length}</span>
                 </div>
                 
                 <div className="space-y-3">
                   {partnerWishes.length === 0 && (
                     <div className={`p-8 text-center border-2 border-dashed rounded-2xl ${darkMode ? 'border-slate-700 bg-slate-900/30' : 'border-slate-200 bg-white/30'}`}>
                        <p className={c.textMuted}>{txt.noWishesReceived}</p>
                     </div>
                   )}
                   {partnerWishes.map((wish: Wish) => (
                      <motion.div 
                        key={wish.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => onToggleWish(wish)}
                        className={`group relative overflow-hidden p-6 rounded-2xl border cursor-pointer transition-all ${
                          wish.is_completed 
                          ? `bg-gradient-to-r ${c.gradient} text-white border-transparent shadow-lg` 
                          : `${darkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-500' : 'bg-white border-white hover:border-teal-200'} shadow-sm`
                        }`}
                      >
                         <div className="flex items-center justify-between gap-4 relative z-10">
                            <p className={`text-lg font-medium leading-relaxed ${wish.is_completed ? 'text-white' : (darkMode ? 'text-slate-200' : 'text-slate-800')}`}>{wish.content}</p>
                            <div className={`shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                               wish.is_completed ? 'border-white bg-white/20' : (darkMode ? 'border-slate-600' : 'border-slate-200')
                            }`}>
                               {wish.is_completed && <Check className="h-5 w-5 text-white" />}
                            </div>
                         </div>
                      </motion.div>
                   ))}
                 </div>
              </div>

              <div className={`space-y-4 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-teal-100/50'}`}>
                 <div className="flex items-center gap-3 px-2 opacity-80">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${theme === 'green' ? 'bg-teal-100 text-teal-700' : 'bg-pink-100 text-pink-700'}`}>Me</div>
                    <h4 className={`font-bold text-sm uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{txt.sentByYou}</h4>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ml-auto ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{myWishes.length} {txt.sent}</span>
                 </div>

                 <div className="space-y-3">
                    {myWishes.map((wish: Wish) => (
                       <motion.div 
                         key={wish.id}
                         layout
                         className={`flex items-center justify-between p-4 rounded-xl border transition-colors shadow-sm group ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white/40 border-white hover:bg-white'}`}
                       >
                          <div className="flex items-center gap-3">
                             <div className={`h-2 w-2 rounded-full ${wish.is_completed ? (theme === 'green' ? 'bg-teal-500' : 'bg-rose-500') : 'bg-slate-300'}`} />
                             <span className={`${wish.is_completed ? 'line-through text-slate-400' : (darkMode ? 'text-slate-300' : 'text-slate-700')} font-medium`}>{wish.content}</span>
                          </div>
                          <div className="flex items-center gap-3">
                             {wish.is_completed && <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${theme === 'green' ? 'text-teal-600 bg-teal-50' : 'text-rose-600 bg-rose-50'}`}>{txt.completed}</span>}
                             <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteWish(wish.id); }} 
                                className="text-slate-300 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50 group-hover:text-slate-400"
                                title="Delete"
                             >
                                <Trash2 className="h-4 w-4" />
                             </button>
                          </div>
                       </motion.div>
                    ))}
                    {myWishes.length === 0 && (
                       <p className={`text-center text-xs py-4 ${c.textMuted}`}>{txt.noWishesSent}</p>
                    )}
                 </div>
              </div>

           </div>
           )}
        </div>

      </main>

      <Modal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        title={txt.yourProfile}
        maxWidth="max-w-2xl"
        darkMode={darkMode}
      >
         <div className="space-y-8">
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">{txt.profileInfo}</h4>
                <div className={`p-6 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{txt.emailLabel}</label>
                                <div className={`flex items-center px-4 py-2 border rounded-lg cursor-not-allowed ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    <span className="text-sm truncate">{userEmail || 'user@example.com'}</span>
                                </div>
                            </div>
                            <div>
                                <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Username</label>
                                <div className="flex gap-2">
                                    <input 
                                        value={newUsername} 
                                        onChange={e => setNewUsername(e.target.value)} 
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none text-sm ${darkMode ? 'bg-slate-900 border-slate-700 text-white focus:ring-teal-900' : 'bg-white border-slate-200 focus:ring-teal-500'}`}
                                    />
                                    <Button type="submit" isLoading={editLoading} className={`px-4 py-2 text-xs h-full ${theme === 'green' ? 'bg-teal-600' : 'bg-rose-600'} text-white border-none`}>{txt.saveChanges}</Button>
                                </div>
                            </div>
                        </div>
                        {editError && <p className="text-red-500 text-xs">{editError}</p>}
                    </form>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">{txt.statsTitle}</h4>
                   <p className="text-xs text-slate-400">{txt.statsDesc}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-teal-50 to-white border-teal-100'}`}>
                        <div className={`flex items-center gap-2 mb-2 ${theme === 'green' ? 'text-teal-600' : 'text-rose-600'}`}>
                             <Check className="h-5 w-5" />
                             <span className="font-bold text-sm">{txt.completionRate}</span>
                        </div>
                        <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>{partnerProfile ? `${stats.completion}%` : '-'}</p>
                        <p className="text-xs text-slate-400 mt-1">{txt.compExpl}</p>
                    </div>

                    <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                             <BarChart3 className="h-5 w-5" />
                             <span className="font-bold text-sm">{txt.activity}</span>
                        </div>
                        
                        {partnerProfile ? (
                        <div className="flex items-end justify-between h-20 gap-2">
                            {stats.chart.map((d: any, i: number) => {
                                const maxCount = Math.max(...stats.chart.map((s:any) => s.count), 5); 
                                const heightPercentage = Math.max(10, (d.count / maxCount) * 100);
                                return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                    <div className="w-full h-full flex items-end justify-center relative">
                                        <div 
                                            style={{ height: `${heightPercentage}%` }}
                                            className={`w-full max-w-[8px] rounded-full transition-all duration-300 ${d.count > 0 ? (theme === 'green' ? 'bg-teal-400' : 'bg-rose-400') : (darkMode ? 'bg-slate-700' : 'bg-slate-100')}`}
                                        />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400">{d.day.substring(0, 1)}</span>
                                </div>
                            )})}
                        </div>
                        ) : (
                            <div className="h-20 flex items-center justify-center text-slate-300 text-sm">No data</div>
                        )}
                        <p className="text-xs text-slate-400 mt-2 text-center">{txt.chartExpl}</p>
                    </div>
                </div>
            </div>

            <div className={`pt-4 border-t flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                 <button onClick={onLogout} className={`text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                     <LogOut className="h-4 w-4"/> {txt.logout}
                 </button>

                 {partnerProfile && (
                     <button onClick={async () => { await onDelink(); setShowProfileModal(false); }} className={`text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'}`}>
                        <HeartCrack className="h-4 w-4"/> {txt.unlink}
                     </button>
                 )}
            </div>
         </div>
      </Modal>
    </div>
  );
};

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<ViewState>('LANDING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Data
  const [profile, setProfile] = useState<Profile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<Profile | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [historyWishes, setHistoryWishes] = useState<Wish[]>([]);
  
  // Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [wishInput, setWishInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // UI
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('green');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setView('LANDING');
        setProfile(null);
        setPartnerProfile(null);
        setWishes([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
      if (!session || !partnerProfile) return;
      const interval = setInterval(() => {
          fetchWishes(session.user.id, partnerProfile.id);
      }, 10000); // Polling every 10s
      return () => clearInterval(interval);
  }, [session, partnerProfile]);

  const fetchUserData = async (userId: string) => {
    setLoading(true);
    try {
      const profileData = await api.getProfile(userId);
      if (!profileData) {
        setView('ONBOARDING');
        setLoading(false);
        return;
      }
      setProfile(profileData);

      const connectionData = await api.getConnection(userId);
      if (connectionData) {
        const partner = await api.getProfile(connectionData.partner_id);
        setPartnerProfile(partner);
        fetchWishes(userId, connectionData.partner_id);
      }
      
      if (view === 'AUTH' || view === 'ONBOARDING' || view === 'LANDING') {
          // If connection missing, logic in dashboard handles "Connect Now" state
          setView('DASHBOARD');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishes = async (myId: string, partnerId: string) => {
      try {
          const todays = await api.getTodaysWishes(myId, partnerId);
          setWishes(todays);
          const history = await api.getPairWishes(myId, partnerId);
          setHistoryWishes(history);
      } catch (e) { console.error(e); }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setLoading(true);
    try {
      const profile = await api.createProfile(session.user.id, username);
      setProfile(profile);
      setView('CONNECT');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !profile) return;
    setLoading(true);
    setError('');
    try {
      const partner = await api.findProfileByUsername(partnerName);
      if (!partner) throw new Error("User not found");
      if (partner.id === profile.id) throw new Error("Cannot connect to yourself");
      
      await api.createConnection(profile.id, partner.id);
      setPartnerProfile(partner);
      setView('DASHBOARD');
      fetchWishes(profile.id, partner.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !profile || !partnerProfile || !wishInput.trim()) return;
    setLoading(true);
    try {
      await api.sendWish(profile.id, partnerProfile.id, wishInput);
      setWishInput('');
      fetchWishes(profile.id, partnerProfile.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWish = async (wish: Wish) => {
      try {
          await api.toggleWishCompletion(wish.id, wish.is_completed);
          if (profile && partnerProfile) fetchWishes(profile.id, partnerProfile.id);
      } catch (e) { console.error(e); }
  };

  const handleDeleteWish = async (wishId: string) => {
      if(!confirm("Delete this wish?")) return;
      try {
          await api.deleteWish(wishId);
          if (profile && partnerProfile) fetchWishes(profile.id, partnerProfile.id);
      } catch (e) { console.error(e); }
  }

  const handleLogout = async () => {
      await supabase.auth.signOut();
      setView('LANDING');
      setProfile(null);
      setPartnerProfile(null);
      setWishes([]);
  };

  const handleDelink = async () => {
      if(!profile) return;
      setLoading(true);
      try {
          await api.deleteConnection(profile.id);
          setPartnerProfile(null);
          setWishes([]);
          setHistoryWishes([]);
      } catch (e: any) {
          setError(e.message);
      } finally {
          setLoading(false);
      }
  };

  const handleUpdateUsername = async (newUsername: string) => {
      if(!profile) return;
      const updated = await api.updateProfile(profile.id, { username: newUsername });
      setProfile(updated);
  }

  const getStats = () => {
      if(!historyWishes.length) return { completion: 0, chart: [] };
      const completed = historyWishes.filter(w => w.is_completed).length;
      const rate = Math.round((completed / historyWishes.length) * 100);
      
      const chart = [];
      for(let i=6; i>=0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dayStr = d.toDateString();
          const count = historyWishes.filter(w => new Date(w.created_at).toDateString() === dayStr && w.sender_id === profile?.id).length;
          chart.push({ day: d.toLocaleDateString(lang, {weekday: 'short'}), count });
      }
      return { completion: rate, chart };
  }

  const remaining = 10 - wishes.filter(w => w.sender_id === profile?.id).length;

  return (
      <>
        {view === 'LANDING' && (
            <LandingView 
                setView={setView} 
                lang={lang} 
                setLang={setLang}
                theme={theme}
                setTheme={setTheme}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />
        )}
        {(view === 'AUTH' || view === 'ADMIN_LOGIN') && (
            <AuthView 
                isSignUp={isSignUp} 
                setIsSignUp={setIsSignUp} 
                email={email} 
                setEmail={setEmail} 
                password={password} 
                setPassword={setPassword} 
                onSubmit={handleAuth} 
                loading={loading} 
                error={error} 
                onBack={() => setView('LANDING')}
                lang={lang}
                theme={theme}
                darkMode={darkMode}
            />
        )}
        {view === 'ONBOARDING' && (
            <OnboardingView 
                username={username} 
                setUsername={setUsername} 
                onSubmit={handleOnboarding} 
                loading={loading} 
                error={error} 
                onLogout={handleLogout}
                lang={lang}
                theme={theme}
                darkMode={darkMode}
            />
        )}
        {view === 'CONNECT' && (
            <ConnectView 
                partnerName={partnerName} 
                setPartnerName={setPartnerName} 
                onSubmit={handleConnect} 
                loading={loading} 
                error={error} 
                myUsername={profile?.username}
                onLogout={handleLogout}
                lang={lang}
                theme={theme}
                darkMode={darkMode}
            />
        )}
        {view === 'DASHBOARD' && (
            <DashboardView 
                profile={profile}
                partnerProfile={partnerProfile}
                wishes={wishes}
                historyWishes={historyWishes}
                stats={getStats()}
                remaining={remaining}
                wishInput={wishInput}
                setWishInput={setWishInput}
                onSendWish={handleSendWish}
                onToggleWish={handleToggleWish}
                onDeleteWish={handleDeleteWish}
                onLogout={handleLogout}
                onDelink={handleDelink}
                loading={loading}
                error={error}
                onUpdateUsername={handleUpdateUsername}
                onGoToConnect={() => setView('CONNECT')}
                lang={lang}
                setLang={setLang}
                userEmail={session?.user?.email}
                theme={theme}
                setTheme={setTheme}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />
        )}
      </>
  );
};

export default App;
