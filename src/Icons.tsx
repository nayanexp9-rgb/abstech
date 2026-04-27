import { 
  ShieldCheck, Camera, Server, Fingerprint, Flame, PhoneCall, ChevronRight, Menu, X,
  MapPin, Mail, Phone, CheckCircle2, Globe, Plane, Home, Building2, Wrench, Package,
  MessageCircle, LayoutDashboard, Car, Monitor, ArrowLeft, Zap, HardDrive, DoorOpen, 
  Users, Layers, Volume2, Video, ShoppingBag, Lock, Scan, ArrowRightLeft, MoveHorizontal,
  CircleDot, Search, PenTool, HeadphonesIcon, ThumbsUp, HeartHandshake, Briefcase, 
  BarChart, FileText, Lightbulb, Settings, Award, Edit3, Save, LogOut, Image as ImageIcon,
  LockKeyhole
} from 'lucide-react';
import React from 'react';

export const iconsMap: Record<string, React.FC<any>> = {
  ShieldCheck, Camera, Server, Fingerprint, Flame, PhoneCall, ChevronRight, Menu, X,
  MapPin, Mail, Phone, CheckCircle2, Globe, Plane, Home, Building2, Wrench, Package,
  MessageCircle, LayoutDashboard, Car, Monitor, ArrowLeft, Zap, HardDrive, DoorOpen, 
  Users, Layers, Volume2, Video, ShoppingBag, Lock, Scan, ArrowRightLeft, MoveHorizontal,
  CircleDot, Search, PenTool, HeadphonesIcon, ThumbsUp, HeartHandshake, Briefcase, 
  BarChart, FileText, Lightbulb, Settings, Award, Edit3, Save, LogOut, ImageIcon,
  LockKeyhole
};

export const Icon = ({ name, ...props }: { name: string, [key: string]: any }) => {
  const IconComponent = iconsMap[name] || ShieldCheck;
  return <IconComponent {...props} />;
};
