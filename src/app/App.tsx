import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Moon, Sun, Globe, Menu, X, Heart, TrendingUp, Users, Shield,
  Copy, Check, ChevronDown, ChevronUp, Search, ArrowRight, Star,
  Bell, Settings, LogOut, Download, Filter, Eye, Edit, Trash2, Plus,
  Send, CheckCircle, Clock, Home, Bookmark, FileText, User, Target,
  Droplets, BookOpen, Zap, Award, DollarSign, Activity, AlertTriangle,
  BarChart2, RefreshCw, MapPin, Calendar, Mail, Building, Share2,
  ChevronRight, ShoppingBag,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Lang = "ar" | "en";
type Theme = "dark" | "light";
type Page = "landing" | "campaign" | "dashboard" | "admin";
type DonStatus = "pending" | "confirmed" | "rejected";

interface Campaign {
  id: number; titleAr: string; titleEn: string; descAr: string; descEn: string;
  storyAr: string; storyEn: string; image: string; raised: number; goal: number;
  donors: number; category: string; categoryAr: string; categoryEn: string;
  daysLeft: number; featured: boolean; urgent: boolean; locationAr: string; locationEn: string;
}
interface DonRecord { id: string; campaignTitleAr: string; campaignTitleEn: string; amount: number; txid: string; date: string; status: DonStatus; }
interface Testimonial { nameAr: string; nameEn: string; countryAr: string; countryEn: string; textAr: string; textEn: string; rating: number; avatar: string; }
interface FaqItem { questionAr: string; questionEn: string; answerAr: string; answerEn: string; }

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────

const T = {
  ar: {
    brand: "نور العطاء",
    nav: { home: "الرئيسية", campaigns: "الحملات", howItWorks: "كيف يعمل", dashboard: "حسابي", admin: "الإدارة", donate: "تبرع الآن" },
    hero: {
      badge: "منصة التبرع الرقمية الأولى · USDT TRC20",
      line1: "ادعم", line2: "التغيير الحقيقي",
      sub: "تبرع بـ USDT (TRC20) بأمان وشفافية تامة. كل تبرع يصل مباشرةً إلى مستحقيه ويُحدث فرقاً حقيقياً في حياة آلاف البشر.",
      cta1: "تبرع الآن", cta2: "تصفح الحملات",
      trust: "موثوق من أكثر من ٥٢٬٠٠٠ متبرع حول العالم",
    },
    stats: [
      { label: "إجمالي التبرعات", value: "$2.4M+" },
      { label: "الحملات النشطة", value: "128" },
      { label: "المتبرعون", value: "52,400+" },
      { label: "دول مستفيدة", value: "47" },
    ],
    sec: { campaigns: "الحملات المميزة", campaignsSub: "اختر القضية الأقرب إلى قلبك وكن جزءاً من التغيير", categories: "تصفح حسب المجال", categoriesSub: "نعمل في أكثر من ٦ مجالات إنسانية حيوية لصنع التغيير", howItWorks: "كيف تتبرع؟", howItWorksSub: "أربع خطوات بسيطة للتبرع الآمن والشفاف", testimonials: "ماذا يقول متبرعونا", testimonialsSub: "آراء حقيقية من متبرعين حقيقيين حول العالم", faq: "الأسئلة الشائعة", faqSub: "كل ما تحتاج معرفته عن منصتنا" },
    cats: [
      { label: "التعليم", count: "٤٥ حملة", icon: "edu" },
      { label: "المياه النظيفة", count: "٢٣ حملة", icon: "water" },
      { label: "الرعاية الصحية", count: "٣١ حملة", icon: "health" },
      { label: "الغذاء", count: "١٩ حملة", icon: "food" },
      { label: "المأوى", count: "٨ حملات", icon: "shelter" },
      { label: "الطوارئ", count: "٢ حملات", icon: "emergency" },
    ],
    steps: [
      { title: "اختر حملتك", desc: "تصفح الحملات واختر القضية الأقرب إلى قلبك" },
      { title: "حدد المبلغ", desc: "اختر مبلغاً جاهزاً أو أدخل مبلغاً مخصصاً بالـ USDT" },
      { title: "أرسل USDT", desc: "أرسل المبلغ إلى عنوان محفظة TRC20 المحدد أو عبر رمز QR" },
      { title: "أكد التبرع", desc: "أدخل معرف المعاملة TXID ليتم التأكيد خلال ٢٤ ساعة" },
    ],
    card: { raised: "تم جمع", goal: "الهدف", donors: "متبرع", daysLeft: "يوم متبقي", urgent: "عاجل", featured: "مميز", donate: "تبرع الآن", details: "التفاصيل", viewAll: "عرض جميع الحملات", searchPlaceholder: "ابحث عن حملة... مثلاً: تعليم، مياه، طوارئ", all: "الكل" },
    footer: { tagline: "معاً نصنع مستقبلاً أفضل للجميع", links: "روابط سريعة", contact: "تواصل معنا", social: "تابعنا", rights: "جميع الحقوق محفوظة", privacy: "الخصوصية", terms: "الشروط" },
    modal: {
      title: "إتمام تبرعك", sub: "تبرع آمن وشفاف عبر شبكة USDT TRC20",
      amounts: [50, 100, 250, 500, 1000, 2500],
      customLabel: "مبلغ مخصص", customPlaceholder: "٠.٠٠ USDT",
      walletTitle: "عنوان محفظة TRC20", walletAddress: "TKjV6zduE3pFEiBFQQoxCoQCEp823KtMGx",
      copy: "نسخ", copied: "تم النسخ!",
      qrTitle: "أو امسح رمز QR",
      txidLabel: "معرف المعاملة (TXID)", txidPlaceholder: "الصق رمز المعاملة هنا...",
      nameLabel: "الاسم", namePlaceholder: "اسمك الكريم",
      emailLabel: "البريد الإلكتروني", emailPlaceholder: "بريدك الإلكتروني (اختياري)",
      anonymous: "التبرع بشكل مجهول",
      submit: "إرسال التبرع", submitting: "جاري الإرسال...",
      successTitle: "تم إرسال تبرعك بنجاح! 🎉", successMsg: "شكراً جزيلاً على كرمك. سيتم مراجعة معاملتك وتأكيدها خلال ٢٤ ساعة.",
      note: "تأكد من الإرسال على شبكة TRON (TRC20) فقط",
      close: "إغلاق", backHome: "العودة للرئيسية",
    },
    campaign: { about: "عن الحملة", story: "القصة", updates: "التحديثات", recentDonors: "أحدث المتبرعين", donateWidget: "تبرع لهذه الحملة", raised: "تم جمع", goal: "الهدف", donors: "متبرع", daysLeft: "يوم متبقي", share: "مشاركة", donate: "تبرع الآن", related: "حملات مشابهة", update: "تحديث", anonymous: "متبرع مجهول" },
    dash: {
      title: "لوحة التحكم", welcome: "مرحباً،", userName: "أحمد المحمد",
      totalDonated: "إجمالي تبرعاتك", campaigns: "حملات مدعومة", impact: "شخص تأثر",
      tabs: { history: "سجل التبرعات", favorites: "المفضلة", receipts: "الإيصالات", settings: "الإعدادات" },
      status: { pending: "قيد المراجعة", confirmed: "مؤكد", rejected: "مرفوض" },
      download: "تحميل الإيصال", noFav: "لا توجد حملات مفضلة بعد", settTitle: "إعدادات الحساب",
      table: { campaign: "الحملة", amount: "المبلغ", date: "التاريخ", status: "الحالة", action: "إجراء" },
    },
    admin: {
      title: "لوحة الإدارة",
      kpis: [
        { label: "إجمالي الإيرادات", value: "$405,200", change: "+18.4%" },
        { label: "تبرعات معلقة", value: "47", change: "+6" },
        { label: "حملات نشطة", value: "128", change: "+3" },
        { label: "المستخدمون", value: "52,419", change: "+1,240" },
      ],
      tabs: { overview: "نظرة عامة", campaigns: "الحملات", donations: "التبرعات", users: "المستخدمون" },
      approve: "قبول", reject: "رفض", add: "إضافة حملة", exportCSV: "تصدير CSV", exportPDF: "تصدير PDF",
      revenueChart: "الإيرادات الشهرية", categoryChart: "توزيع الحملات",
      table: { donor: "المتبرع", amount: "المبلغ", campaign: "الحملة", date: "التاريخ", status: "الحالة", action: "إجراء", title: "عنوان الحملة", progress: "التقدم", org: "المنظمة", name: "الاسم", email: "البريد", joined: "تاريخ الانضمام", donations: "التبرعات" },
    },
  },
  en: {
    brand: "NoorAtaa",
    nav: { home: "Home", campaigns: "Campaigns", howItWorks: "How It Works", dashboard: "My Account", admin: "Admin", donate: "Donate Now" },
    hero: {
      badge: "Premier Digital Donation Platform · USDT TRC20",
      line1: "Support", line2: "Real Change",
      sub: "Donate USDT (TRC20) securely and transparently. Every donation reaches those who need it most and creates real impact for thousands of lives.",
      cta1: "Donate Now", cta2: "Browse Campaigns",
      trust: "Trusted by over 52,000 donors worldwide",
    },
    stats: [
      { label: "Total Raised", value: "$2.4M+" },
      { label: "Active Campaigns", value: "128" },
      { label: "Donors", value: "52,400+" },
      { label: "Countries Reached", value: "47" },
    ],
    sec: { campaigns: "Featured Campaigns", campaignsSub: "Choose a cause close to your heart and be part of the change", categories: "Browse by Category", categoriesSub: "We work in 6+ vital humanitarian sectors to create change", howItWorks: "How to Donate?", howItWorksSub: "Four simple steps for safe and transparent giving", testimonials: "What Our Donors Say", testimonialsSub: "Real reviews from real donors around the world", faq: "Frequently Asked Questions", faqSub: "Everything you need to know about our platform" },
    cats: [
      { label: "Education", count: "45 campaigns", icon: "edu" },
      { label: "Clean Water", count: "23 campaigns", icon: "water" },
      { label: "Healthcare", count: "31 campaigns", icon: "health" },
      { label: "Food", count: "19 campaigns", icon: "food" },
      { label: "Shelter", count: "8 campaigns", icon: "shelter" },
      { label: "Emergency", count: "2 campaigns", icon: "emergency" },
    ],
    steps: [
      { title: "Choose Your Campaign", desc: "Browse campaigns and choose the cause closest to your heart" },
      { title: "Select Amount", desc: "Choose a preset amount or enter a custom USDT amount" },
      { title: "Send USDT", desc: "Send the amount to the specified TRC20 wallet or scan QR code" },
      { title: "Confirm Donation", desc: "Enter your TXID for confirmation within 24 hours" },
    ],
    card: { raised: "Raised", goal: "Goal", donors: "donors", daysLeft: "days left", urgent: "Urgent", featured: "Featured", donate: "Donate Now", details: "Details", viewAll: "View All Campaigns", searchPlaceholder: "Search campaigns... e.g. education, water, emergency", all: "All" },
    footer: { tagline: "Together we build a better future for all", links: "Quick Links", contact: "Contact Us", social: "Follow Us", rights: "All Rights Reserved", privacy: "Privacy", terms: "Terms" },
    modal: {
      title: "Complete Your Donation", sub: "Secure & transparent donation via USDT TRC20 Network",
      amounts: [50, 100, 250, 500, 1000, 2500],
      customLabel: "Custom Amount", customPlaceholder: "0.00 USDT",
      walletTitle: "TRC20 Wallet Address", walletAddress: "TKjV6zduE3pFEiBFQQoxCoQCEp823KtMGx",
      copy: "Copy", copied: "Copied!",
      qrTitle: "Or Scan QR Code",
      txidLabel: "Transaction ID (TXID)", txidPlaceholder: "Paste your transaction ID here...",
      nameLabel: "Name", namePlaceholder: "Your full name",
      emailLabel: "Email", emailPlaceholder: "Your email (optional)",
      anonymous: "Donate anonymously",
      submit: "Submit Donation", submitting: "Submitting...",
      successTitle: "Donation Submitted Successfully! 🎉", successMsg: "Thank you for your generosity. Your transaction will be reviewed and confirmed within 24 hours.",
      note: "Send on the TRON (TRC20) network only",
      close: "Close", backHome: "Back to Home",
    },
    campaign: { about: "About Campaign", story: "Full Story", updates: "Updates", recentDonors: "Recent Donors", donateWidget: "Donate to This Campaign", raised: "Raised", goal: "Goal", donors: "donors", daysLeft: "days left", share: "Share", donate: "Donate Now", related: "Similar Campaigns", update: "Update", anonymous: "Anonymous Donor" },
    dash: {
      title: "Dashboard", welcome: "Welcome,", userName: "Ahmed Al-Mohammed",
      totalDonated: "Total Donated", campaigns: "Campaigns Supported", impact: "People Impacted",
      tabs: { history: "Donation History", favorites: "Favorites", receipts: "Receipts", settings: "Settings" },
      status: { pending: "Pending", confirmed: "Confirmed", rejected: "Rejected" },
      download: "Download Receipt", noFav: "No favorite campaigns yet", settTitle: "Account Settings",
      table: { campaign: "Campaign", amount: "Amount", date: "Date", status: "Status", action: "Action" },
    },
    admin: {
      title: "Admin Dashboard",
      kpis: [
        { label: "Total Revenue", value: "$405,200", change: "+18.4%" },
        { label: "Pending Donations", value: "47", change: "+6" },
        { label: "Active Campaigns", value: "128", change: "+3" },
        { label: "Total Users", value: "52,419", change: "+1,240" },
      ],
      tabs: { overview: "Overview", campaigns: "Campaigns", donations: "Donations", users: "Users" },
      approve: "Approve", reject: "Reject", add: "Add Campaign", exportCSV: "Export CSV", exportPDF: "Export PDF",
      revenueChart: "Monthly Revenue", categoryChart: "Campaign Distribution",
      table: { donor: "Donor", amount: "Amount", campaign: "Campaign", date: "Date", status: "Status", action: "Action", title: "Campaign Title", progress: "Progress", org: "Organization", name: "Name", email: "Email", joined: "Joined", donations: "Donations" },
    },
  },
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const campaigns: Campaign[] = [
  { id: 1, titleAr: "مدارس للأطفال في الصومال", titleEn: "Schools for Children in Somalia", descAr: "بناء ٣ مدارس لـ ٥٠٠ طفل محروم من التعليم في المناطق النائية", descEn: "Building 3 schools for 500 children deprived of education in remote areas", storyAr: "في المناطق النائية بالصومال، يحلم مئات الأطفال بفرصة التعلم. بسبب النزاعات وشح الموارد، لا توجد مدارس في هذه المناطق. هدفنا بناء ٣ مدارس مجهزة بالكامل لاستيعاب ٥٠٠ طالب، مع توفير المعلمين والمستلزمات التعليمية.", storyEn: "In remote areas of Somalia, hundreds of children dream of learning. Due to conflicts and scarce resources, there are no schools in these areas. Our goal is to build 3 fully equipped schools to accommodate 500 students, along with providing teachers and educational supplies.", image: "https://images.unsplash.com/flagged/photo-1555251255-e9a095d6eb9d?w=800&h=500&fit=crop&auto=format", raised: 18500, goal: 25000, donors: 234, category: "education", categoryAr: "التعليم", categoryEn: "Education", daysLeft: 18, featured: true, urgent: false, locationAr: "الصومال", locationEn: "Somalia" },
  { id: 2, titleAr: "مياه نظيفة لقرى نيجيريا", titleEn: "Clean Water for Nigerian Villages", descAr: "حفر ١٠ آبار مياه نظيفة لتوفير المياه الصالحة للشرب لـ ٢٠٠٠ أسرة", descEn: "Drilling 10 clean water wells to provide drinking water for 2000 families", storyAr: "تعاني قرى كثيرة في نيجيريا من شح المياه النظيفة، مما يدفع النساء والأطفال إلى قطع مسافات طويلة للحصول على المياه من مصادر ملوثة. مشروعنا يهدف إلى حفر ١٠ آبار مياه نظيفة تخدم ٢٠٠٠ أسرة.", storyEn: "Many villages in Nigeria suffer from a shortage of clean water, forcing women and children to travel long distances to get water from contaminated sources. Our project aims to drill 10 clean water wells serving 2000 families.", image: "https://images.unsplash.com/photo-1760873059715-7c7cfbe2a2c6?w=800&h=500&fit=crop&auto=format", raised: 31200, goal: 40000, donors: 389, category: "water", categoryAr: "المياه", categoryEn: "Water", daysLeft: 7, featured: true, urgent: true, locationAr: "نيجيريا", locationEn: "Nigeria" },
  { id: 3, titleAr: "مستشفى ميداني في اليمن", titleEn: "Field Hospital in Yemen", descAr: "دعم مستشفى ميداني يخدم أكثر من ٥٠٠٠ مريض شهرياً في مناطق النزاع", descEn: "Support a field hospital serving over 5000 patients monthly in conflict zones", storyAr: "في خضم النزاع اليمني، يصارع المرضى للحصول على الرعاية الصحية الأساسية. مستشفانا الميداني يعمل على مدار الساعة لخدمة ٥٠٠٠ مريض شهرياً. نحتاج إلى دعمكم لتوفير الأدوية والمعدات الطبية والكوادر البشرية.", storyEn: "Amid the Yemeni conflict, patients struggle to access basic healthcare. Our field hospital operates 24/7 serving 5000 patients monthly. We need your support to provide medicines, medical equipment, and human resources.", image: "https://images.unsplash.com/photo-1517120026326-d87759a7b63b?w=800&h=500&fit=crop&auto=format", raised: 52000, goal: 80000, donors: 621, category: "health", categoryAr: "الصحة", categoryEn: "Health", daysLeft: 30, featured: true, urgent: true, locationAr: "اليمن", locationEn: "Yemen" },
  { id: 4, titleAr: "مساعدات عاجلة لأهل غزة", titleEn: "Urgent Aid for Gaza", descAr: "إيصال مواد غذائية ودواء ومياه نظيفة لعائلات غزة المحاصرة في ظل الحصار المستمر", descEn: "Delivering food, medicine and clean water to besieged families in Gaza amid the ongoing blockade", storyAr: "يعاني أهل غزة من حصار خانق وشح حاد في الغذاء والدواء والمياه النظيفة. عائلات بأكملها تفترش الأرض في العراء بعد تدمير منازلها. تبرعك اليوم يُترجَم مباشرةً إلى وجبات وأدوية وخيام تصل إلى المحتاجين عبر شركائنا الموثوقين على الأرض.", storyEn: "The people of Gaza are suffering under a suffocating siege with acute shortages of food, medicine and clean water. Entire families are displaced after their homes were destroyed. Your donation today translates directly into meals, medicines and tents delivered to those in need through our trusted partners on the ground.", image: "https://images.unsplash.com/photo-1739879353789-41554220f9c4?w=800&h=500&fit=crop&auto=format", raised: 94700, goal: 150000, donors: 3812, category: "emergency", categoryAr: "الطوارئ", categoryEn: "Emergency", daysLeft: 3, featured: true, urgent: true, locationAr: "غزة، فلسطين", locationEn: "Gaza, Palestine" },
  { id: 5, titleAr: "وجبات للأيتام في إثيوبيا", titleEn: "Meals for Orphans in Ethiopia", descAr: "تأمين وجبات يومية مغذية لـ ٥٠٠ طفل يتيم في دور الرعاية", descEn: "Securing daily nutritious meals for 500 orphaned children in care homes", storyAr: "في دور رعاية الأيتام بإثيوبيا، يعاني الأطفال من سوء التغذية. وجبة واحدة يومياً في أحيان كثيرة هي كل ما يحصلون عليه. تبرعك يضمن ٣ وجبات يومية مغذية لكل طفل طوال عام كامل.", storyEn: "In Ethiopian orphanages, children suffer from malnutrition. Often a single meal a day is all they get. Your donation ensures 3 nutritious daily meals for every child throughout the year.", image: "https://images.unsplash.com/photo-1764555241048-f1fc72201704?w=800&h=500&fit=crop&auto=format", raised: 12300, goal: 20000, donors: 289, category: "food", categoryAr: "الغذاء", categoryEn: "Food", daysLeft: 25, featured: false, urgent: false, locationAr: "إثيوبيا", locationEn: "Ethiopia" },
  { id: 6, titleAr: "إعادة إعمار المنازل في تركيا", titleEn: "Rebuild Homes in Turkey", descAr: "مساعدة العائلات المتضررة من الزلزال على إعادة بناء منازلها المهدمة", descEn: "Help earthquake-affected families rebuild their destroyed homes", storyAr: "دمر الزلزال المدمر آلاف المنازل في جنوب تركيا، تاركاً عائلات بأكملها في العراء. برنامجنا يهدف إلى إعادة بناء ٢٠٠ منزل للعائلات الأكثر احتياجاً.", storyEn: "The devastating earthquake destroyed thousands of homes in southern Turkey, leaving entire families homeless. Our program aims to rebuild 200 homes for the most needy families.", image: "https://images.unsplash.com/photo-1732800577634-f2e5c4d43995?w=800&h=500&fit=crop&auto=format", raised: 67000, goal: 100000, donors: 834, category: "shelter", categoryAr: "المأوى", categoryEn: "Shelter", daysLeft: 45, featured: true, urgent: false, locationAr: "تركيا", locationEn: "Turkey" },
  { id: 7, titleAr: "تعليم المرأة في أفغانستان", titleEn: "Women Education in Afghanistan", descAr: "دعم مراكز تعليم سرية للنساء المحرومات من حق التعليم", descEn: "Support secret education centers for women deprived of their right to education", storyAr: "رغم القيود المفروضة، تسعى النساء الأفغانيات إلى التعلم بشجاعة. مراكزنا السرية تعلّم أكثر من ٣٠٠ امرأة مهارات القراءة والكتابة والحساب وتقنية المعلومات.", storyEn: "Despite restrictions, Afghan women bravely seek to learn. Our secret centers teach over 300 women reading, writing, math, and IT skills.", image: "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?w=800&h=500&fit=crop&auto=format", raised: 22400, goal: 35000, donors: 445, category: "education", categoryAr: "التعليم", categoryEn: "Education", daysLeft: 60, featured: false, urgent: false, locationAr: "أفغانستان", locationEn: "Afghanistan" },
  { id: 8, titleAr: "لقاحات للأطفال في الكونغو", titleEn: "Vaccines for Children in Congo", descAr: "توفير لقاحات ضرورية لـ ١٠٬٠٠٠ طفل في مناطق نائية بالكونغو", descEn: "Providing essential vaccines for 10,000 children in remote areas of Congo", storyAr: "تفتك الأمراض المعدية بمئات الأطفال سنوياً في الكونغو بسبب غياب اللقاحات. حملتنا تستهدف تطعيم ١٠٬٠٠٠ طفل ضد ٨ أمراض مميتة يمكن الوقاية منها.", storyEn: "Infectious diseases kill hundreds of children annually in Congo due to lack of vaccines. Our campaign targets vaccinating 10,000 children against 8 preventable deadly diseases.", image: "https://images.unsplash.com/photo-1778864874969-16e2432b2709?w=800&h=500&fit=crop&auto=format", raised: 44500, goal: 60000, donors: 567, category: "health", categoryAr: "الصحة", categoryEn: "Health", daysLeft: 20, featured: false, urgent: true, locationAr: "الكونغو", locationEn: "Congo" },
  { id: 9, titleAr: "مخيمات الطوارئ في السودان", titleEn: "Emergency Camps in Sudan", descAr: "إنشاء مخيمات إغاثة عاجلة للنازحين الفارين من الصراع المسلح", descEn: "Establishing emergency relief camps for displaced persons fleeing armed conflict", storyAr: "يفر مئات الآلاف من السودانيين من مناطق الصراع بلا مأوى أو طعام أو ماء. مخيماتنا الطارئة توفر مأوى ووجبات ومياه نظيفة ورعاية صحية أساسية لأكثر من ٥٠٠٠ نازح.", storyEn: "Hundreds of thousands of Sudanese flee conflict zones with no shelter, food, or water. Our emergency camps provide shelter, meals, clean water, and basic healthcare for over 5000 displaced people.", image: "https://images.unsplash.com/photo-1710093072228-8c3129f27357?w=800&h=500&fit=crop&auto=format", raised: 29800, goal: 50000, donors: 312, category: "emergency", categoryAr: "الطوارئ", categoryEn: "Emergency", daysLeft: 5, featured: false, urgent: true, locationAr: "السودان", locationEn: "Sudan" },
  { id: 10, titleAr: "أدوات مهنية للاجئين في الأردن", titleEn: "Professional Tools for Refugees in Jordan", descAr: "تمكين اللاجئين اقتصادياً بتوفير أدوات وتدريب مهني لبدء مشاريع صغيرة", descEn: "Economically empowering refugees with tools and vocational training to start businesses", storyAr: "يسعى اللاجئون في الأردن إلى الاستقلال الاقتصادي. برنامجنا يوفر أدوات مهنية وتدريباً متخصصاً لـ ٢٠٠ لاجئ لمساعدتهم على بدء مشاريع صغيرة مستدامة.", storyEn: "Refugees in Jordan seek economic independence. Our program provides professional tools and specialized training for 200 refugees to help them start sustainable small businesses.", image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&h=500&fit=crop&auto=format", raised: 16700, goal: 30000, donors: 198, category: "education", categoryAr: "التعليم", categoryEn: "Education", daysLeft: 40, featured: false, urgent: false, locationAr: "الأردن", locationEn: "Jordan" },
  { id: 11, titleAr: "إغاثة ضحايا الفيضانات في باكستان", titleEn: "Flood Relief in Pakistan", descAr: "إغاثة عاجلة للمتضررين من الفيضانات الكارثية في باكستان", descEn: "Emergency relief for those affected by catastrophic floods in Pakistan", storyAr: "دمرت الفيضانات القياسية مئات الآلاف من المنازل في باكستان، وأودت بحياة الآلاف. فريقنا على أرض الواقع يوزع مواد الإغاثة العاجلة ويساعد في إعادة الإعمار.", storyEn: "Record floods have destroyed hundreds of thousands of homes in Pakistan, killing thousands. Our team on the ground distributes emergency relief materials and helps with reconstruction.", image: "https://images.unsplash.com/photo-1609139003551-ee40f5f73ec0?w=800&h=500&fit=crop&auto=format", raised: 38200, goal: 55000, donors: 478, category: "emergency", categoryAr: "الطوارئ", categoryEn: "Emergency", daysLeft: 10, featured: false, urgent: true, locationAr: "باكستان", locationEn: "Pakistan" },
  { id: 12, titleAr: "مكتبات متنقلة في المغرب", titleEn: "Mobile Libraries in Morocco", descAr: "نشر ٢٠ مكتبة متنقلة في القرى النائية لتشجيع القراءة وتنمية المعرفة", descEn: "Deploying 20 mobile libraries in remote villages to encourage reading and knowledge", storyAr: "في القرى النائية بالمغرب، يحلم الأطفال بالوصول إلى الكتب والمعرفة. مكتباتنا المتنقلة تصل إلى ٥٠ قرية كل أسبوع بأكثر من ٥٠٠٠ كتاب متنوع.", storyEn: "In remote Moroccan villages, children dream of access to books and knowledge. Our mobile libraries reach 50 villages every week with over 5000 diverse books.", image: "https://images.unsplash.com/photo-1652664845183-c6083bc286fc?w=800&h=500&fit=crop&auto=format", raised: 7800, goal: 12000, donors: 134, category: "education", categoryAr: "التعليم", categoryEn: "Education", daysLeft: 55, featured: false, urgent: false, locationAr: "المغرب", locationEn: "Morocco" },
];

const donHistory: DonRecord[] = [
  { id: "DN001", campaignTitleAr: "مدارس للأطفال في الصومال", campaignTitleEn: "Schools for Children in Somalia", amount: 250, txid: "a1b2c3d4e5f6789012345678", date: "2024-12-10", status: "confirmed" },
  { id: "DN002", campaignTitleAr: "مستشفى ميداني في اليمن", campaignTitleEn: "Field Hospital in Yemen", amount: 500, txid: "b2c3d4e5f6789012345678ab", date: "2024-11-25", status: "confirmed" },
  { id: "DN003", campaignTitleAr: "إعادة إعمار المنازل في تركيا", campaignTitleEn: "Rebuild Homes in Turkey", amount: 100, txid: "c3d4e5f6789012345678abcd", date: "2024-11-15", status: "pending" },
  { id: "DN004", campaignTitleAr: "مياه نظيفة لقرى نيجيريا", campaignTitleEn: "Clean Water for Nigerian Villages", amount: 1000, txid: "d4e5f6789012345678abcdef", date: "2024-10-30", status: "confirmed" },
  { id: "DN005", campaignTitleAr: "مخيمات الطوارئ في السودان", campaignTitleEn: "Emergency Camps in Sudan", amount: 50, txid: "e5f6789012345678abcdef01", date: "2024-10-15", status: "rejected" },
];

const favCampaigns = [1, 3, 6, 9];

const testimonials: Testimonial[] = [
  { nameAr: "عبدالله المحمدي", nameEn: "Abdullah Al-Muhammadi", countryAr: "المملكة العربية السعودية", countryEn: "Saudi Arabia", textAr: "منصة رائعة وموثوقة. تبرعت عدة مرات وكل مرة أحصل على تأكيد سريع. أنصح بها الجميع.", textEn: "Amazing and reliable platform. I've donated several times and always get quick confirmation. Highly recommend it to everyone.", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" },
  { nameAr: "فاطمة الهاشمي", nameEn: "Fatima Al-Hashimi", countryAr: "الإمارات العربية المتحدة", countryEn: "United Arab Emirates", textAr: "أخيراً منصة تبرع شفافة وآمنة بالعملات الرقمية. أتابع الحملات باستمرار وأرى نتائج ملموسة.", textEn: "Finally a transparent and secure crypto donation platform. I follow campaigns regularly and see real results.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format" },
  { nameAr: "جون سميث", nameEn: "John Smith", countryAr: "المملكة المتحدة", countryEn: "United Kingdom", textAr: "سهولة الاستخدام وسرعة التأكيد مذهلتان. أتبرع كل شهر لحملات مختلفة.", textEn: "The ease of use and speed of confirmation are outstanding. I donate every month to different campaigns.", rating: 5, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format" },
  { nameAr: "مريم خليل", nameEn: "Mariam Khalil", countryAr: "مصر", countryEn: "Egypt", textAr: "أفضل طريقة للتبرع عبر USDT. الواجهة واضحة وسهلة، والمتابعة ممتازة.", textEn: "The best way to donate via USDT. The interface is clear and easy, and the follow-up is excellent.", rating: 4, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format" },
];

const faqs: FaqItem[] = [
  { questionAr: "كيف أتحقق من وصول تبرعي؟", questionEn: "How do I verify my donation arrived?", answerAr: "بعد إرسال المبلغ، أدخل معرف المعاملة (TXID) في نموذج التبرع. سيتم التحقق من المعاملة على بلوكتشين TRON وإرسال تأكيد لبريدك الإلكتروني خلال ٢٤ ساعة.", answerEn: "After sending the amount, enter the Transaction ID (TXID) in the donation form. The transaction will be verified on the TRON blockchain and a confirmation will be sent to your email within 24 hours." },
  { questionAr: "ما هي شبكة TRON وكيف تعمل؟", questionEn: "What is the TRON network and how does it work?", answerAr: "TRON هي شبكة بلوكتشين لامركزية تتيح إجراء معاملات مالية سريعة وآمنة بتكاليف منخفضة جداً. USDT على شبكة TRC20 هو العملة الرقمية المستقرة المربوطة بالدولار الأمريكي.", answerEn: "TRON is a decentralized blockchain network that enables fast, secure financial transactions at very low costs. USDT on the TRC20 network is a stable digital currency pegged to the US dollar." },
  { questionAr: "هل تبرعاتي آمنة؟", questionEn: "Are my donations secure?", answerAr: "نعم تماماً. جميع المعاملات مسجلة على بلوكتشين TRON ويمكن التحقق منها علناً. لا نحتفظ بأي بيانات مالية حساسة ولا نطلب مفاتيح محفظتك الخاصة.", answerEn: "Absolutely yes. All transactions are recorded on the TRON blockchain and can be publicly verified. We don't store any sensitive financial data and never ask for your private wallet keys." },
  { questionAr: "كم يستغرق تأكيد المعاملة؟", questionEn: "How long does transaction confirmation take?", answerAr: "عادةً يتم تأكيد المعاملات على شبكة TRON في غضون ٣-٥ دقائق. أما تأكيد التبرع من فريقنا فيتم خلال ٢٤ ساعة على أقصى تقدير.", answerEn: "TRON network transactions are typically confirmed within 3-5 minutes. Our team donation confirmation takes up to 24 hours maximum." },
  { questionAr: "هل يمكنني التبرع بشكل مجهول؟", questionEn: "Can I donate anonymously?", answerAr: "نعم، يمكنك تفعيل خيار التبرع المجهول في نموذج التبرع. لن يظهر اسمك في قائمة المتبرعين وستظهر بدلاً من ذلك كـ 'متبرع مجهول'.", answerEn: "Yes, you can enable the anonymous donation option in the donation form. Your name won't appear in the donors list and you'll appear as 'Anonymous Donor' instead." },
  { questionAr: "كيف أتصل بفريق الدعم؟", questionEn: "How do I contact the support team?", answerAr: "يمكنك التواصل معنا عبر البريد الإلكتروني support@noorataa.org أو عبر قنوات التواصل الاجتماعي. فريق الدعم متاح ٢٤/٧ للإجابة على جميع استفساراتك.", answerEn: "You can reach us via email at support@noorataa.org or through our social media channels. Support team is available 24/7 to answer all your questions." },
];

const revenueData = [
  { month: "يناير", monthEn: "Jan", revenue: 12400 },
  { month: "فبراير", monthEn: "Feb", revenue: 18600 },
  { month: "مارس", monthEn: "Mar", revenue: 15200 },
  { month: "أبريل", monthEn: "Apr", revenue: 22800 },
  { month: "مايو", monthEn: "May", revenue: 31400 },
  { month: "يونيو", monthEn: "Jun", revenue: 28900 },
  { month: "يوليو", monthEn: "Jul", revenue: 35200 },
  { month: "أغسطس", monthEn: "Aug", revenue: 42600 },
  { month: "سبتمبر", monthEn: "Sep", revenue: 38900 },
  { month: "أكتوبر", monthEn: "Oct", revenue: 45100 },
  { month: "نوفمبر", monthEn: "Nov", revenue: 52300 },
  { month: "ديسمبر", monthEn: "Dec", revenue: 61800 },
];

const categoryPie = [
  { nameAr: "التعليم", nameEn: "Education", value: 35, color: "#26A69A" },
  { nameAr: "الصحة", nameEn: "Health", value: 28, color: "#EF5350" },
  { nameAr: "المياه", nameEn: "Water", value: 15, color: "#42A5F5" },
  { nameAr: "الغذاء", nameEn: "Food", value: 12, color: "#FFA726" },
  { nameAr: "المأوى", nameEn: "Shelter", value: 7, color: "#66BB6A" },
  { nameAr: "الطوارئ", nameEn: "Emergency", value: 3, color: "#AB47BC" },
];

const pendingDons = [
  { id: "TXN001", donor: "أحمد الراشدي", donorEn: "Ahmed Al-Rashidi", amount: 500, campaignAr: "مستشفى ميداني في اليمن", campaignEn: "Field Hospital in Yemen", txid: "a1b2c3...e5f6", date: "2024-12-15", status: "pending" },
  { id: "TXN002", donor: "Sarah Johnson", donorEn: "Sarah Johnson", amount: 250, campaignAr: "مياه نظيفة لقرى نيجيريا", campaignEn: "Clean Water for Nigerian Villages", txid: "b2c3d4...f7a8", date: "2024-12-14", status: "pending" },
  { id: "TXN003", donor: "محمد العلي", donorEn: "Mohammed Al-Ali", amount: 1000, campaignAr: "مدارس للأطفال في الصومال", campaignEn: "Schools for Children in Somalia", txid: "c3d4e5...g8b9", date: "2024-12-13", status: "pending" },
  { id: "TXN004", donor: "Aisha Nkrumah", donorEn: "Aisha Nkrumah", amount: 100, campaignAr: "لقاحات للأطفال في الكونغو", campaignEn: "Vaccines for Children in Congo", txid: "d4e5f6...h9c0", date: "2024-12-12", status: "confirmed" },
  { id: "TXN005", donor: "خالد المنصور", donorEn: "Khalid Al-Mansour", amount: 2500, campaignAr: "إعادة إعمار المنازل في تركيا", campaignEn: "Rebuild Homes in Turkey", txid: "e5f6a7...i0d1", date: "2024-12-11", status: "confirmed" },
];

const adminUsers = [
  { id: "U001", nameAr: "أحمد المحمد", nameEn: "Ahmed Al-Mohammed", email: "ahmed@email.com", joined: "2024-01-15", donations: 5, total: 1850 },
  { id: "U002", nameAr: "سارة جونسون", nameEn: "Sarah Johnson", email: "sarah@email.com", joined: "2024-02-20", donations: 3, total: 650 },
  { id: "U003", nameAr: "محمد العلي", nameEn: "Mohammed Al-Ali", email: "mohammed@email.com", joined: "2024-03-10", donations: 8, total: 4200 },
  { id: "U004", nameAr: "خديجة ندياي", nameEn: "Khadija Ndiaye", email: "khadija@email.com", joined: "2024-04-05", donations: 2, total: 300 },
  { id: "U005", nameAr: "دانييل ليفي", nameEn: "Daniel Levy", email: "daniel@email.com", joined: "2024-05-18", donations: 12, total: 6800 },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────

const pct = (raised: number, goal: number) => Math.min(Math.round((raised / goal) * 100), 100);
const fmtUSDT = (n: number) => `$${n.toLocaleString()}`;

function getCatIcon(icon: string, cls = "w-6 h-6") {
  switch (icon) {
    case "edu": return <BookOpen className={cls} />;
    case "water": return <Droplets className={cls} />;
    case "health": return <Heart className={cls} />;
    case "food": return <ShoppingBag className={cls} />;
    case "shelter": return <Building className={cls} />;
    case "emergency": return <AlertTriangle className={cls} />;
    default: return <Star className={cls} />;
  }
}

// ─── QR CODE SVG ──────────────────────────────────────────────────────────────

function QRCodeSVG() {
  const p = [
    [1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1],
    [0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0],
    [1,1,1,0,1,1,1,0,0,1,1,1,1,0,1,0,1,1,1,0,1],
    [0,0,0,1,0,0,0,1,1,0,0,0,1,1,0,1,0,0,0,1,0],
    [1,0,1,0,1,0,1,0,1,1,0,1,0,0,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,0,0,1,0,0,0],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,1,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,0,1,0,1,0,1,0,1,1],
  ];
  const cs = 7;
  const sz = p.length * cs + 8;
  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} className="rounded-lg">
      <rect width={sz} height={sz} fill="white" rx="6" />
      {p.map((row, y) => (
        <g key={y}>
          {row.map((cell, x) => cell ? (
            <rect key={x} x={x * cs + 4} y={y * cs + 4} width={cs - 1} height={cs - 1} fill="#0A0E1F" rx="0.5" />
          ) : null)}
        </g>
      ))}
    </svg>
  );
}

// ─── GLASS CARD ───────────────────────────────────────────────────────────────

function GCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────

function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-700 dark:from-teal-400 dark:to-emerald-500"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status, lang }: { status: DonStatus; lang: Lang }) {
  const labels = { pending: { ar: "قيد المراجعة", en: "Pending" }, confirmed: { ar: "مؤكد", en: "Confirmed" }, rejected: { ar: "مرفوض", en: "Rejected" } };
  const colors = { pending: "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400", confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400", rejected: "bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400" };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>{labels[status][lang]}</span>;
}

// ─── CAMPAIGN CARD ────────────────────────────────────────────────────────────

function CampaignCard({ c, lang, onDonate, onDetails }: { c: Campaign; lang: Lang; onDonate: () => void; onDetails: () => void }) {
  const tr = T[lang].card;
  const progress = pct(c.raised, c.goal);
  return (
    <motion.div
      className="group rounded-2xl overflow-hidden cursor-pointer backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-cyan-500/40 dark:hover:border-teal-400/30 transition-all duration-300 flex flex-col"
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative h-48 overflow-hidden bg-blue-100 dark:bg-blue-950">
        <img src={c.image} alt={lang === "ar" ? c.titleAr : c.titleEn} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 start-3 flex gap-2 flex-wrap">
          {c.urgent && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">{tr.urgent}</span>}
          {c.featured && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-700 text-white">{tr.featured}</span>}
        </div>
        <div className="absolute bottom-3 start-3">
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">{lang === "ar" ? c.categoryAr : c.categoryEn}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-1">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <span className="text-xs text-muted-foreground">{lang === "ar" ? c.locationAr : c.locationEn}</span>
        </div>
        <h3 className="font-bold text-sm leading-snug mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">{lang === "ar" ? c.titleAr : c.titleEn}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">{lang === "ar" ? c.descAr : c.descEn}</p>
        <ProgressBar value={progress} className="mb-2" />
        <div className="flex justify-between text-xs mb-3">
          <span className="text-primary dark:text-teal-400 font-bold">{fmtUSDT(c.raised)}</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mb-4">
          <span><span className="text-foreground font-semibold">{c.donors.toLocaleString()}</span> {tr.donors}</span>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={onDonate}
            className="flex-1 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-700 dark:from-teal-400 dark:to-emerald-500 text-white hover:opacity-90 transition-opacity"
            whileTap={{ scale: 0.97 }}
          >{tr.donate}</motion.button>
          <motion.button
            onClick={onDetails}
            className="flex-1 py-2 rounded-xl text-xs font-semibold border border-primary/30 dark:border-teal-400/30 text-primary dark:text-teal-400 hover:bg-primary/5 dark:hover:bg-cyan-400/5 transition-colors"
            whileTap={{ scale: 0.97 }}
          >{tr.details}</motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── DONATION MODAL ───────────────────────────────────────────────────────────

function DonationModal({ lang, campaign, onClose }: { lang: Lang; campaign: Campaign | null; onClose: () => void }) {
  const tr = T[lang].modal;
  const [amount, setAmount] = useState<number | null>(100);
  const [customAmt, setCustomAmt] = useState("");
  const [txid, setTxid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [anon, setAnon] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tr.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary dark:focus:border-teal-400 focus:outline-none text-sm text-foreground placeholder:text-muted-foreground transition-colors";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border border-black/10 dark:border-white/10 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {success ? (
            <div className="p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-foreground">{tr.successTitle}</h3>
              <p className="text-muted-foreground text-sm mb-6">{tr.successMsg}</p>
              <button onClick={onClose} className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-bold hover:opacity-90 transition-opacity">{tr.backHome}</button>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-lg text-foreground">{tr.title}</h2>
                  <p className="text-xs text-muted-foreground">{tr.sub}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"><X className="w-5 h-5" /></button>
              </div>

              {campaign && (
                <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-black/5 dark:bg-white/5">
                  <img src={campaign.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-blue-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{lang === "ar" ? campaign.titleAr : campaign.titleEn}</p>
                    <ProgressBar value={pct(campaign.raised, campaign.goal)} className="mt-1" />
                  </div>
                </div>
              )}

              {/* Amount */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{tr.customLabel}</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {tr.amounts.map((a) => (
                  <motion.button
                    key={a}
                    onClick={() => { setAmount(a); setCustomAmt(""); }}
                    className={`py-2 rounded-xl text-sm font-bold border transition-all ${amount === a && !customAmt ? "bg-gradient-to-r from-teal-600 to-emerald-700 text-white border-transparent" : "border-black/10 dark:border-white/10 hover:border-primary/40 dark:hover:border-teal-400/40 text-foreground"}`}
                    whileTap={{ scale: 0.95 }}
                  >${a}</motion.button>
                ))}
              </div>
              <input type="number" placeholder={tr.customPlaceholder} value={customAmt} onChange={(e) => { setCustomAmt(e.target.value); setAmount(null); }} className={`${inputCls} mb-4`} />

              {/* Wallet */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{tr.walletTitle}</p>
              <div className="flex items-center gap-2 mb-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <code className="flex-1 text-xs font-mono text-primary dark:text-teal-400 break-all">{tr.walletAddress}</code>
                <button onClick={handleCopy} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-cyan-400/10 text-primary dark:text-teal-400 text-xs font-semibold hover:bg-primary/20 transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? tr.copied : tr.copy}
                </button>
              </div>

              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 rounded-lg px-3 py-2 mb-4">{tr.note}</p>

              {/* TXID */}
              <label className="block text-xs font-semibold text-muted-foreground mb-1">{tr.txidLabel}</label>
              <input placeholder={tr.txidPlaceholder} value={txid} onChange={e => setTxid(e.target.value)} className={`${inputCls} font-mono mb-3`} />

              {/* Name / Email */}
              {!anon && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">{tr.nameLabel}</label>
                    <input placeholder={tr.namePlaceholder} value={name} onChange={e => setName(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">{tr.emailLabel}</label>
                    <input type="email" placeholder={tr.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
                  </div>
                </div>
              )}

              {/* Anonymous toggle */}
              <button onClick={() => setAnon(v => !v)} className="flex items-center gap-2 mb-4 text-sm text-foreground">
                <div className={`w-10 h-5 rounded-full transition-colors relative ${anon ? "bg-primary dark:bg-teal-600" : "bg-black/20 dark:bg-white/20"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${anon ? "start-5" : "start-0.5"}`} />
                </div>
                {tr.anonymous}
              </button>

              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 dark:from-teal-400 dark:to-emerald-500 text-white font-bold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />{tr.submitting}</> : <><Send className="w-4 h-4" />{tr.submit}</>}
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar({ lang, setLang, theme, setTheme, page, setPage, onDonate }: {
  lang: Lang; setLang: (l: Lang) => void; theme: Theme; setTheme: (t: Theme) => void;
  page: Page; setPage: (p: Page) => void; onDonate: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const tr = T[lang];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: tr.nav.home, page: "landing" as Page },
    { label: tr.nav.campaigns, page: "landing" as Page },
    { label: tr.nav.howItWorks, page: "landing" as Page },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? "backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 border-b border-black/10 dark:border-white/10 shadow-lg" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => setPage("landing")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">{tr.brand}</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => setPage(l.page)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${page === l.page ? "text-primary dark:text-teal-400" : "text-muted-foreground hover:text-foreground"}`}
              >{l.label}</button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:block">{lang === "ar" ? "EN" : "ع"}</span>
            </button>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <motion.button
              onClick={onDonate}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white text-sm font-bold hover:opacity-90 transition-opacity"
              whileTap={{ scale: 0.97 }}
            >
              <Heart className="w-3.5 h-3.5" />
              {tr.nav.donate}
            </motion.button>
            <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-black/10 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((l) => (
                <button key={l.label} onClick={() => { setPage(l.page); setMobileOpen(false); }} className="w-full text-start px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors">{l.label}</button>
              ))}
              <button onClick={() => { onDonate(); setMobileOpen(false); }} className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white text-sm font-bold">{tr.nav.donate}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────

function HeroSection({ lang, onDonate, onBrowse }: { lang: Lang; onDonate: () => void; onBrowse: () => void }) {
  const tr = T[lang].hero;
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-zinc-950 dark:via-zinc-900 dark:to-teal-950 bg-gradient-to-br from-teal-50 via-emerald-50 to-gray-100" />
        {[{ color: "#26A69A", x: "10%", y: "30%", size: 500 }, { color: "#EF5350", x: "70%", y: "60%", size: 450 }, { color: "#00897B", x: "40%", y: "5%", size: 380 }, { color: "#26A69A", x: "80%", y: "10%", size: 300 }].map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl dark:opacity-15 opacity-10"
            style={{ width: orb.size, height: orb.size, background: orb.color, left: orb.x, top: orb.y }}
            animate={{ x: [0, 80 - i * 20, -50 + i * 10, 0], y: [0, -60 + i * 15, 80 - i * 20, 0] }}
            transition={{ duration: 18 + i * 5, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
          />
        ))}
        <div className="absolute inset-0 dark:opacity-[0.03] opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(0,150,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,150,255,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border border-primary/30 dark:border-teal-400/30 bg-primary/5 dark:bg-cyan-400/5 text-primary dark:text-teal-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-cyan-400 animate-pulse" />
            {tr.badge}
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl lg:text-8xl font-black leading-tight mb-6"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="text-foreground">{tr.line1} </span>
          <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 dark:from-teal-400 dark:via-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">{tr.line2}</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        >{tr.sub}</motion.p>

        <motion.div
          className="flex flex-wrap gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={onDonate}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-700 dark:from-teal-400 dark:to-emerald-500 text-white font-bold text-lg shadow-lg shadow-teal-600/30 hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            <Heart className="w-5 h-5" />
            {tr.cta1}
          </motion.button>
          <motion.button
            onClick={onBrowse}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-white/10 border border-black/15 dark:border-white/20 text-foreground font-bold text-lg hover:bg-white/70 dark:hover:bg-white/15 transition-all"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            {tr.cta2}
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </motion.button>
        </motion.div>

        <motion.p className="text-sm text-muted-foreground flex items-center gap-2 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Shield className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          {tr.trust}
        </motion.p>
      </div>
    </section>
  );
}

// ─── STATS SECTION ────────────────────────────────────────────────────────────

function StatsSection({ lang }: { lang: Lang }) {
  const stats = T[lang].stats;
  const icons = [DollarSign, Target, Users, Globe];
  const colors = ["from-teal-600 to-emerald-700", "from-red-500 to-rose-600", "from-blue-500 to-indigo-600", "from-amber-500 to-orange-600"];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <GCard className="p-6 text-center hover:shadow-xl transition-shadow">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[i]} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-black text-foreground mb-1">{s.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                </GCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CAMPAIGNS SECTION ────────────────────────────────────────────────────────

function CampaignsSection({ lang, onDonate, onCampaign }: { lang: Lang; onDonate: (c: Campaign) => void; onCampaign: (c: Campaign) => void }) {
  const tr = T[lang];
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const catFilters = ["all", "education", "water", "health", "food", "shelter", "emergency"];
  const catLabels: Record<string, { ar: string; en: string }> = {
    all: { ar: "الكل", en: "All" }, education: { ar: "التعليم", en: "Education" },
    water: { ar: "المياه", en: "Water" }, health: { ar: "الصحة", en: "Health" },
    food: { ar: "الغذاء", en: "Food" }, shelter: { ar: "المأوى", en: "Shelter" },
    emergency: { ar: "الطوارئ", en: "Emergency" },
  };
  const filtered = campaigns.filter(c => {
    const matchCat = filter === "all" || c.category === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || (lang === "ar" ? c.titleAr + c.descAr : c.titleEn + c.descEn).toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-black text-foreground mb-3">{tr.sec.campaigns}</h2>
          <p className="text-muted-foreground">{tr.sec.campaignsSub}</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={tr.card.searchPlaceholder}
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full ps-11 pe-4 py-3 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary dark:focus:border-teal-400 focus:outline-none text-sm text-foreground placeholder:text-muted-foreground transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {catFilters.map(f => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${filter === f ? "bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-md" : "bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10"}`}
              whileTap={{ scale: 0.95 }}
            >{catLabels[f][lang]}</motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(0, 6).map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <CampaignCard c={c} lang={lang} onDonate={() => onDonate(c)} onDetails={() => onCampaign(c)} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <motion.button
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl border-2 border-primary/30 dark:border-teal-400/30 text-primary dark:text-teal-400 font-bold hover:bg-primary/5 dark:hover:bg-cyan-400/5 transition-colors"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            {tr.card.viewAll} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

// ─── CATEGORIES SECTION ───────────────────────────────────────────────────────

function CategoriesSection({ lang }: { lang: Lang }) {
  const tr = T[lang];
  const gradients = [
    "from-blue-500 to-indigo-600", "from-cyan-500 to-teal-600", "from-pink-500 to-rose-600",
    "from-amber-500 to-orange-600", "from-emerald-500 to-green-600", "from-red-500 to-orange-600",
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-black text-foreground mb-3">{tr.sec.categories}</h2>
          <p className="text-muted-foreground">{tr.sec.categoriesSub}</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {tr.cats.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <GCard className="p-6 text-center cursor-pointer hover:border-teal-400/30 transition-all group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  {getCatIcon(cat.icon, "w-7 h-7 text-white")}
                </div>
                <p className="font-bold text-sm text-foreground mb-1">{cat.label}</p>
                <p className="text-xs text-muted-foreground">{cat.count}</p>
              </GCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────

function HowItWorksSection({ lang }: { lang: Lang }) {
  const tr = T[lang];
  const stepIcons = [Target, DollarSign, Send, CheckCircle];
  const stepColors = ["from-teal-600 to-emerald-700", "from-purple-500 to-pink-600", "from-amber-500 to-orange-600", "from-emerald-500 to-teal-600"];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-800 dark:to-teal-950 bg-gradient-to-br from-white via-teal-50 to-white" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-black text-foreground mb-3">{tr.sec.howItWorks}</h2>
          <p className="text-muted-foreground">{tr.sec.howItWorksSub}</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tr.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="text-center relative">
                <div className="relative mb-5">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stepColors[i]} flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -start-2 w-7 h-7 rounded-full bg-foreground text-background text-xs font-black flex items-center justify-center">{i + 1}</div>
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

function TestimonialsSection({ lang }: { lang: Lang }) {
  const tr = T[lang];
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-black text-foreground mb-3">{tr.sec.testimonials}</h2>
          <p className="text-muted-foreground">{tr.sec.testimonialsSub}</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GCard className="p-5 h-full flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">"{lang === "ar" ? t.textAr : t.textEn}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={lang === "ar" ? t.nameAr : t.nameEn} className="w-10 h-10 rounded-full object-cover bg-blue-100" />
                  <div>
                    <p className="font-bold text-sm text-foreground">{lang === "ar" ? t.nameAr : t.nameEn}</p>
                    <p className="text-xs text-muted-foreground">{lang === "ar" ? t.countryAr : t.countryEn}</p>
                  </div>
                </div>
              </GCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ SECTION ──────────────────────────────────────────────────────────────

function FAQSection({ lang }: { lang: Lang }) {
  const tr = T[lang];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-black text-foreground mb-3">{tr.sec.faq}</h2>
          <p className="text-muted-foreground">{tr.sec.faqSub}</p>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <GCard className="overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-start gap-4"
                >
                  <span className="font-semibold text-foreground">{lang === "ar" ? f.questionAr : f.questionEn}</span>
                  {open === i ? <ChevronUp className="w-5 h-5 text-primary dark:text-teal-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-black/5 dark:border-white/5 pt-3">{lang === "ar" ? f.answerAr : f.answerEn}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function FooterSection({ lang, setPage, onDonate }: { lang: Lang; setPage: (p: Page) => void; onDonate: () => void }) {
  const tr = T[lang].footer;
  const tBrand = T[lang].brand;
  const year = new Date().getFullYear();

  return (
    <footer className="relative pt-16 pb-8 border-t border-black/10 dark:border-white/10">
      <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-slate-950 dark:to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center"><Heart className="w-4 h-4 text-white" /></div>
              <span className="font-black text-xl bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">{tBrand}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">{tr.tagline}</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 w-fit">
              <Shield className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className="text-xs font-mono text-muted-foreground">USDT · TRC20 · TRON</span>
            </div>
          </div>
          <div>
            <p className="font-bold text-sm text-foreground mb-4">{tr.links}</p>
            <div className="space-y-2">
              {[T[lang].nav.home, T[lang].nav.campaigns, T[lang].nav.howItWorks, T[lang].nav.dashboard].map((l) => (
                <button key={l} className="block text-sm text-muted-foreground hover:text-primary dark:hover:text-teal-400 transition-colors">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold text-sm text-foreground mb-4">{tr.contact}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="w-4 h-4" /><span>support@noorataa.org</span></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4" /><span>Dubai, UAE</span></div>
            </div>
            <motion.button
              onClick={onDonate}
              className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white text-sm font-bold hover:opacity-90 transition-opacity"
              whileTap={{ scale: 0.97 }}
            ><Heart className="w-4 h-4" />{T[lang].nav.donate}</motion.button>
          </div>
        </div>
        <div className="border-t border-black/10 dark:border-white/10 pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {year} {tBrand}. {tr.rights}</p>
          <div className="flex gap-4">
            <button className="hover:text-foreground transition-colors">{tr.privacy}</button>
            <button className="hover:text-foreground transition-colors">{tr.terms}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

function LandingPage({ lang, onDonate, onCampaign, setPage }: { lang: Lang; onDonate: (c?: Campaign) => void; onCampaign: (c: Campaign) => void; setPage: (p: Page) => void }) {
  const campRef = useRef<HTMLDivElement>(null);
  const scrollToCampaigns = () => campRef.current?.scrollIntoView({ behavior: "smooth" });
  return (
    <div>
      <HeroSection lang={lang} onDonate={() => onDonate()} onBrowse={scrollToCampaigns} />
      <StatsSection lang={lang} />
      <div ref={campRef}><CampaignsSection lang={lang} onDonate={onDonate} onCampaign={onCampaign} /></div>
      <CategoriesSection lang={lang} />
      <HowItWorksSection lang={lang} />
      <TestimonialsSection lang={lang} />
      <FAQSection lang={lang} />
      <FooterSection lang={lang} setPage={setPage} onDonate={() => onDonate()} />
    </div>
  );
}

// ─── CAMPAIGN DETAILS PAGE ────────────────────────────────────────────────────

function CampaignDetailsPage({ lang, campaign, onDonate, onBack }: { lang: Lang; campaign: Campaign; onDonate: () => void; onBack: () => void }) {
  const tr = T[lang].campaign;
  const progress = pct(campaign.raised, campaign.goal);
  const [activeTab, setActiveTab] = useState<"story" | "updates" | "donors">("story");

  const updates = [
    { date: "2024-12-10", titleAr: "تم استلام الشحنة الأولى", titleEn: "First Shipment Received", descAr: "تم استلام الشحنة الأولى من المعدات والمستلزمات بفضل تبرعاتكم الكريمة.", descEn: "The first shipment of equipment and supplies has been received thanks to your generous donations." },
    { date: "2024-11-20", titleAr: "بدء العمل على الأرض", titleEn: "Ground Work Begins", descAr: "بدأ فريقنا العمل الميداني وتم توزيع المساعدات على ٢٠٠ أسرة.", descEn: "Our team has started field work and distributed aid to 200 families." },
    { date: "2024-11-05", titleAr: "انطلاق الحملة رسمياً", titleEn: "Campaign Officially Launched", descAr: "انطلقت الحملة رسمياً بهدف جمع ٢٥٪ من الهدف الكلي خلال الأسبوع الأول.", descEn: "Campaign officially launched with the goal of raising 25% of the total target in the first week." },
  ];

  const recentDonors = [
    { nameAr: "محمد العلي", nameEn: "Mohammed Al-Ali", amount: 500, date: "منذ ٣ ساعات", dateEn: "3 hours ago", anon: false },
    { nameAr: "متبرع مجهول", nameEn: "Anonymous", amount: 1000, date: "منذ ٥ ساعات", dateEn: "5 hours ago", anon: true },
    { nameAr: "سارة جونسون", nameEn: "Sarah Johnson", amount: 250, date: "منذ يوم", dateEn: "1 day ago", anon: false },
    { nameAr: "خالد المنصور", nameEn: "Khalid Al-Mansour", amount: 2500, date: "منذ يومين", dateEn: "2 days ago", anon: false },
    { nameAr: "متبرع مجهول", nameEn: "Anonymous", amount: 100, date: "منذ ٣ أيام", dateEn: "3 days ago", anon: true },
    { nameAr: "عائشة إبراهيم", nameEn: "Aisha Ibrahim", amount: 750, date: "منذ ٤ أيام", dateEn: "4 days ago", anon: false },
  ];

  const related = campaigns.filter(c => c.category === campaign.category && c.id !== campaign.id).slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-16">
      {/* Banner */}
      <div className="relative h-72 sm:h-96 overflow-hidden bg-blue-950">
        <img src={campaign.image} alt={lang === "ar" ? campaign.titleAr : campaign.titleEn} className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          <button onClick={onBack} className="absolute top-6 start-6 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm hover:bg-white/30 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180 rtl:rotate-0" />
            {lang === "ar" ? "رجوع" : "Back"}
          </button>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary/80 text-white w-fit mb-3">{lang === "ar" ? campaign.categoryAr : campaign.categoryEn}</span>
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2">{lang === "ar" ? campaign.titleAr : campaign.titleEn}</h1>
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <MapPin className="w-4 h-4" />{lang === "ar" ? campaign.locationAr : campaign.locationEn}
            <span>·</span>
            <Users className="w-4 h-4" />{campaign.donors.toLocaleString()} {tr.donors}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 w-fit">
              {(["story", "updates", "donors"] as const).map(tab => {
                const labels = { story: { ar: tr.story, en: tr.story }, updates: { ar: tr.updates, en: tr.updates }, donors: { ar: tr.recentDonors, en: tr.recentDonors } };
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? "bg-white dark:bg-white/10 text-primary dark:text-teal-400 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{labels[tab][lang]}</button>
                );
              })}
            </div>

            {activeTab === "story" && (
              <GCard className="p-6">
                <h3 className="font-bold text-lg text-foreground mb-4">{tr.about}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{lang === "ar" ? campaign.storyAr : campaign.storyEn}</p>
              </GCard>
            )}
            {activeTab === "updates" && (
              <div className="space-y-4">
                {updates.map((u, i) => (
                  <GCard key={i} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-cyan-400/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Activity className="w-4 h-4 text-primary dark:text-teal-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-foreground">{lang === "ar" ? u.titleAr : u.titleEn}</span>
                          <span className="text-xs text-muted-foreground">{u.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{lang === "ar" ? u.descAr : u.descEn}</p>
                      </div>
                    </div>
                  </GCard>
                ))}
              </div>
            )}
            {activeTab === "donors" && (
              <GCard className="p-5">
                <h3 className="font-bold text-foreground mb-4">{tr.recentDonors}</h3>
                <div className="space-y-3">
                  {recentDonors.map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                          {d.anon ? <User className="w-4 h-4 text-muted-foreground" /> : <span className="text-sm font-bold text-primary dark:text-teal-400">{(lang === "ar" ? d.nameAr : d.nameEn)[0]}</span>}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{d.anon ? tr.anonymous : (lang === "ar" ? d.nameAr : d.nameEn)}</p>
                          <p className="text-xs text-muted-foreground">{lang === "ar" ? d.date : d.dateEn}</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-primary dark:text-teal-400">{fmtUSDT(d.amount)}</span>
                    </div>
                  ))}
                </div>
              </GCard>
            )}

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h3 className="font-bold text-foreground mb-4">{tr.related}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map(c => (
                    <div key={c.id} className="rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                      <img src={c.image} alt="" className="w-full h-24 object-cover" />
                      <div className="p-3">
                        <p className="text-xs font-semibold text-foreground line-clamp-2">{lang === "ar" ? c.titleAr : c.titleEn}</p>
                        <ProgressBar value={pct(c.raised, c.goal)} className="mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky donation widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <GCard className="p-5">
                <h3 className="font-bold text-foreground mb-4">{tr.donateWidget}</h3>
                <div className="space-y-3 mb-5">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{tr.raised}</span>
                      <span className="font-bold text-primary dark:text-teal-400">{fmtUSDT(campaign.raised)}</span>
                    </div>
                    <ProgressBar value={progress} />
                    <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                      <span>{progress}%</span>
                      <span>{tr.goal}: {fmtUSDT(campaign.goal)}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-center">
                    <p className="font-bold text-foreground">{campaign.donors.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{tr.donors}</p>
                  </div>
                </div>
                <motion.button
                  onClick={onDonate}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.97 }}
                >
                  <Heart className="w-4 h-4" />{tr.donate}
                </motion.button>
                <button className="w-full mt-2 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />{tr.share}
                </button>
              </GCard>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── USER DASHBOARD ───────────────────────────────────────────────────────────

function UserDashboardPage({ lang, onDonate }: { lang: Lang; onDonate: () => void }) {
  const tr = T[lang].dash;
  const [tab, setTab] = useState<"history" | "favorites" | "receipts" | "settings">("history");

  const totalDon = donHistory.filter(d => d.status === "confirmed").reduce((s, d) => s + d.amount, 0);

  const tabs = [
    { key: "history", label: tr.tabs.history, icon: Clock },
    { key: "favorites", label: tr.tabs.favorites, icon: Heart },
    { key: "receipts", label: tr.tabs.receipts, icon: FileText },
    { key: "settings", label: tr.tabs.settings, icon: Settings },
  ] as const;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-muted-foreground text-sm">{tr.welcome}</p>
          <h1 className="text-3xl font-black text-foreground">{lang === "ar" ? "أحمد المحمد" : "Ahmed Al-Mohammed"}</h1>
        </div>

        {/* Profile stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: tr.totalDonated, value: `$${totalDon.toLocaleString()}`, icon: DollarSign, color: "from-teal-600 to-emerald-700" },
            { label: tr.campaigns, value: donHistory.length.toString(), icon: Target, color: "from-purple-500 to-pink-600" },
            { label: tr.impact, value: "2,400+", icon: Users, color: "from-emerald-500 to-teal-600" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <GCard key={i} className="p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-xl text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </GCard>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 mb-6 w-fit flex-wrap">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === key ? "bg-white dark:bg-white/10 text-primary dark:text-teal-400 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "history" && (
          <GCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-black/10 dark:border-white/10">
                  {[tr.table.campaign, tr.table.amount, tr.table.date, tr.table.status, tr.table.action].map(h => (
                    <th key={h} className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {donHistory.map((d, i) => (
                    <tr key={d.id} className={`border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/2 dark:hover:bg-white/2 transition-colors ${i % 2 === 0 ? "" : "bg-black/[0.01] dark:bg-white/[0.01]"}`}>
                      <td className="px-4 py-3 font-medium text-foreground">{lang === "ar" ? d.campaignTitleAr : d.campaignTitleEn}</td>
                      <td className="px-4 py-3 font-bold text-primary dark:text-teal-400">{fmtUSDT(d.amount)}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{d.date}</td>
                      <td className="px-4 py-3"><StatusBadge status={d.status} lang={lang} /></td>
                      <td className="px-4 py-3">
                        {d.status === "confirmed" && (
                          <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary dark:hover:text-teal-400 transition-colors">
                            <Download className="w-3.5 h-3.5" />{tr.download}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GCard>
        )}

        {tab === "favorites" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.filter(c => favCampaigns.includes(c.id)).map(c => (
              <div key={c.id} className="rounded-2xl overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <img src={c.image} alt="" className="w-full h-36 object-cover" />
                <div className="p-4">
                  <p className="font-bold text-sm text-foreground mb-2 line-clamp-2">{lang === "ar" ? c.titleAr : c.titleEn}</p>
                  <ProgressBar value={pct(c.raised, c.goal)} className="mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mb-3">
                    <span className="font-semibold text-primary dark:text-teal-400">{fmtUSDT(c.raised)}</span>
                    <span>{pct(c.raised, c.goal)}%</span>
                  </div>
                  <button onClick={onDonate} className="w-full py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white text-xs font-bold hover:opacity-90 transition-opacity">{T[lang].card.donate}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "receipts" && (
          <GCard className="p-5">
            <div className="space-y-3">
              {donHistory.filter(d => d.status === "confirmed").map(d => (
                <div key={d.id} className="flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-400/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{lang === "ar" ? d.campaignTitleAr : d.campaignTitleEn}</p>
                      <p className="text-xs text-muted-foreground font-mono">{d.txid.slice(0, 20)}...</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-primary dark:text-teal-400">{fmtUSDT(d.amount)}</p>
                    <button className="text-xs text-muted-foreground hover:text-primary dark:hover:text-teal-400 flex items-center gap-1 mt-1 transition-colors">
                      <Download className="w-3 h-3" />{tr.download}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GCard>
        )}

        {tab === "settings" && (
          <GCard className="p-6 max-w-lg">
            <h3 className="font-bold text-foreground mb-5">{tr.settTitle}</h3>
            <div className="space-y-4">
              {[
                { label: lang === "ar" ? "الاسم الكامل" : "Full Name", placeholder: lang === "ar" ? "أحمد المحمد" : "Ahmed Al-Mohammed", type: "text" },
                { label: lang === "ar" ? "البريد الإلكتروني" : "Email", placeholder: "ahmed@email.com", type: "email" },
                { label: lang === "ar" ? "رقم الهاتف" : "Phone Number", placeholder: "+971 50 000 0000", type: "tel" },
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-sm font-semibold text-foreground mb-1">{f.label}</label>
                  <input type={f.type} defaultValue={f.placeholder} className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary dark:focus:border-teal-400 focus:outline-none text-sm text-foreground transition-colors" />
                </div>
              ))}
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5">
                <div>
                  <p className="font-semibold text-sm text-foreground">{lang === "ar" ? "إشعارات البريد الإلكتروني" : "Email Notifications"}</p>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? "تلقي تأكيدات التبرع" : "Receive donation confirmations"}</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-primary dark:bg-teal-500 relative cursor-pointer">
                  <div className="absolute top-0.5 start-5 w-4 h-4 rounded-full bg-white shadow" />
                </div>
              </div>
              <motion.button className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-bold hover:opacity-90 transition-opacity" whileTap={{ scale: 0.97 }}>
                {lang === "ar" ? "حفظ التغييرات" : "Save Changes"}
              </motion.button>
            </div>
          </GCard>
        )}
      </div>
    </motion.div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-3 shadow-2xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-teal-400 font-bold text-sm">${payload[0].value.toLocaleString()} USDT</p>
      </div>
    );
  }
  return null;
};

function AdminDashboardPage({ lang }: { lang: Lang }) {
  const tr = T[lang].admin;
  const [tab, setTab] = useState<"overview" | "campaigns" | "donations" | "users">("overview");

  const kpiIcons = [DollarSign, Clock, Target, Users];
  const kpiColors = ["from-teal-600 to-emerald-700", "from-amber-500 to-orange-600", "from-purple-500 to-pink-600", "from-emerald-500 to-teal-600"];

  const tabs = [
    { key: "overview", label: tr.tabs.overview }, { key: "campaigns", label: tr.tabs.campaigns },
    { key: "donations", label: tr.tabs.donations }, { key: "users", label: tr.tabs.users },
  ] as const;

  const chartData = revenueData.map(d => ({ name: lang === "ar" ? d.month : d.monthEn, revenue: d.revenue }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-black text-foreground">{tr.title}</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <Download className="w-4 h-4" />{tr.exportCSV}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <Download className="w-4 h-4" />{tr.exportPDF}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white text-sm font-bold hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />{tr.add}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tr.kpis.map((kpi, i) => {
            const Icon = kpiIcons[i];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <GCard className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpiColors[i]} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-0.5 rounded-full">{kpi.change}</span>
                  </div>
                  <p className="text-2xl font-black text-foreground mb-1">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </GCard>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 mb-6 w-fit flex-wrap">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === key ? "bg-white dark:bg-white/10 text-primary dark:text-teal-400 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{label}</button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GCard className="lg:col-span-2 p-5">
              <h3 className="font-bold text-foreground mb-4">{tr.revenueChart}</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#26A69A" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#26A69A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#26A69A" strokeWidth={2.5} fill="url(#revenueAreaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </GCard>

            <GCard className="p-5">
              <h3 className="font-bold text-foreground mb-4">{tr.categoryChart}</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryPie} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {categoryPie.map((entry, i) => <Cell key={`pie-cell-${i}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryPie.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                      <span className="text-muted-foreground">{lang === "ar" ? c.nameAr : c.nameEn}</span>
                    </div>
                    <span className="font-bold text-foreground">{c.value}%</span>
                  </div>
                ))}
              </div>
            </GCard>
          </div>
        )}

        {tab === "donations" && (
          <GCard className="overflow-hidden">
            <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-foreground">{tr.tabs.donations}</h3>
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input placeholder={lang === "ar" ? "البحث..." : "Search..."} className="ps-9 pe-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm focus:outline-none focus:border-primary dark:focus:border-teal-400 w-48 text-foreground" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-black/10 dark:border-white/10">
                  {[tr.table.donor, tr.table.amount, tr.table.campaign, tr.table.date, tr.table.status, tr.table.action].map(h => (
                    <th key={h} className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {pendingDons.map((d, i) => (
                    <tr key={d.id} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{lang === "ar" ? d.donor : d.donorEn}</td>
                      <td className="px-4 py-3 font-bold text-primary dark:text-teal-400 whitespace-nowrap">{fmtUSDT(d.amount)}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-40 truncate">{lang === "ar" ? d.campaignAr : d.campaignEn}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{d.date}</td>
                      <td className="px-4 py-3"><StatusBadge status={d.status as DonStatus} lang={lang} /></td>
                      <td className="px-4 py-3">
                        {d.status === "pending" && (
                          <div className="flex gap-2">
                            <button className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:opacity-80 transition-opacity whitespace-nowrap">{tr.approve}</button>
                            <button className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-400/10 text-red-700 dark:text-red-400 text-xs font-bold hover:opacity-80 transition-opacity whitespace-nowrap">{tr.reject}</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GCard>
        )}

        {tab === "campaigns" && (
          <GCard className="overflow-hidden">
            <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-foreground">{tr.tabs.campaigns}</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white text-xs font-bold hover:opacity-90 transition-opacity">
                <Plus className="w-3.5 h-3.5" />{tr.add}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-black/10 dark:border-white/10">
                  {[tr.table.title, tr.table.org, tr.table.progress, tr.table.status, tr.table.action].map(h => (
                    <th key={h} className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {campaigns.slice(0, 8).map((c) => (
                    <tr key={c.id} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={c.image} alt="" className="w-9 h-9 rounded-lg object-cover bg-blue-100" />
                          <span className="font-medium text-foreground text-xs max-w-32 line-clamp-2">{lang === "ar" ? c.titleAr : c.titleEn}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{lang === "ar" ? c.locationAr : c.locationEn}</td>
                      <td className="px-4 py-3 w-36">
                        <ProgressBar value={pct(c.raised, c.goal)} />
                        <p className="text-xs text-muted-foreground mt-1">{fmtUSDT(c.raised)} / {fmtUSDT(c.goal)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.urgent ? "bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400"}`}>
                          {c.urgent ? (lang === "ar" ? "عاجل" : "Urgent") : (lang === "ar" ? "نشطة" : "Active")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground hover:text-blue-500"><Edit className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GCard>
        )}

        {tab === "users" && (
          <GCard className="overflow-hidden">
            <div className="p-4 border-b border-black/10 dark:border-white/10">
              <h3 className="font-bold text-foreground">{tr.tabs.users}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-black/10 dark:border-white/10">
                  {[tr.table.name, tr.table.email, tr.table.joined, tr.table.donations, tr.table.action].map(h => (
                    <th key={h} className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {adminUsers.map((u) => (
                    <tr key={u.id} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center text-sm font-bold text-primary dark:text-teal-400">
                            {(lang === "ar" ? u.nameAr : u.nameEn)[0]}
                          </div>
                          <span className="font-medium text-foreground">{lang === "ar" ? u.nameAr : u.nameEn}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{u.joined}</td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-bold text-foreground">{u.donations}</span>
                          <span className="text-muted-foreground text-xs ms-1">({fmtUSDT(u.total)})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GCard>
        )}
      </div>
    </motion.div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang] = useState<Lang>("ar");
  const [page, setPage] = useState<Page>("landing");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>(campaigns[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCampaign, setModalCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [theme, lang]);

  const openDonate = (c?: Campaign) => {
    setModalCampaign(c || null);
    setModalOpen(true);
  };

  const openCampaign = (c: Campaign) => {
    setSelectedCampaign(c);
    setPage("campaign");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateTo = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fontFamily = lang === "ar"
    ? "'Cairo', 'Plus Jakarta Sans', system-ui, sans-serif"
    : "'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif";

  return (
    <div
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
      style={{ fontFamily }}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <Navbar
        lang={lang} setLang={setLang}
        theme={theme} setTheme={t => setTheme(t as Theme)}
        page={page} setPage={navigateTo}
        onDonate={() => openDonate()}
      />

      <AnimatePresence mode="wait">
        {page === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <LandingPage lang={lang} onDonate={openDonate} onCampaign={openCampaign} setPage={navigateTo} />
          </motion.div>
        )}
        {page === "campaign" && (
          <motion.div key="campaign" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <CampaignDetailsPage lang={lang} campaign={selectedCampaign} onDonate={() => openDonate(selectedCampaign)} onBack={() => navigateTo("landing")} />
          </motion.div>
        )}
        {page === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <UserDashboardPage lang={lang} onDonate={() => openDonate()} />
          </motion.div>
        )}
        {page === "admin" && (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <AdminDashboardPage lang={lang} />
          </motion.div>
        )}
      </AnimatePresence>

      {modalOpen && (
        <DonationModal
          lang={lang}
          campaign={modalCampaign}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
