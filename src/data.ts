import { Camera, Flame, Server, PhoneCall, Fingerprint, LayoutDashboard } from 'lucide-react';
import React from 'react';

export const defaultCategoriesData = [
  {
    id: 'surveillance',
    title: "Surveillance Solution",
    iconName: "Camera",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    desc: "Comprehensive video monitoring and recording solutions for maximum security.",
    items: [
      { name: "IR Camera (Night Vision)", desc: "High-definition infrared cameras for zero-light surveillance." },
      { name: "Box Camera", desc: "Professional CCTV box cameras for custom lens applications." },
      { name: "Dome Camera / IR Dome", desc: "Discreet indoor/outdoor dome cameras with IR capabilities." },
      { name: "Outdoor PTZ Camera", desc: "Pan-tilt-zoom cameras designed for harsh outdoor environments." },
      { name: "Outdoor Fixed Camera", desc: "Weatherproof fixed-angle cameras for perimeter security." },
      { name: "IP Camera (TCP/IP Based)", desc: "High-resolution digital network cameras." },
      { name: "PTZ Camera (RS232/485 or IP)", desc: "Controllable PTZ systems with serial or IP networking." },
      { name: "DVR (Digital Video Recorder)", desc: "Analog and HD-TVI video recording systems." },
      { name: "NVR (Network Video Recorder)", desc: "IP camera recording systems with high storage capacity." },
      { name: "Standalone DVR", desc: "Compact, all-in-one recording units." },
      { name: "Car DVR", desc: "Mobile surveillance recording for fleet and vehicle security." }
    ]
  },
  {
    id: 'fire-detection',
    title: "Fire Detection & Protection",
    iconName: "Flame",
    image: "https://images.unsplash.com/photo-1604164448130-d1df213c64eb?w=800&q=80",
    desc: "Advanced early-warning fire detection and emergency protection systems.",
    items: [
      { name: "Smoke Detector (Standalone/Addressable)", desc: "Photoelectric sensors for early smoke detection." },
      { name: "Heat Detector", desc: "Rate-of-rise and fixed temperature detection units." },
      { name: "Gas Detector", desc: "Sensors for identifying dangerous gas leaks." },
      { name: "Fire Alarm Control Panel", desc: "Centralized monitoring panels for conventional and addressable systems." },
      { name: "Fire Extinguishers", desc: "CO2, ABC, and Foam extinguishers for various fire classes." }
    ]
  },
  {
    id: 'network',
    title: "Enterprise Network Solution",
    iconName: "Server",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    desc: "Robust IT infrastructure and networking for seamless data communication.",
    items: [
      { name: "LAN (Local Area Network)", desc: "Complete internal network design and implementation." },
      { name: "Network Switch", desc: "Managed and unmanaged PoE/Non-PoE switches." },
      { name: "Router", desc: "Enterprise-grade routers for stable internet connectivity." },
      { name: "Access Point", desc: "High-frequency indoor and outdoor Wi-Fi nodes." },
      { name: "Server Rack", desc: "Secure racks and cabinets for IT hardware." }
    ]
  },
  {
    id: 'pabx',
    title: "PABX System",
    iconName: "PhoneCall",
    image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&q=80",
    desc: "Professional telecommunication systems for internal and external routing.",
    items: [
      { name: "Analog PABX", desc: "Traditional multi-line telephone exchanges." },
      { name: "IP PABX", desc: "Modern VoIP-based internal communication servers." },
      { name: "Digital Telephone Set", desc: "Feature-rich desk phones for executives and reception." }
    ]
  },
  {
    id: 'access-control',
    title: "Access & Attendance Control",
    iconName: "Fingerprint",
    image: "https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=800&q=80",
    desc: "Biometric and RFID solutions for personnel tracking and door security.",
    items: [
      { name: "Time Attendance System", desc: "Biometric devices for tracking employee working hours." },
      { name: "Access Control System", desc: "Secure door entry management via Face, Fingerprint, or Card." },
      { name: "Magnetic Door Lock", desc: "High-holding-force EM locks for glass, wood, and metal doors." }
    ]
  },
  {
    id: 'parking-management',
    title: "Parking Lot Management System",
    iconName: "LayoutDashboard",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80",
    desc: "Complete end-to-end software and hardware for paid/private parking.",
    items: [
      { name: "Slot Detection System", desc: "Ultrasonic sensors indicating empty spaces via red/green LED." },
      { name: "Entry/Exit Tracking", desc: "Ticket dispensers and license plate capture." },
      { name: "Automated Billing", desc: "Integrated payment kiosks and time-based fee calculation." }
    ]
  }
];

export const businessServices = [
  { title: "Surveillance Solution", desc: "End-to-end security monitoring.", iconName: "Camera" },
  { title: "Enterprise Network Solution", desc: "Reliable IT & Cloud infrastructure.", iconName: "Server" },
  { title: "PABX System", desc: "Professional telecom routing.", iconName: "PhoneCall" },
  { title: "Access & Attendance Control", desc: "Biometric & RFID tracking.", iconName: "Fingerprint" },
  { title: "Fire Detection & Protection", desc: "Early-warning safety systems.", iconName: "Flame" },
  { title: "Parking Management System", desc: "Automated lots & barriers.", iconName: "Car" },
];

export const workSteps = [
  { title: "Consultation & Site Survey", desc: "Understanding requirements and analyzing premises.", iconName: "MapPin" },
  { title: "System Design & Planning", desc: "Drafting the optimal technical architecture.", iconName: "PenTool" },
  { title: "Installation & Setup", desc: "Professional deployment by expert engineers.", iconName: "Wrench" },
  { title: "Testing & Handover", desc: "Rigorous quality checks and client training.", iconName: "CheckCircle2" },
  { title: "Maintenance & 24/7 Support", desc: "Ongoing SLA and instant technical assistance.", iconName: "HeadphonesIcon" },
];

export const commitmentList = [
  { title: "100% Customer Satisfaction", iconName: "ThumbsUp" },
  { title: "Instant Problem Solving", iconName: "Zap" },
  { title: "Customer-First Approach", iconName: "HeartHandshake" },
  { title: "High-Quality Service Guarantee", iconName: "ShieldCheck" },
];

export const infraList = [
  "2000 sq ft Central Office Space",
  "High-Speed Internet & Enterprise Networking",
  "Continuous Backup Power System",
  "Dedicated Video Conferencing Facility",
  "Highly Skilled Technical Team",
  "24/7 Operational Control & Support"
];

export const teamDepts = [
  { name: "Management", iconName: "Briefcase" },
  { name: "Sales & Marketing", iconName: "BarChart" },
  { name: "HR & Administration", iconName: "Users" },
  { name: "Finance & Accounts", iconName: "FileText" },
  { name: "Research & Development", iconName: "Lightbulb" },
  { name: "Service & Technical Support", iconName: "Settings" },
];

export const clients = [
  { name: "RA Global Solutions", works: "Glass Door, Access Control, EM Lock", logo: "https://ui-avatars.com/api/?name=RA&background=F5B800&color=1F2933&bold=true&font-size=0.4" },
  { name: "Travel Buddy Ltd", works: "CCTV, Access Control, Door Closer", logo: "https://ui-avatars.com/api/?name=TB&background=F5B800&color=1F2933&bold=true&font-size=0.4" },
  { name: "Delight Homes Ltd", works: "CCTV Surveillance, Intercom", logo: "https://ui-avatars.com/api/?name=DH&background=F5B800&color=1F2933&bold=true&font-size=0.4" },
  { name: "Asia Group", works: "CCTV Surveillance System", logo: "https://ui-avatars.com/api/?name=AG&background=F5B800&color=1F2933&bold=true&font-size=0.4" },
  { name: "Acumen Engineering", works: "CCTV Surveillance System", logo: "https://ui-avatars.com/api/?name=AE&background=F5B800&color=1F2933&bold=true&font-size=0.4" },
  { name: "Unimark Group", works: "CCTV, Access Control", logo: "https://ui-avatars.com/api/?name=UG&background=F5B800&color=1F2933&bold=true&font-size=0.4" },
  { name: "Orbit Consultant", works: "CCTV, Fire Detection System", logo: "https://ui-avatars.com/api/?name=OC&background=F5B800&color=1F2933&bold=true&font-size=0.4" },
  { name: "Veritas Pharma", works: "CCTV, Access Control", logo: "https://ui-avatars.com/api/?name=VP&background=F5B800&color=1F2933&bold=true&font-size=0.4" },
];
