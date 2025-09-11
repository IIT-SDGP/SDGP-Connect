
// © 2025 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { TbBrandCSharp } from "react-icons/tb";

import {
  Banknote,
  BarChart3,
  BookOpen,
  Brain,
  Clapperboard,
  Cpu,
  Gamepad2,
  HeartPulse,
  Leaf,
  MonitorSmartphone,
  SatelliteDish,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Users,
} from "lucide-react";
import { DiJava, DiReact } from "react-icons/di";
import { FaAws, FaDesktop, FaFacebook, FaGlobe, FaInstagram, FaLinkedin, FaMobileAlt, FaPuzzlePiece, FaTiktok, FaTools, FaTwitter, FaYoutube } from "react-icons/fa";
import {
  SiAndroid,
  SiAngular,
  SiArduino,
  SiDjango,
  SiDotnet,
  SiFirebase,
  SiFlask,
  SiFlutter,
  SiIos,
  SiLaravel,
  SiMongodb, SiMysql,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiRaspberrypi,
  SiReact,
  SiSpring,
  SiTensorflow,
  SiVuedotjs,
  SiSvelte,
  SiKotlin,
  SiSwift,
  SiRuby,
  SiJavascript,
  SiTypescript,
  SiCplusplus,
  SiC
} from "react-icons/si";
import { ProjectStatusEnum, ProjectTypeEnum, SDGGoalEnum, TechStackEnum } from "@/types/prisma-types";

export const projectTypeOptions = [
  { value: ProjectTypeEnum.MOBILE, label: "Mobile App", icon: FaMobileAlt },
  { value: ProjectTypeEnum.WEB, label: "Web Application", icon: FaGlobe },
  { value: ProjectTypeEnum.HARDWARE, label: "Hardware", icon: FaTools },
  { value: ProjectTypeEnum.DESKTOP, label: "Desktop Software", icon: FaDesktop },
  { value: ProjectTypeEnum.WEARABLE, label: "Wearable App", icon: FaMobileAlt },
  { value: ProjectTypeEnum.EXTENSION, label: "Web Extension", icon: FaPuzzlePiece },
];

export const sdgGoals = [
    {
      id: 1,
      name: SDGGoalEnum.NO_POVERTY,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg",
      description: "End poverty in all its forms everywhere"
    },
    {
      id: 2,
      name: SDGGoalEnum.ZERO_HUNGER,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg",
      description: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture"
    },
    {
      id: 3,
      name: SDGGoalEnum.GOOD_HEALTH,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-03.jpg",
      description: "Ensure healthy lives and promote well-being for all at all ages"
    },
    {
      id: 4,
      name: SDGGoalEnum.QUALITY_EDUCATION,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-04.jpg",
      description: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all"
    },
    {
      id: 5,
      name: SDGGoalEnum.GENDER_EQUALITY,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-05.jpg",
      description: "Achieve gender equality and empower all women and girls"
    },
    {
      id: 6,
      name: SDGGoalEnum.CLEAN_WATER,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg",
      description: "Ensure availability and sustainable management of water and sanitation for all"
    },
    {
      id: 7,
      name: SDGGoalEnum.AFFORDABLE_ENERGY,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg",
      description: "Ensure access to affordable, reliable, sustainable and modern energy for all"
    },
    {
      id: 8,
      name: SDGGoalEnum.DECENT_WORK,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg",
      description: "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all"
    },
    {
      id: 9,
      name: SDGGoalEnum.INDUSTRY_INNOVATION,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg",
      description: "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation"
    },
    {
      id: 10,
      name: SDGGoalEnum.REDUCED_INEQUALITIES,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-10.jpg",
      description: "Reduce inequality within and among countries"
    },
    {
      id: 11,
      name: SDGGoalEnum.SUSTAINABLE_CITIES,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg",
      description: "Make cities and human settlements inclusive, safe, resilient and sustainable"
    },
    {
      id: 12,
      name: SDGGoalEnum.RESPONSIBLE_CONSUMPTION,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg",
      description: "Ensure sustainable consumption and production patterns"
    },
    {
      id: 13,
      name: SDGGoalEnum.CLIMATE_ACTION,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg",
      description: "Take urgent action to combat climate change and its impacts"
    },
    {
      id: 14,
      name: SDGGoalEnum.LIFE_BELOW_WATER,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-14.jpg",
      description: "Conserve and sustainably use the oceans, seas and marine resources for sustainable development"
    },
    {
      id: 15,
      name: SDGGoalEnum.LIFE_ON_LAND,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg",
      description: "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss"
    },
    {
      id: 16,
      name: SDGGoalEnum.PEACE_JUSTICE,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-16.jpg",
      description: "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels"
    },
    {
      id: 17,
      name: SDGGoalEnum.PARTNERSHIPS,
      icon: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-17.jpg",
      description: "Strengthen the means of implementation and revitalize the global partnership for sustainable development"
    }
  ];

  export const techStackOptions = [
      { value: TechStackEnum.REACT, label: "React", type: "frontend", icon: SiReact },
      { value: TechStackEnum.ANGULAR, label: "Angular", type: "frontend", icon: SiAngular },
      { value: TechStackEnum.VUE, label: "Vue.js", type: "frontend", icon: SiVuedotjs },
      { value: TechStackEnum.NODE, label: "Node.js", type: "backend", icon: SiNodedotjs },
      { value: TechStackEnum.PYTHON, label: "Python", type: "backend", icon: SiPython },
      { value: TechStackEnum.DJANGO, label: "Django", type: "backend", icon: SiDjango },
      { value: TechStackEnum.FLASK, label: "Flask", type: "backend", icon: SiFlask },
        { value: TechStackEnum.JAVA, label: "Java", type: "backend", icon: DiJava },
        { value: TechStackEnum.SPRING, label: "Spring", type: "backend", icon: SiSpring },
        { value: TechStackEnum.DOTNET, label: ".NET", type: "backend", icon: SiDotnet },
        { value: TechStackEnum.PHP, label: "PHP", type: "backend", icon: SiPhp },
        { value: TechStackEnum.LARAVEL, label: "Laravel", type: "backend", icon: SiLaravel },
        { value: TechStackEnum.ANDROID, label: "Android", type: "frontend", icon: SiAndroid },
        { value: TechStackEnum.IOS, label: "iOS", type: "mobile", icon: SiIos },
        { value: TechStackEnum.FLUTTER, label: "Flutter", type: "mobile", icon: SiFlutter },
        { value: TechStackEnum.REACT_NATIVE, label: "React Native", type: "mobile", icon: DiReact },
        { value: TechStackEnum.FIREBASE, label: "Firebase", type: "cloud", icon: SiFirebase },
        { value: TechStackEnum.AWS, label: "AWS", type: "cloud", icon: FaAws },
        { value: TechStackEnum.MONGODB, label: "MongoDB", type: "database", icon: SiMongodb },
        { value: TechStackEnum.MYSQL, label: "MySQL", type: "database", icon: SiMysql },
        { value: TechStackEnum.POSTGRESQL, label: "PostgreSQL", type: "database", icon: SiPostgresql },
        { value: TechStackEnum.TENSORFLOW, label:"TensorFlow" ,type:"ai" ,icon :SiTensorflow},
        { value :TechStackEnum.PYTORCH ,label :"PyTorch" ,type :"ai" ,icon :SiPytorch},
        { value :TechStackEnum.ARDUINO ,label :"Arduino" ,type :"hardware" ,icon :SiArduino},
        { value :TechStackEnum.RASPBERRY_PI ,label :"Raspberry Pi" ,type :"hardware" ,icon :SiRaspberrypi},
        { value: TechStackEnum.SVELTE, label: "Svelte", type: "frontend", icon: SiSvelte },
        { value: TechStackEnum.KOTLIN, label: "Kotlin", type: "mobile", icon: SiKotlin },
        { value: TechStackEnum.SWIFT, label: "Swift", type: "mobile", icon: SiSwift },
        { value: TechStackEnum.RUBY, label: "Ruby", type: "backend", icon: SiRuby },
        { value: TechStackEnum.JAVASCRIPT, label: "JavaScript", type: "frontend", icon: SiJavascript },
        { value: TechStackEnum.TYPESCRIPT, label: "TypeScript", type: "frontend", icon: SiTypescript },
        { value: TechStackEnum.C_SHARP, label: "C#", type: "backend", icon: TbBrandCSharp },
        { value: TechStackEnum.C_PLUS_PLUS, label: "C++", type: "backend", icon: SiCplusplus },
        { value: TechStackEnum.C, label: "C", type: "backend", icon: SiC },
         ];
   export const projectStatusOptions = [
      { 
        value: ProjectStatusEnum.IDEA, 
        label: "Idea", 
        description: "Initial concept or proposal" 
      },
      { 
        value: ProjectStatusEnum.RESEARCH, 
        label: "Research",
        description: "Research and development phase" 
      },
      { 
        value: ProjectStatusEnum.MVP, 
        label: "MVP", 
        description: "Minimum viable product" 
      },
      { 
        value: ProjectStatusEnum.DEPLOYED, 
        label: "Deployed", 
        description: "Live and operational" 
      },
      { 
        value: ProjectStatusEnum.STARTUP, 
        label: "Startup", 
        description: "Growing business solution" 
      },
    ];

    export const projectDomainsOptions = [
      { value: "AI", label: "AI", icon: Brain },
      { value: "ML", label: "ML", icon: Cpu },
      { value: "AR_VR", label: "AR/VR", icon: MonitorSmartphone },
      { value: "BLOCKCHAIN", label: "Blockchain", icon: ShieldCheck },
      { value: "IOT", label: "IoT", icon: SatelliteDish },
      { value: "HEALTHTECH", label: "HealthTech", icon: HeartPulse },
      { value: "FINTECH", label: "FinTech", icon: Banknote },
      { value: "EDTECH", label: "EdTech", icon: BookOpen },
      { value: "AGRITECH", label: "AgriTech", icon: Sprout },
      { value: "ECOMMERCE", label: "E-Commerce", icon: ShoppingCart },
      { value: "SOCIAL", label: "Social", icon: Users },
      { value: "GAMING", label: "Gaming", icon: Gamepad2 },
      { value: "SECURITY", label: "Security", icon: Shield },
      { value: "DATA_ANALYTICS", label: "Data Analytics", icon: BarChart3 },
      { value: "ENTERTAINMENT", label: "Entertainment", icon: Clapperboard },
      { value: "SUSTAINABILITY", label: "Sustainability", icon: Leaf },
    ]

    export const socialPlatformMap: Record<string, { icon: any; label: string }> = {
      LINKEDIN: { icon: FaLinkedin, label: 'LinkedIn' },
      TWITTER: { icon: FaTwitter, label: 'Twitter' },
      INSTAGRAM: { icon: FaInstagram, label: 'Instagram' },
      FACEBOOK: { icon: FaFacebook, label: 'Facebook' },
      YOUTUBE: { icon: FaYoutube, label: 'YouTube' },
      TIKTOK: { icon: FaTiktok, label: 'TikTok' },
    };

    export const yearOptions = [
      { value: "2024", label: "SDGP 2023/24" ,type: "SDGP" },
      { value: "2025", label: "SDGP 2024/25" ,type: "SDGP" },
      { value: "2026", label: "SDGP 2025/26" ,type: "SDGP" },
      { value: "2027", label: "SDGP 2026/27" ,type: "SDGP" },
      { value: "I-24-sep", label: "InfoSchol 2024 Sep" ,type: "Infoschol" },
      { value: "I-25-jan", label: "InfoSchol 2025 Jan" ,type: "Infoschol" },
      { value: "I-25-sep", label: "InfoSchol 2025 Sep" ,type: "Infoschol" },
      { value: "I-26-jan", label: "InfoSchol 2026 Jan" ,type: "Infoschol" },
      { value: "VisioNex-2025", label: "VisioNEX 2025" ,type: "Visionex" },
    ]