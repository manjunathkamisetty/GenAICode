import { Role, Location, BaseRole, Level, RoleLevelRate, LocationBasedRate } from '../types';

// Base roles from the actual spreadsheet
export const BASE_ROLES: BaseRole[] = [
  {
    id: 'application-architect',
    name: 'Application Architect',
    category: 'Architecture',
    description: 'Designs and oversees application architecture and technical solutions'
  },
  {
    id: 'art-architect',
    name: 'ART Architect',
    category: 'Architecture',
    description: 'Agile Release Train architect responsible for technical coordination'
  },
  {
    id: 'art-lead-developer',
    name: 'ART Lead Developer',
    category: 'Software Development',
    description: 'Lead developer for Agile Release Train initiatives'
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    category: 'Business Analysis',
    description: 'Analyzes business requirements and processes'
  },
  {
    id: 'database-administrator',
    name: 'Database Administrator (DBA)',
    category: 'Database Management',
    description: 'Manages and maintains database systems'
  },
  {
    id: 'database-architect',
    name: 'Database Architect',
    category: 'Architecture',
    description: 'Designs database architecture and data management solutions'
  },
  {
    id: 'data-designer',
    name: 'Data Designer',
    category: 'Data & Analytics',
    description: 'Designs data models and data architecture'
  },
  {
    id: 'data-engineer',
    name: 'Data Engineer',
    category: 'Data & Analytics',
    description: 'Develops and maintains data pipelines and infrastructure'
  },
  {
    id: 'delivery-manager',
    name: 'Delivery Manager',
    category: 'Project Management',
    description: 'Manages project delivery and coordinates teams'
  },
  {
    id: 'developer',
    name: 'Developer',
    category: 'Software Development',
    description: 'Develops and maintains software applications'
  },
  {
    id: 'functional-solution-analyst',
    name: 'Functional Solution Analyst',
    category: 'Business Analysis',
    description: 'Analyzes functional requirements and solution design'
  },
  {
    id: 'lead-developer',
    name: 'Lead Developer',
    category: 'Software Development',
    description: 'Senior developer who leads development teams'
  },
  {
    id: 'mule-architect',
    name: 'Mule Architect',
    category: 'Architecture',
    description: 'MuleSoft integration architect'
  },
  {
    id: 'mule-developer',
    name: 'Mule Developer',
    category: 'Software Development',
    description: 'MuleSoft integration developer'
  },
  {
    id: 'offer-configurator',
    name: 'Offer Configurator',
    category: 'Configuration Management',
    description: 'Configures product and service offerings'
  },
  {
    id: 'platform-operations',
    name: 'Platform Operations',
    category: 'DevOps',
    description: 'Manages platform operations and infrastructure'
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    category: 'Product Management',
    description: 'Manages product development and strategy'
  },
  {
    id: 'product-owner',
    name: 'Product Owner',
    category: 'Product Management',
    description: 'Owns product backlog and requirements'
  },
  {
    id: 'production-support',
    name: 'Production Support',
    category: 'Support',
    description: 'Provides production system support and maintenance'
  },
  {
    id: 'qa-tester',
    name: 'QA (Tester)',
    category: 'Quality Assurance',
    description: 'Tests software applications and ensures quality'
  },
  {
    id: 'qe-engineer',
    name: 'QE Engineer',
    category: 'Quality Assurance',
    description: 'Quality engineering and automation'
  },
  {
    id: 'qe-lead',
    name: 'QE Lead',
    category: 'Quality Assurance',
    description: 'Leads quality engineering initiatives'
  },
  {
    id: 'release-lead',
    name: 'Release Lead',
    category: 'Release Management',
    description: 'Manages software releases and deployment'
  },
  {
    id: 'release-train-engineer',
    name: 'Release Train Engineer',
    category: 'Release Management',
    description: 'Agile Release Train engineer'
  },
  {
    id: 'salesforce-admin',
    name: 'Salesforce Admin',
    category: 'Salesforce',
    description: 'Administers Salesforce platform'
  },
  {
    id: 'salesforce-architect',
    name: 'Salesforce Architect',
    category: 'Salesforce',
    description: 'Designs Salesforce solutions and architecture'
  },
  {
    id: 'salesforce-developer',
    name: 'Salesforce Developer',
    category: 'Salesforce',
    description: 'Develops Salesforce applications and customizations'
  },
  {
    id: 'scrum-master',
    name: 'Scrum Master',
    category: 'Agile Coaching',
    description: 'Facilitates agile processes and removes impediments'
  },
  {
    id: 'system-architect',
    name: 'System Architect',
    category: 'Architecture',
    description: 'Designs system architecture and technical solutions'
  },
  {
    id: 'technical-product-owner',
    name: 'Technical Product Owner',
    category: 'Product Management',
    description: 'Technical product owner with development expertise'
  },
  {
    id: 'technical-solution-analyst',
    name: 'Technical Solution Analyst',
    category: 'Technical Analysis',
    description: 'Analyzes technical solutions and requirements'
  },
  {
    id: 'ux-ui-designer',
    name: 'UX/UI Designer',
    category: 'Design',
    description: 'Designs user interfaces and user experiences'
  },
  {
    id: 'transformation-lead',
    name: 'Transformation Lead',
    category: 'Leadership',
    description: 'Leads digital transformation initiatives'
  },
  {
    id: 'enterprise-architect-telecom',
    name: 'Enterprise Architect - Telecom',
    category: 'Architecture',
    description: 'Enterprise architect specializing in telecom domain'
  },
  {
    id: 'business-value-management-expert',
    name: 'Business Value Management Expert',
    category: 'Business Analysis',
    description: 'Expert in business value management and optimization'
  },
  {
    id: 'enterprise-safe-agile-coach',
    name: 'Enterprise SAFE Agile Coach',
    category: 'Agile Coaching',
    description: 'Enterprise-level SAFe agile coaching'
  },
  {
    id: 'engagement-program-director',
    name: 'Engagement Program Director',
    category: 'Leadership',
    description: 'Directs engagement programs and initiatives'
  },
  {
    id: 'gen-ai-enterprise-architect',
    name: 'Gen AI Enterprise Architect',
    category: 'Architecture',
    description: 'Generative AI enterprise architect'
  },
  {
    id: 'ocm',
    name: 'OCM',
    category: 'Change Management',
    description: 'Organizational Change Management specialist'
  },
  {
    id: 'innovation-evangelist',
    name: 'Innovation Evangelist',
    category: 'Innovation',
    description: 'Promotes innovation and emerging technologies'
  },
  {
    id: 'transformation-lead',
    name: 'Transformation Lead',
    category: 'Leadership',
    description: 'Leads digital and business transformation initiatives'
  },

];

// Available levels from the spreadsheet (I, II, III)
export const LEVELS: Level[] = [
  {
    id: 'level-i',
    name: 'Level I',
    order: 1,
    description: 'Entry to mid-level professional'
  },
  {
    id: 'level-ii',
    name: 'Level II',
    order: 2,
    description: 'Experienced professional'
  },
  {
    id: 'level-iii',
    name: 'Level III',
    order: 3,
    description: 'Senior professional and expert'
  }
];

// Role-Level-Rate combinations based on USA rates (base rates)
export const ROLE_LEVEL_RATES: RoleLevelRate[] = [
  // Application Architect
  { roleId: 'application-architect', levelId: 'level-i', hourlyRate: 118.00, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-ii', hourlyRate: 128.00, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-iii', hourlyRate: 136.00, isAvailable: true },

  // ART Architect  
  { roleId: 'art-architect', levelId: 'level-ii', hourlyRate: 130.00, isAvailable: true },
  { roleId: 'art-architect', levelId: 'level-iii', hourlyRate: 138.00, isAvailable: true },

  // ART Lead Developer
  { roleId: 'art-lead-developer', levelId: 'level-i', hourlyRate: 114.00, isAvailable: true },
  { roleId: 'art-lead-developer', levelId: 'level-ii', hourlyRate: 120.00, isAvailable: true },
  { roleId: 'art-lead-developer', levelId: 'level-iii', hourlyRate: 127.00, isAvailable: true },

  // Business Analyst
  { roleId: 'business-analyst', levelId: 'level-i', hourlyRate: 105.00, isAvailable: true },
  { roleId: 'business-analyst', levelId: 'level-ii', hourlyRate: 115.00, isAvailable: true },
  { roleId: 'business-analyst', levelId: 'level-iii', hourlyRate: 335.00, isAvailable: true },

  // Database Administrator (DBA)
  { roleId: 'database-administrator', levelId: 'level-i', hourlyRate: 100.00, isAvailable: true },
  { roleId: 'database-administrator', levelId: 'level-ii', hourlyRate: 112.00, isAvailable: true },
  { roleId: 'database-administrator', levelId: 'level-iii', hourlyRate: 125.00, isAvailable: true },

  // Database Architect
  { roleId: 'database-architect', levelId: 'level-i', hourlyRate: 118.00, isAvailable: true },
  { roleId: 'database-architect', levelId: 'level-ii', hourlyRate: 128.00, isAvailable: true },
  { roleId: 'database-architect', levelId: 'level-iii', hourlyRate: 136.00, isAvailable: true },

  // Data Designer
  { roleId: 'data-designer', levelId: 'level-i', hourlyRate: 125.00, isAvailable: true },
  { roleId: 'data-designer', levelId: 'level-ii', hourlyRate: 135.00, isAvailable: true },
  { roleId: 'data-designer', levelId: 'level-iii', hourlyRate: 142.00, isAvailable: true },

  // Data Engineer
  { roleId: 'data-engineer', levelId: 'level-i', hourlyRate: 120.00, isAvailable: true },
  { roleId: 'data-engineer', levelId: 'level-ii', hourlyRate: 132.00, isAvailable: true },
  { roleId: 'data-engineer', levelId: 'level-iii', hourlyRate: 140.00, isAvailable: true },

  // Delivery Manager
  { roleId: 'delivery-manager', levelId: 'level-i', hourlyRate: 120.00, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-ii', hourlyRate: 130.00, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-iii', hourlyRate: 140.00, isAvailable: true },

  // Developer
  { roleId: 'developer', levelId: 'level-i', hourlyRate: 84.00, isAvailable: true },
  { roleId: 'developer', levelId: 'level-ii', hourlyRate: 90.00, isAvailable: true },
  { roleId: 'developer', levelId: 'level-iii', hourlyRate: 105.00, isAvailable: true },

  // Functional Solution Analyst
  { roleId: 'functional-solution-analyst', levelId: 'level-i', hourlyRate: 150.00, isAvailable: true },
  { roleId: 'functional-solution-analyst', levelId: 'level-ii', hourlyRate: 115.00, isAvailable: true },
  { roleId: 'functional-solution-analyst', levelId: 'level-iii', hourlyRate: 125.00, isAvailable: true },

  // Lead Developer
  { roleId: 'lead-developer', levelId: 'level-i', hourlyRate: 106.00, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-ii', hourlyRate: 112.00, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-iii', hourlyRate: 120.00, isAvailable: true },

  // Mule Architect
  { roleId: 'mule-architect', levelId: 'level-i', hourlyRate: 124.00, isAvailable: true },
  { roleId: 'mule-architect', levelId: 'level-ii', hourlyRate: 136.00, isAvailable: true },
  { roleId: 'mule-architect', levelId: 'level-iii', hourlyRate: 148.00, isAvailable: true },

  // Mule Developer
  { roleId: 'mule-developer', levelId: 'level-i', hourlyRate: 107.00, isAvailable: true },
  { roleId: 'mule-developer', levelId: 'level-ii', hourlyRate: 116.00, isAvailable: true },
  { roleId: 'mule-developer', levelId: 'level-iii', hourlyRate: 123.00, isAvailable: true },

  // Offer Configurator
  { roleId: 'offer-configurator', levelId: 'level-i', hourlyRate: 100.00, isAvailable: true },
  { roleId: 'offer-configurator', levelId: 'level-ii', hourlyRate: 116.00, isAvailable: true },
  { roleId: 'offer-configurator', levelId: 'level-iii', hourlyRate: 120.00, isAvailable: true },

  // Platform Operations
  { roleId: 'platform-operations', levelId: 'level-i', hourlyRate: 85.00, isAvailable: true },
  { roleId: 'platform-operations', levelId: 'level-ii', hourlyRate: 95.00, isAvailable: true },
  { roleId: 'platform-operations', levelId: 'level-iii', hourlyRate: 105.00, isAvailable: true },

  // Product Manager
  { roleId: 'product-manager', levelId: 'level-i', hourlyRate: 120.00, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-ii', hourlyRate: 130.00, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-iii', hourlyRate: 140.00, isAvailable: true },

  // Product Owner
  { roleId: 'product-owner', levelId: 'level-i', hourlyRate: 115.00, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-ii', hourlyRate: 125.00, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-iii', hourlyRate: 135.00, isAvailable: true },

  // Production Support
  { roleId: 'production-support', levelId: 'level-i', hourlyRate: 85.00, isAvailable: true },
  { roleId: 'production-support', levelId: 'level-ii', hourlyRate: 95.00, isAvailable: true },
  { roleId: 'production-support', levelId: 'level-iii', hourlyRate: 105.00, isAvailable: true },

  // QA (Tester)
  { roleId: 'qa-tester', levelId: 'level-i', hourlyRate: 74.00, isAvailable: true },
  { roleId: 'qa-tester', levelId: 'level-ii', hourlyRate: 83.00, isAvailable: true },
  { roleId: 'qa-tester', levelId: 'level-iii', hourlyRate: 89.00, isAvailable: true },

  // QE Engineer
  { roleId: 'qe-engineer', levelId: 'level-i', hourlyRate: 85.00, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-ii', hourlyRate: 93.00, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-iii', hourlyRate: 100.00, isAvailable: true },

  // QE Lead
  { roleId: 'qe-lead', levelId: 'level-i', hourlyRate: 96.00, isAvailable: true },
  { roleId: 'qe-lead', levelId: 'level-ii', hourlyRate: 103.00, isAvailable: true },
  { roleId: 'qe-lead', levelId: 'level-iii', hourlyRate: 113.00, isAvailable: true },

  // Release Lead
  { roleId: 'release-lead', levelId: 'level-i', hourlyRate: 105.00, isAvailable: true },
  { roleId: 'release-lead', levelId: 'level-ii', hourlyRate: 113.00, isAvailable: true },
  { roleId: 'release-lead', levelId: 'level-iii', hourlyRate: 122.00, isAvailable: true },

  // Release Train Engineer
  { roleId: 'release-train-engineer', levelId: 'level-i', hourlyRate: 110.00, isAvailable: true },
  { roleId: 'release-train-engineer', levelId: 'level-ii', hourlyRate: 116.00, isAvailable: true },
  { roleId: 'release-train-engineer', levelId: 'level-iii', hourlyRate: 128.00, isAvailable: true },

  // Salesforce Admin
  { roleId: 'salesforce-admin', levelId: 'level-i', hourlyRate: 115.00, isAvailable: true },
  { roleId: 'salesforce-admin', levelId: 'level-ii', hourlyRate: 124.00, isAvailable: true },
  { roleId: 'salesforce-admin', levelId: 'level-iii', hourlyRate: 130.00, isAvailable: true },

  // Salesforce Architect
  { roleId: 'salesforce-architect', levelId: 'level-i', hourlyRate: 124.00, isAvailable: true },
  { roleId: 'salesforce-architect', levelId: 'level-ii', hourlyRate: 136.00, isAvailable: true },
  { roleId: 'salesforce-architect', levelId: 'level-iii', hourlyRate: 148.00, isAvailable: true },

  // Salesforce Developer
  { roleId: 'salesforce-developer', levelId: 'level-i', hourlyRate: 112.00, isAvailable: true },
  { roleId: 'salesforce-developer', levelId: 'level-ii', hourlyRate: 116.00, isAvailable: true },
  { roleId: 'salesforce-developer', levelId: 'level-iii', hourlyRate: 124.00, isAvailable: true },

  // Scrum Master
  { roleId: 'scrum-master', levelId: 'level-i', hourlyRate: 100.00, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-ii', hourlyRate: 110.00, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-iii', hourlyRate: 120.00, isAvailable: true },

  // System Architect
  { roleId: 'system-architect', levelId: 'level-i', hourlyRate: 118.00, isAvailable: true },
  { roleId: 'system-architect', levelId: 'level-ii', hourlyRate: 128.00, isAvailable: true },
  { roleId: 'system-architect', levelId: 'level-iii', hourlyRate: 136.00, isAvailable: true },

  // Technical Product Owner
  { roleId: 'technical-product-owner', levelId: 'level-i', hourlyRate: 112.00, isAvailable: true },
  { roleId: 'technical-product-owner', levelId: 'level-ii', hourlyRate: 123.00, isAvailable: true },
  { roleId: 'technical-product-owner', levelId: 'level-iii', hourlyRate: 134.00, isAvailable: true },

  // Technical Solution Analyst
  { roleId: 'technical-solution-analyst', levelId: 'level-i', hourlyRate: 105.00, isAvailable: true },
  { roleId: 'technical-solution-analyst', levelId: 'level-ii', hourlyRate: 115.00, isAvailable: true },
  { roleId: 'technical-solution-analyst', levelId: 'level-iii', hourlyRate: 125.00, isAvailable: true },

  // UX/UI Designer
  { roleId: 'ux-ui-designer', levelId: 'level-i', hourlyRate: 120.00, isAvailable: true },
  { roleId: 'ux-ui-designer', levelId: 'level-ii', hourlyRate: 130.00, isAvailable: true },
  { roleId: 'ux-ui-designer', levelId: 'level-iii', hourlyRate: 138.00, isAvailable: true },

  // Transformation Lead
  { roleId: 'transformation-lead', levelId: 'level-i', hourlyRate: 335.00, isAvailable: true },

    // Enterprise Architect - Telecom
  { roleId: 'enterprise-architect-telecom', levelId: 'level-ii', hourlyRate: 245.00, isAvailable: true },

  // Business Value Management Expert
  { roleId: 'business-value-management-expert', levelId: 'level-iii', hourlyRate: 335.00, isAvailable: true },

  // Enterprise SAFE Agile Coach
  { roleId: 'enterprise-safe-agile-coach', levelId: 'level-i', hourlyRate: 195.00, isAvailable: true },

  // Engagement Program Director  
  { roleId: 'engagement-program-director', levelId: 'level-ii', hourlyRate: 235.00, isAvailable: true },

  // Gen AI Enterprise Architect
  { roleId: 'gen-ai-enterprise-architect', levelId: 'level-iii', hourlyRate: 245.00, isAvailable: true },

  // OCM
  { roleId: 'ocm', levelId: 'level-i', hourlyRate: 250.00, isAvailable: true },

  // Innovation Evangelist
  { roleId: 'innovation-evangelist', levelId: 'level-ii', hourlyRate: 205.00, isAvailable: true },

  // Transformation Lead
  { roleId: 'transformation-lead', levelId: 'level-i', hourlyRate: 335.00, isAvailable: true },


];

// Location-based rate matrix - specific rates for each role+level+location combination
export const LOCATION_BASED_RATES: LocationBasedRate[] = [
  // Application Architect
  { roleId: 'application-architect', levelId: 'level-i', locationId: 'usa', hourlyRate: 118, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-i', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-i', locationId: 'mexico', hourlyRate: 90, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-i', locationId: 'canada', hourlyRate: 97, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-i', locationId: 'romania', hourlyRate: 105, isAvailable: true },
  
  { roleId: 'application-architect', levelId: 'level-ii', locationId: 'usa', hourlyRate: 128, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-ii', locationId: 'india', hourlyRate: 33, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 92, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-ii', locationId: 'canada', hourlyRate: 105, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-ii', locationId: 'romania', hourlyRate: 120, isAvailable: true },
  
  { roleId: 'application-architect', levelId: 'level-iii', locationId: 'usa', hourlyRate: 136, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-iii', locationId: 'india', hourlyRate: 36, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 110, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-iii', locationId: 'canada', hourlyRate: 112, isAvailable: true },
  { roleId: 'application-architect', levelId: 'level-iii', locationId: 'romania', hourlyRate: 130, isAvailable: true },

  // ART Architect  
  { roleId: 'art-architect', levelId: 'level-i', locationId: 'usa', hourlyRate: 130, isAvailable: true },
  { roleId: 'art-architect', levelId: 'level-i', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'art-architect', levelId: 'level-i', locationId: 'mexico', hourlyRate: 88, isAvailable: true },
  { roleId: 'art-architect', levelId: 'level-i', locationId: 'canada', hourlyRate: 107, isAvailable: true },
  
  { roleId: 'art-architect', levelId: 'level-ii', locationId: 'usa', hourlyRate: 138, isAvailable: true },
  { roleId: 'art-architect', levelId: 'level-ii', locationId: 'india', hourlyRate: 33, isAvailable: true },
  { roleId: 'art-architect', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 99, isAvailable: true },
  { roleId: 'art-architect', levelId: 'level-ii', locationId: 'canada', hourlyRate: 114, isAvailable: true },
  
  { roleId: 'art-architect', levelId: 'level-iii', locationId: 'usa', hourlyRate: 144, isAvailable: true },
  { roleId: 'art-architect', levelId: 'level-iii', locationId: 'india', hourlyRate: 36, isAvailable: true },
  { roleId: 'art-architect', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 105, isAvailable: true },
  { roleId: 'art-architect', levelId: 'level-iii', locationId: 'canada', hourlyRate: 119, isAvailable: true },

  // ART Lead Developer
  { roleId: 'art-lead-developer', levelId: 'level-i', locationId: 'usa', hourlyRate: 114, isAvailable: true },
  { roleId: 'art-lead-developer', levelId: 'level-i', locationId: 'india', hourlyRate: 33, isAvailable: true },
  { roleId: 'art-lead-developer', levelId: 'level-i', locationId: 'mexico', hourlyRate: 72, isAvailable: true },
  { roleId: 'art-lead-developer', levelId: 'level-i', locationId: 'canada', hourlyRate: 94, isAvailable: true },
  
  { roleId: 'art-lead-developer', levelId: 'level-ii', locationId: 'usa', hourlyRate: 120, isAvailable: true },
  { roleId: 'art-lead-developer', levelId: 'level-ii', locationId: 'india', hourlyRate: 36, isAvailable: true },
  { roleId: 'art-lead-developer', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 82, isAvailable: true },
  { roleId: 'art-lead-developer', levelId: 'level-ii', locationId: 'canada', hourlyRate: 99, isAvailable: true },
  
  { roleId: 'art-lead-developer', levelId: 'level-iii', locationId: 'usa', hourlyRate: 127, isAvailable: true },
  { roleId: 'art-lead-developer', levelId: 'level-iii', locationId: 'india', hourlyRate: 39, isAvailable: true },
  { roleId: 'art-lead-developer', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 92, isAvailable: true },
  { roleId: 'art-lead-developer', levelId: 'level-iii', locationId: 'canada', hourlyRate: 105, isAvailable: true },

  // Business Analyst
  { roleId: 'business-analyst', levelId: 'level-i', locationId: 'usa', hourlyRate: 105, isAvailable: true },
  { roleId: 'business-analyst', levelId: 'level-i', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'business-analyst', levelId: 'level-i', locationId: 'mexico', hourlyRate: 52, isAvailable: true },
  { roleId: 'business-analyst', levelId: 'level-i', locationId: 'canada', hourlyRate: 87, isAvailable: true },
  
  { roleId: 'business-analyst', levelId: 'level-ii', locationId: 'usa', hourlyRate: 115, isAvailable: true },
  { roleId: 'business-analyst', levelId: 'level-ii', locationId: 'india', hourlyRate: 30, isAvailable: true },
  { roleId: 'business-analyst', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 67, isAvailable: true },
  { roleId: 'business-analyst', levelId: 'level-ii', locationId: 'canada', hourlyRate: 95, isAvailable: true },
  
  { roleId: 'business-analyst', levelId: 'level-iii', locationId: 'usa', hourlyRate: 335, isAvailable: true },
  { roleId: 'business-analyst', levelId: 'level-iii', locationId: 'india', hourlyRate: 85, isAvailable: true },
  { roleId: 'business-analyst', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 86, isAvailable: true },
  { roleId: 'business-analyst', levelId: 'level-iii', locationId: 'canada', hourlyRate: 103, isAvailable: true },

  // Database Administrator (DBA)
  { roleId: 'database-administrator', levelId: 'level-i', locationId: 'usa', hourlyRate: 100, isAvailable: true },
  { roleId: 'database-administrator', levelId: 'level-i', locationId: 'india', hourlyRate: 24, isAvailable: true },
  { roleId: 'database-administrator', levelId: 'level-i', locationId: 'mexico', hourlyRate: 52, isAvailable: true },
  { roleId: 'database-administrator', levelId: 'level-i', locationId: 'canada', hourlyRate: 82, isAvailable: true },
  
  { roleId: 'database-administrator', levelId: 'level-ii', locationId: 'usa', hourlyRate: 112, isAvailable: true },
  { roleId: 'database-administrator', levelId: 'level-ii', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'database-administrator', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 72, isAvailable: true },
  { roleId: 'database-administrator', levelId: 'level-ii', locationId: 'canada', hourlyRate: 92, isAvailable: true },
  
  { roleId: 'database-administrator', levelId: 'level-iii', locationId: 'usa', hourlyRate: 125, isAvailable: true },
  { roleId: 'database-administrator', levelId: 'level-iii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'database-administrator', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 88, isAvailable: true },
  { roleId: 'database-administrator', levelId: 'level-iii', locationId: 'canada', hourlyRate: 103, isAvailable: true },

  // Database Architect
  { roleId: 'database-architect', levelId: 'level-i', locationId: 'usa', hourlyRate: 118, isAvailable: true },
  { roleId: 'database-architect', levelId: 'level-i', locationId: 'india', hourlyRate: 30, isAvailable: true },
  
  { roleId: 'database-architect', levelId: 'level-ii', locationId: 'usa', hourlyRate: 128, isAvailable: true },
  { roleId: 'database-architect', levelId: 'level-ii', locationId: 'india', hourlyRate: 35, isAvailable: true },
  { roleId: 'database-architect', levelId: 'level-ii', locationId: 'canada', hourlyRate: 105, isAvailable: true },
  
  { roleId: 'database-architect', levelId: 'level-iii', locationId: 'usa', hourlyRate: 136, isAvailable: true },
  { roleId: 'database-architect', levelId: 'level-iii', locationId: 'india', hourlyRate: 40, isAvailable: true },
  { roleId: 'database-architect', levelId: 'level-iii', locationId: 'canada', hourlyRate: 112, isAvailable: true },

  // Data Designer
  { roleId: 'data-designer', levelId: 'level-i', locationId: 'usa', hourlyRate: 125, isAvailable: true },
  { roleId: 'data-designer', levelId: 'level-i', locationId: 'india', hourlyRate: 26, isAvailable: true },
  { roleId: 'data-designer', levelId: 'level-i', locationId: 'canada', hourlyRate: 103, isAvailable: true },
  
  { roleId: 'data-designer', levelId: 'level-ii', locationId: 'usa', hourlyRate: 135, isAvailable: true },
  { roleId: 'data-designer', levelId: 'level-ii', locationId: 'india', hourlyRate: 29, isAvailable: true },
  { roleId: 'data-designer', levelId: 'level-ii', locationId: 'canada', hourlyRate: 111, isAvailable: true },
  
  { roleId: 'data-designer', levelId: 'level-iii', locationId: 'usa', hourlyRate: 142, isAvailable: true },
  { roleId: 'data-designer', levelId: 'level-iii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'data-designer', levelId: 'level-iii', locationId: 'canada', hourlyRate: 117, isAvailable: true },

  // Data Engineer
  { roleId: 'data-engineer', levelId: 'level-i', locationId: 'usa', hourlyRate: 120, isAvailable: true },
  { roleId: 'data-engineer', levelId: 'level-i', locationId: 'india', hourlyRate: 25, isAvailable: true },
  { roleId: 'data-engineer', levelId: 'level-i', locationId: 'canada', hourlyRate: 103, isAvailable: true },
  
  { roleId: 'data-engineer', levelId: 'level-ii', locationId: 'usa', hourlyRate: 132, isAvailable: true },
  { roleId: 'data-engineer', levelId: 'level-ii', locationId: 'india', hourlyRate: 29, isAvailable: true },
  { roleId: 'data-engineer', levelId: 'level-ii', locationId: 'canada', hourlyRate: 114, isAvailable: true },
  
  { roleId: 'data-engineer', levelId: 'level-iii', locationId: 'usa', hourlyRate: 140, isAvailable: true },
  { roleId: 'data-engineer', levelId: 'level-iii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'data-engineer', levelId: 'level-iii', locationId: 'canada', hourlyRate: 117, isAvailable: true },

  // Delivery Manager
  { roleId: 'delivery-manager', levelId: 'level-i', locationId: 'usa', hourlyRate: 120, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-i', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-i', locationId: 'mexico', hourlyRate: 88, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-i', locationId: 'canada', hourlyRate: 99, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-i', locationId: 'romania', hourlyRate: 85, isAvailable: true },
  
  { roleId: 'delivery-manager', levelId: 'level-ii', locationId: 'usa', hourlyRate: 130, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-ii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 100, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-ii', locationId: 'canada', hourlyRate: 107, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-ii', locationId: 'romania', hourlyRate: 95, isAvailable: true },
  
  { roleId: 'delivery-manager', levelId: 'level-iii', locationId: 'usa', hourlyRate: 140, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-iii', locationId: 'india', hourlyRate: 36, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 115, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-iii', locationId: 'canada', hourlyRate: 115, isAvailable: true },
  { roleId: 'delivery-manager', levelId: 'level-iii', locationId: 'romania', hourlyRate: 110, isAvailable: true },

  // Developer
  { roleId: 'developer', levelId: 'level-i', locationId: 'usa', hourlyRate: 84, isAvailable: true },
  { roleId: 'developer', levelId: 'level-i', locationId: 'india', hourlyRate: 22, isAvailable: true },
  { roleId: 'developer', levelId: 'level-i', locationId: 'mexico', hourlyRate: 61, isAvailable: true },
  { roleId: 'developer', levelId: 'level-i', locationId: 'canada', hourlyRate: 73, isAvailable: true },
  { roleId: 'developer', levelId: 'level-i', locationId: 'romania', hourlyRate: 65, isAvailable: true },
  
  { roleId: 'developer', levelId: 'level-ii', locationId: 'usa', hourlyRate: 90, isAvailable: true },
  { roleId: 'developer', levelId: 'level-ii', locationId: 'india', hourlyRate: 24, isAvailable: true },
  { roleId: 'developer', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 69, isAvailable: true },
  { roleId: 'developer', levelId: 'level-ii', locationId: 'canada', hourlyRate: 78, isAvailable: true },
  { roleId: 'developer', levelId: 'level-ii', locationId: 'romania', hourlyRate: 70, isAvailable: true },
  
  { roleId: 'developer', levelId: 'level-iii', locationId: 'usa', hourlyRate: 105, isAvailable: true },
  { roleId: 'developer', levelId: 'level-iii', locationId: 'india', hourlyRate: 26, isAvailable: true },
  { roleId: 'developer', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 78, isAvailable: true },
  { roleId: 'developer', levelId: 'level-iii', locationId: 'canada', hourlyRate: 87, isAvailable: true },
  { roleId: 'developer', levelId: 'level-iii', locationId: 'romania', hourlyRate: 85, isAvailable: true },

  // Functional Solution Analyst
  { roleId: 'functional-solution-analyst', levelId: 'level-i', locationId: 'usa', hourlyRate: 105, isAvailable: true },
  { roleId: 'functional-solution-analyst', levelId: 'level-i', locationId: 'india', hourlyRate: 26, isAvailable: true },
  { roleId: 'functional-solution-analyst', levelId: 'level-i', locationId: 'mexico', hourlyRate: 48, isAvailable: true },
  { roleId: 'functional-solution-analyst', levelId: 'level-i', locationId: 'canada', hourlyRate: 87, isAvailable: true },
  
  { roleId: 'functional-solution-analyst', levelId: 'level-ii', locationId: 'usa', hourlyRate: 115, isAvailable: true },
  { roleId: 'functional-solution-analyst', levelId: 'level-ii', locationId: 'india', hourlyRate: 29, isAvailable: true },
  { roleId: 'functional-solution-analyst', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 67, isAvailable: true },
  { roleId: 'functional-solution-analyst', levelId: 'level-ii', locationId: 'canada', hourlyRate: 95, isAvailable: true },
  
  { roleId: 'functional-solution-analyst', levelId: 'level-iii', locationId: 'usa', hourlyRate: 125, isAvailable: true },
  { roleId: 'functional-solution-analyst', levelId: 'level-iii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'functional-solution-analyst', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 86, isAvailable: true },
  { roleId: 'functional-solution-analyst', levelId: 'level-iii', locationId: 'canada', hourlyRate: 103, isAvailable: true },

  // Lead Developer
  { roleId: 'lead-developer', levelId: 'level-i', locationId: 'usa', hourlyRate: 106, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-i', locationId: 'india', hourlyRate: 25, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-i', locationId: 'mexico', hourlyRate: 67, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-i', locationId: 'canada', hourlyRate: 87, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-i', locationId: 'romania', hourlyRate: 65, isAvailable: true },
  
  { roleId: 'lead-developer', levelId: 'level-ii', locationId: 'usa', hourlyRate: 112, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-ii', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 77, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-ii', locationId: 'canada', hourlyRate: 92, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-ii', locationId: 'romania', hourlyRate: 85, isAvailable: true },
  
  { roleId: 'lead-developer', levelId: 'level-iii', locationId: 'usa', hourlyRate: 120, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-iii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 88, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-iii', locationId: 'canada', hourlyRate: 99, isAvailable: true },
  { roleId: 'lead-developer', levelId: 'level-iii', locationId: 'romania', hourlyRate: 115, isAvailable: true },

  // Mule Architect
  { roleId: 'mule-architect', levelId: 'level-i', locationId: 'usa', hourlyRate: 124, isAvailable: true },
  { roleId: 'mule-architect', levelId: 'level-i', locationId: 'india', hourlyRate: 32, isAvailable: true },
  
  { roleId: 'mule-architect', levelId: 'level-ii', locationId: 'usa', hourlyRate: 136, isAvailable: true },
  { roleId: 'mule-architect', levelId: 'level-ii', locationId: 'india', hourlyRate: 37, isAvailable: true },
  { roleId: 'mule-architect', levelId: 'level-ii', locationId: 'canada', hourlyRate: 112, isAvailable: true },
  
  { roleId: 'mule-architect', levelId: 'level-iii', locationId: 'usa', hourlyRate: 148, isAvailable: true },
  { roleId: 'mule-architect', levelId: 'level-iii', locationId: 'india', hourlyRate: 42, isAvailable: true },
  { roleId: 'mule-architect', levelId: 'level-iii', locationId: 'canada', hourlyRate: 122, isAvailable: true },

  // Mule Developer
  { roleId: 'mule-developer', levelId: 'level-i', locationId: 'usa', hourlyRate: 107, isAvailable: true },
  { roleId: 'mule-developer', levelId: 'level-i', locationId: 'india', hourlyRate: 27.5, isAvailable: true },
  { roleId: 'mule-developer', levelId: 'level-i', locationId: 'canada', hourlyRate: 92, isAvailable: true },
  
  { roleId: 'mule-developer', levelId: 'level-ii', locationId: 'usa', hourlyRate: 116, isAvailable: true },
  { roleId: 'mule-developer', levelId: 'level-ii', locationId: 'india', hourlyRate: 31, isAvailable: true },
  { roleId: 'mule-developer', levelId: 'level-ii', locationId: 'canada', hourlyRate: 97, isAvailable: true },
  
  { roleId: 'mule-developer', levelId: 'level-iii', locationId: 'usa', hourlyRate: 123, isAvailable: true },
  { roleId: 'mule-developer', levelId: 'level-iii', locationId: 'india', hourlyRate: 34.5, isAvailable: true },
  { roleId: 'mule-developer', levelId: 'level-iii', locationId: 'canada', hourlyRate: 102, isAvailable: true },

  // Offer Configurator
  { roleId: 'offer-configurator', levelId: 'level-i', locationId: 'usa', hourlyRate: 100, isAvailable: true },
  { roleId: 'offer-configurator', levelId: 'level-i', locationId: 'india', hourlyRate: 26, isAvailable: true },
  { roleId: 'offer-configurator', levelId: 'level-i', locationId: 'mexico', hourlyRate: 58, isAvailable: true },
  { roleId: 'offer-configurator', levelId: 'level-i', locationId: 'canada', hourlyRate: 82, isAvailable: true },
  
  { roleId: 'offer-configurator', levelId: 'level-ii', locationId: 'usa', hourlyRate: 110, isAvailable: true },
  { roleId: 'offer-configurator', levelId: 'level-ii', locationId: 'india', hourlyRate: 30, isAvailable: true },
  { roleId: 'offer-configurator', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 72, isAvailable: true },
  { roleId: 'offer-configurator', levelId: 'level-ii', locationId: 'canada', hourlyRate: 91, isAvailable: true },
  
  { roleId: 'offer-configurator', levelId: 'level-iii', locationId: 'usa', hourlyRate: 120, isAvailable: true },
  { roleId: 'offer-configurator', levelId: 'level-iii', locationId: 'india', hourlyRate: 34, isAvailable: true },
  { roleId: 'offer-configurator', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 86, isAvailable: true },
  { roleId: 'offer-configurator', levelId: 'level-iii', locationId: 'canada', hourlyRate: 99, isAvailable: true },

  // Platform Operations
  { roleId: 'platform-operations', levelId: 'level-i', locationId: 'usa', hourlyRate: 85, isAvailable: true },
  { roleId: 'platform-operations', levelId: 'level-i', locationId: 'india', hourlyRate: 22, isAvailable: true },
  { roleId: 'platform-operations', levelId: 'level-i', locationId: 'mexico', hourlyRate: 44, isAvailable: true },
  { roleId: 'platform-operations', levelId: 'level-i', locationId: 'canada', hourlyRate: 70, isAvailable: true },
  
  { roleId: 'platform-operations', levelId: 'level-ii', locationId: 'usa', hourlyRate: 95, isAvailable: true },
  { roleId: 'platform-operations', levelId: 'level-ii', locationId: 'india', hourlyRate: 25, isAvailable: true },
  { roleId: 'platform-operations', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 62, isAvailable: true },
  { roleId: 'platform-operations', levelId: 'level-ii', locationId: 'canada', hourlyRate: 78, isAvailable: true },
  
  { roleId: 'platform-operations', levelId: 'level-iii', locationId: 'usa', hourlyRate: 105, isAvailable: true },
  { roleId: 'platform-operations', levelId: 'level-iii', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'platform-operations', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 78, isAvailable: true },
  { roleId: 'platform-operations', levelId: 'level-iii', locationId: 'canada', hourlyRate: 87, isAvailable: true },

  // Product Manager
  { roleId: 'product-manager', levelId: 'level-i', locationId: 'usa', hourlyRate: 120, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-i', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-i', locationId: 'mexico', hourlyRate: 62, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-i', locationId: 'romania', hourlyRate: 75, isAvailable: true },
  
  { roleId: 'product-manager', levelId: 'level-ii', locationId: 'usa', hourlyRate: 130, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-ii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 92, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-ii', locationId: 'canada', hourlyRate: 107, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-ii', locationId: 'romania', hourlyRate: 85, isAvailable: true },
  
  { roleId: 'product-manager', levelId: 'level-iii', locationId: 'usa', hourlyRate: 140, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-iii', locationId: 'india', hourlyRate: 36, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 105, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-iii', locationId: 'canada', hourlyRate: 115, isAvailable: true },
  { roleId: 'product-manager', levelId: 'level-iii', locationId: 'romania', hourlyRate: 95, isAvailable: true },

  // Product Owner
  { roleId: 'product-owner', levelId: 'level-i', locationId: 'usa', hourlyRate: 115, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-i', locationId: 'india', hourlyRate: 27, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-i', locationId: 'mexico', hourlyRate: 65, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-i', locationId: 'canada', hourlyRate: 95, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-i', locationId: 'romania', hourlyRate: 60, isAvailable: true },
  
  { roleId: 'product-owner', levelId: 'level-ii', locationId: 'usa', hourlyRate: 125, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-ii', locationId: 'india', hourlyRate: 30, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 76, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-ii', locationId: 'canada', hourlyRate: 103, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-ii', locationId: 'romania', hourlyRate: 70, isAvailable: true },
  
  { roleId: 'product-owner', levelId: 'level-iii', locationId: 'usa', hourlyRate: 135, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-iii', locationId: 'india', hourlyRate: 33, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 90, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-iii', locationId: 'canada', hourlyRate: 111, isAvailable: true },
  { roleId: 'product-owner', levelId: 'level-iii', locationId: 'romania', hourlyRate: 80, isAvailable: true },

  // Production Support
  { roleId: 'production-support', levelId: 'level-i', locationId: 'usa', hourlyRate: 85, isAvailable: true },
  { roleId: 'production-support', levelId: 'level-i', locationId: 'india', hourlyRate: 22, isAvailable: true },
  { roleId: 'production-support', levelId: 'level-i', locationId: 'mexico', hourlyRate: 44, isAvailable: true },
  { roleId: 'production-support', levelId: 'level-i', locationId: 'canada', hourlyRate: 70, isAvailable: true },
  
  { roleId: 'production-support', levelId: 'level-ii', locationId: 'usa', hourlyRate: 95, isAvailable: true },
  { roleId: 'production-support', levelId: 'level-ii', locationId: 'india', hourlyRate: 25, isAvailable: true },
  { roleId: 'production-support', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 62, isAvailable: true },
  { roleId: 'production-support', levelId: 'level-ii', locationId: 'canada', hourlyRate: 78, isAvailable: true },
  
  { roleId: 'production-support', levelId: 'level-iii', locationId: 'usa', hourlyRate: 105, isAvailable: true },
  { roleId: 'production-support', levelId: 'level-iii', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'production-support', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 78, isAvailable: true },
  { roleId: 'production-support', levelId: 'level-iii', locationId: 'canada', hourlyRate: 87, isAvailable: true },

  // QA Tester
  { roleId: 'qa-tester', levelId: 'level-i', locationId: 'usa', hourlyRate: 74, isAvailable: true },
  { roleId: 'qa-tester', levelId: 'level-i', locationId: 'india', hourlyRate: 21, isAvailable: true },
  { roleId: 'qa-tester', levelId: 'level-i', locationId: 'mexico', hourlyRate: 46, isAvailable: true },
  { roleId: 'qa-tester', levelId: 'level-i', locationId: 'canada', hourlyRate: 61, isAvailable: true },
  
  { roleId: 'qa-tester', levelId: 'level-ii', locationId: 'usa', hourlyRate: 83, isAvailable: true },
  { roleId: 'qa-tester', levelId: 'level-ii', locationId: 'india', hourlyRate: 23, isAvailable: true },
  { roleId: 'qa-tester', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 59, isAvailable: true },
  { roleId: 'qa-tester', levelId: 'level-ii', locationId: 'canada', hourlyRate: 69, isAvailable: true },
  
  { roleId: 'qa-tester', levelId: 'level-iii', locationId: 'usa', hourlyRate: 89, isAvailable: true },
  { roleId: 'qa-tester', levelId: 'level-iii', locationId: 'india', hourlyRate: 25, isAvailable: true },
  { roleId: 'qa-tester', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 69, isAvailable: true },
  { roleId: 'qa-tester', levelId: 'level-iii', locationId: 'canada', hourlyRate: 73, isAvailable: true },

  // QE Engineer
  { roleId: 'qe-engineer', levelId: 'level-i', locationId: 'usa', hourlyRate: 85, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-i', locationId: 'india', hourlyRate: 22.5, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-i', locationId: 'mexico', hourlyRate: 51, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-i', locationId: 'canada', hourlyRate: 73, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-i', locationId: 'romania', hourlyRate: 50, isAvailable: true },
  
  { roleId: 'qe-engineer', levelId: 'level-ii', locationId: 'usa', hourlyRate: 93, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-ii', locationId: 'india', hourlyRate: 25, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 64, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-ii', locationId: 'canada', hourlyRate: 78, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-ii', locationId: 'romania', hourlyRate: 60, isAvailable: true },
  
  { roleId: 'qe-engineer', levelId: 'level-iii', locationId: 'usa', hourlyRate: 100, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-iii', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 74, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-iii', locationId: 'canada', hourlyRate: 82, isAvailable: true },
  { roleId: 'qe-engineer', levelId: 'level-iii', locationId: 'romania', hourlyRate: 75, isAvailable: true },

  // QE Lead
  { roleId: 'qe-lead', levelId: 'level-i', locationId: 'usa', hourlyRate: 96, isAvailable: true },
  { roleId: 'qe-lead', levelId: 'level-i', locationId: 'india', hourlyRate: 25, isAvailable: true },
  { roleId: 'qe-lead', levelId: 'level-i', locationId: 'mexico', hourlyRate: 62, isAvailable: true },
  { roleId: 'qe-lead', levelId: 'level-i', locationId: 'canada', hourlyRate: 82, isAvailable: true },
  
  { roleId: 'qe-lead', levelId: 'level-ii', locationId: 'usa', hourlyRate: 103, isAvailable: true },
  { roleId: 'qe-lead', levelId: 'level-ii', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'qe-lead', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 71, isAvailable: true },
  { roleId: 'qe-lead', levelId: 'level-ii', locationId: 'canada', hourlyRate: 87, isAvailable: true },
  
  { roleId: 'qe-lead', levelId: 'level-iii', locationId: 'usa', hourlyRate: 113, isAvailable: true },
  { roleId: 'qe-lead', levelId: 'level-iii', locationId: 'india', hourlyRate: 31, isAvailable: true },
  { roleId: 'qe-lead', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 82, isAvailable: true },
  { roleId: 'qe-lead', levelId: 'level-iii', locationId: 'canada', hourlyRate: 95, isAvailable: true },

  // Release Lead
  { roleId: 'release-lead', levelId: 'level-i', locationId: 'usa', hourlyRate: 105, isAvailable: true },
  { roleId: 'release-lead', levelId: 'level-i', locationId: 'india', hourlyRate: 27, isAvailable: true },
  { roleId: 'release-lead', levelId: 'level-i', locationId: 'mexico', hourlyRate: 56, isAvailable: true },
  { roleId: 'release-lead', levelId: 'level-i', locationId: 'canada', hourlyRate: 87, isAvailable: true },
  
  { roleId: 'release-lead', levelId: 'level-ii', locationId: 'usa', hourlyRate: 113, isAvailable: true },
  { roleId: 'release-lead', levelId: 'level-ii', locationId: 'india', hourlyRate: 31, isAvailable: true },
  { roleId: 'release-lead', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 70, isAvailable: true },
  { roleId: 'release-lead', levelId: 'level-ii', locationId: 'canada', hourlyRate: 93, isAvailable: true },
  
  { roleId: 'release-lead', levelId: 'level-iii', locationId: 'usa', hourlyRate: 122, isAvailable: true },
  { roleId: 'release-lead', levelId: 'level-iii', locationId: 'india', hourlyRate: 35, isAvailable: true },
  { roleId: 'release-lead', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 113, isAvailable: true },
  { roleId: 'release-lead', levelId: 'level-iii', locationId: 'canada', hourlyRate: 101, isAvailable: true },

  // Release Train Engineer
  { roleId: 'release-train-engineer', levelId: 'level-i', locationId: 'usa', hourlyRate: 110, isAvailable: true },
  { roleId: 'release-train-engineer', levelId: 'level-i', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'release-train-engineer', levelId: 'level-i', locationId: 'mexico', hourlyRate: 58, isAvailable: true },
  { roleId: 'release-train-engineer', levelId: 'level-i', locationId: 'canada', hourlyRate: 91, isAvailable: true },
  
  { roleId: 'release-train-engineer', levelId: 'level-ii', locationId: 'usa', hourlyRate: 118, isAvailable: true },
  { roleId: 'release-train-engineer', levelId: 'level-ii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'release-train-engineer', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 72, isAvailable: true },
  { roleId: 'release-train-engineer', levelId: 'level-ii', locationId: 'canada', hourlyRate: 97, isAvailable: true },
  
  { roleId: 'release-train-engineer', levelId: 'level-iii', locationId: 'usa', hourlyRate: 128, isAvailable: true },
  { roleId: 'release-train-engineer', levelId: 'level-iii', locationId: 'india', hourlyRate: 36, isAvailable: true },
  { roleId: 'release-train-engineer', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 80, isAvailable: true },
  { roleId: 'release-train-engineer', levelId: 'level-iii', locationId: 'canada', hourlyRate: 105, isAvailable: true },

  // Salesforce Admin
  { roleId: 'salesforce-admin', levelId: 'level-i', locationId: 'usa', hourlyRate: 115, isAvailable: true },
  { roleId: 'salesforce-admin', levelId: 'level-i', locationId: 'india', hourlyRate: 25, isAvailable: true },
  
  { roleId: 'salesforce-admin', levelId: 'level-ii', locationId: 'usa', hourlyRate: 124, isAvailable: true },
  { roleId: 'salesforce-admin', levelId: 'level-ii', locationId: 'india', hourlyRate: 29, isAvailable: true },
  { roleId: 'salesforce-admin', levelId: 'level-ii', locationId: 'canada', hourlyRate: 102, isAvailable: true },
  
  { roleId: 'salesforce-admin', levelId: 'level-iii', locationId: 'usa', hourlyRate: 130, isAvailable: true },
  { roleId: 'salesforce-admin', levelId: 'level-iii', locationId: 'india', hourlyRate: 34, isAvailable: true },
  { roleId: 'salesforce-admin', levelId: 'level-iii', locationId: 'canada', hourlyRate: 107, isAvailable: true },

  // Salesforce Architect
  { roleId: 'salesforce-architect', levelId: 'level-i', locationId: 'usa', hourlyRate: 124, isAvailable: true },
  { roleId: 'salesforce-architect', levelId: 'level-i', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'salesforce-architect', levelId: 'level-i', locationId: 'canada', hourlyRate: 102, isAvailable: true },
  
  { roleId: 'salesforce-architect', levelId: 'level-ii', locationId: 'usa', hourlyRate: 136, isAvailable: true },
  { roleId: 'salesforce-architect', levelId: 'level-ii', locationId: 'india', hourlyRate: 37, isAvailable: true },
  { roleId: 'salesforce-architect', levelId: 'level-ii', locationId: 'canada', hourlyRate: 112, isAvailable: true },
  
  { roleId: 'salesforce-architect', levelId: 'level-iii', locationId: 'usa', hourlyRate: 148, isAvailable: true },
  { roleId: 'salesforce-architect', levelId: 'level-iii', locationId: 'india', hourlyRate: 42, isAvailable: true },
  { roleId: 'salesforce-architect', levelId: 'level-iii', locationId: 'canada', hourlyRate: 122, isAvailable: true },

  // Salesforce Developer
  { roleId: 'salesforce-developer', levelId: 'level-i', locationId: 'usa', hourlyRate: 112, isAvailable: true },
  { roleId: 'salesforce-developer', levelId: 'level-i', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'salesforce-developer', levelId: 'level-i', locationId: 'canada', hourlyRate: 92, isAvailable: true },
  
  { roleId: 'salesforce-developer', levelId: 'level-ii', locationId: 'usa', hourlyRate: 118, isAvailable: true },
  { roleId: 'salesforce-developer', levelId: 'level-ii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'salesforce-developer', levelId: 'level-ii', locationId: 'canada', hourlyRate: 97, isAvailable: true },
  
  { roleId: 'salesforce-developer', levelId: 'level-iii', locationId: 'usa', hourlyRate: 124, isAvailable: true },
  { roleId: 'salesforce-developer', levelId: 'level-iii', locationId: 'india', hourlyRate: 36, isAvailable: true },
  { roleId: 'salesforce-developer', levelId: 'level-iii', locationId: 'canada', hourlyRate: 102, isAvailable: true },

  // Scrum Master
  { roleId: 'scrum-master', levelId: 'level-i', locationId: 'usa', hourlyRate: 100, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-i', locationId: 'india', hourlyRate: 24, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-i', locationId: 'mexico', hourlyRate: 65, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-i', locationId: 'canada', hourlyRate: 82, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-i', locationId: 'romania', hourlyRate: 70, isAvailable: true },
  
  { roleId: 'scrum-master', levelId: 'level-ii', locationId: 'usa', hourlyRate: 110, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-ii', locationId: 'india', hourlyRate: 29, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 75, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-ii', locationId: 'canada', hourlyRate: 91, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-ii', locationId: 'romania', hourlyRate: 80, isAvailable: true },
  
  { roleId: 'scrum-master', levelId: 'level-iii', locationId: 'usa', hourlyRate: 120, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-iii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 88, isAvailable: true },
  { roleId: 'scrum-master', levelId: 'level-iii', locationId: 'canada', hourlyRate: 99, isAvailable: true },

  // System Architect
  { roleId: 'system-architect', levelId: 'level-i', locationId: 'usa', hourlyRate: 118, isAvailable: true },
  { roleId: 'system-architect', levelId: 'level-i', locationId: 'india', hourlyRate: 30, isAvailable: true },
  { roleId: 'system-architect', levelId: 'level-i', locationId: 'canada', hourlyRate: 97, isAvailable: true },
  
  { roleId: 'system-architect', levelId: 'level-ii', locationId: 'usa', hourlyRate: 128, isAvailable: true },
  { roleId: 'system-architect', levelId: 'level-ii', locationId: 'india', hourlyRate: 35, isAvailable: true },
  { roleId: 'system-architect', levelId: 'level-ii', locationId: 'canada', hourlyRate: 105, isAvailable: true },
  
  { roleId: 'system-architect', levelId: 'level-iii', locationId: 'usa', hourlyRate: 136, isAvailable: true },
  { roleId: 'system-architect', levelId: 'level-iii', locationId: 'india', hourlyRate: 40, isAvailable: true },
  { roleId: 'system-architect', levelId: 'level-iii', locationId: 'canada', hourlyRate: 112, isAvailable: true },

  // Technical Product Owner
  { roleId: 'technical-product-owner', levelId: 'level-i', locationId: 'usa', hourlyRate: 112, isAvailable: true },
  { roleId: 'technical-product-owner', levelId: 'level-i', locationId: 'india', hourlyRate: 26, isAvailable: true },
  { roleId: 'technical-product-owner', levelId: 'level-i', locationId: 'mexico', hourlyRate: 65, isAvailable: true },
  { roleId: 'technical-product-owner', levelId: 'level-i', locationId: 'canada', hourlyRate: 95, isAvailable: true },
  
  { roleId: 'technical-product-owner', levelId: 'level-ii', locationId: 'usa', hourlyRate: 123, isAvailable: true },
  { roleId: 'technical-product-owner', levelId: 'level-ii', locationId: 'india', hourlyRate: 30, isAvailable: true },
  { roleId: 'technical-product-owner', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 76, isAvailable: true },
  { roleId: 'technical-product-owner', levelId: 'level-ii', locationId: 'canada', hourlyRate: 103, isAvailable: true },
  
  { roleId: 'technical-product-owner', levelId: 'level-iii', locationId: 'usa', hourlyRate: 134, isAvailable: true },
  { roleId: 'technical-product-owner', levelId: 'level-iii', locationId: 'india', hourlyRate: 33, isAvailable: true },
  { roleId: 'technical-product-owner', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 90, isAvailable: true },
  { roleId: 'technical-product-owner', levelId: 'level-iii', locationId: 'canada', hourlyRate: 111, isAvailable: true },

  // Technical Solution Analyst
  { roleId: 'technical-solution-analyst', levelId: 'level-i', locationId: 'usa', hourlyRate: 105, isAvailable: true },
  { roleId: 'technical-solution-analyst', levelId: 'level-i', locationId: 'india', hourlyRate: 26, isAvailable: true },
  { roleId: 'technical-solution-analyst', levelId: 'level-i', locationId: 'mexico', hourlyRate: 48, isAvailable: true },
  { roleId: 'technical-solution-analyst', levelId: 'level-i', locationId: 'canada', hourlyRate: 87, isAvailable: true },
  
  { roleId: 'technical-solution-analyst', levelId: 'level-ii', locationId: 'usa', hourlyRate: 115, isAvailable: true },
  { roleId: 'technical-solution-analyst', levelId: 'level-ii', locationId: 'india', hourlyRate: 29, isAvailable: true },
  { roleId: 'technical-solution-analyst', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 67, isAvailable: true },
  { roleId: 'technical-solution-analyst', levelId: 'level-ii', locationId: 'canada', hourlyRate: 95, isAvailable: true },
  
  { roleId: 'technical-solution-analyst', levelId: 'level-iii', locationId: 'usa', hourlyRate: 125, isAvailable: true },
  { roleId: 'technical-solution-analyst', levelId: 'level-iii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'technical-solution-analyst', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 86, isAvailable: true },
  { roleId: 'technical-solution-analyst', levelId: 'level-iii', locationId: 'canada', hourlyRate: 103, isAvailable: true },

  // UX/UI Designer
  { roleId: 'ux-ui-designer', levelId: 'level-i', locationId: 'usa', hourlyRate: 120, isAvailable: true },
  { roleId: 'ux-ui-designer', levelId: 'level-i', locationId: 'india', hourlyRate: 25, isAvailable: true },
  { roleId: 'ux-ui-designer', levelId: 'level-i', locationId: 'mexico', hourlyRate: 52, isAvailable: true },
  { roleId: 'ux-ui-designer', levelId: 'level-i', locationId: 'canada', hourlyRate: 99, isAvailable: true },
  
  { roleId: 'ux-ui-designer', levelId: 'level-ii', locationId: 'usa', hourlyRate: 130, isAvailable: true },
  { roleId: 'ux-ui-designer', levelId: 'level-ii', locationId: 'india', hourlyRate: 28, isAvailable: true },
  { roleId: 'ux-ui-designer', levelId: 'level-ii', locationId: 'mexico', hourlyRate: 72, isAvailable: true },
  { roleId: 'ux-ui-designer', levelId: 'level-ii', locationId: 'canada', hourlyRate: 107, isAvailable: true },
  
  { roleId: 'ux-ui-designer', levelId: 'level-iii', locationId: 'usa', hourlyRate: 138, isAvailable: true },
  { roleId: 'ux-ui-designer', levelId: 'level-iii', locationId: 'india', hourlyRate: 32, isAvailable: true },
  { roleId: 'ux-ui-designer', levelId: 'level-iii', locationId: 'mexico', hourlyRate: 105, isAvailable: true },
  { roleId: 'ux-ui-designer', levelId: 'level-iii', locationId: 'canada', hourlyRate: 114, isAvailable: true },

  // Transformation Lead
  { roleId: 'transformation-lead', levelId: 'level-i', locationId: 'usa', hourlyRate: 335, isAvailable: true },
  { roleId: 'transformation-lead', levelId: 'level-i', locationId: 'india', hourlyRate: 85, isAvailable: true },

  // Enterprise Architect - Telecom (Updated rates)
  { roleId: 'enterprise-architect-telecom', levelId: 'level-ii', locationId: 'usa', hourlyRate: 245, isAvailable: true },
  { roleId: 'enterprise-architect-telecom', levelId: 'level-ii', locationId: 'india', hourlyRate: 70, isAvailable: true },

  // Business Value Management Expert (Updated rates)
  { roleId: 'business-value-management-expert', levelId: 'level-iii', locationId: 'usa', hourlyRate: 335, isAvailable: true },
  { roleId: 'business-value-management-expert', levelId: 'level-iii', locationId: 'india', hourlyRate: 85, isAvailable: true },

  // Enterprise SAFe Agile Coach (Updated rates)
  { roleId: 'enterprise-safe-agile-coach', levelId: 'level-i', locationId: 'usa', hourlyRate: 195, isAvailable: true },
  { roleId: 'enterprise-safe-agile-coach', levelId: 'level-i', locationId: 'india', hourlyRate: 55, isAvailable: true },

  // Engagement Program Director (Updated rates)
  { roleId: 'engagement-program-director', levelId: 'level-ii', locationId: 'usa', hourlyRate: 235, isAvailable: true },

  // Innovation Evangelist - Updated rates
  { roleId: 'innovation-evangelist', levelId: 'level-ii', locationId: 'usa', hourlyRate: 205, isAvailable: true },
  { roleId: 'innovation-evangelist', levelId: 'level-ii', locationId: 'india', hourlyRate: 58, isAvailable: true },

  // Gen AI Enterprise Architect - New location rates
  { roleId: 'gen-ai-enterprise-architect', levelId: 'level-iii', locationId: 'usa', hourlyRate: 245, isAvailable: true },
  { roleId: 'gen-ai-enterprise-architect', levelId: 'level-iii', locationId: 'india', hourlyRate: 70, isAvailable: true },

  // OCM - New location rates
  { roleId: 'ocm', levelId: 'level-i', locationId: 'usa', hourlyRate: 250, isAvailable: true },
  { roleId: 'ocm', levelId: 'level-i', locationId: 'india', hourlyRate: 75, isAvailable: true }
];

// Backward compatibility - generate combined roles for existing components
export const SAMPLE_ROLES: Role[] = BASE_ROLES.flatMap(baseRole =>
  ROLE_LEVEL_RATES
    .filter(rate => rate.roleId === baseRole.id && rate.isAvailable)
    .map(rate => {
      const level = LEVELS.find(l => l.id === rate.levelId);
      return {
        id: `${baseRole.id}-${rate.levelId}`,
        name: `${level?.name} ${baseRole.name}`,
        level: level?.name || '',
        hourlyRate: rate.hourlyRate,
        category: baseRole.category
      };
    })
);

// Simplified locations - countries only
export const SAMPLE_LOCATIONS: Location[] = [
  {
    id: 'usa',
    name: 'USA',
    country: 'USA',
    valueStream: 'Global Operations',
    art: 'North America ART',
    scrumTeam: 'US Development Team',
    costMultiplier: 1.0 // Base rate
  },
  {
    id: 'india',
    name: 'India',
    country: 'India',
    valueStream: 'Global Operations',
    art: 'Asia Pacific ART',
    scrumTeam: 'India Development Team',
    costMultiplier: 0.25 // 25% of US rate
  },
  {
    id: 'canada',
    name: 'Canada',
    country: 'Canada',
    valueStream: 'Global Operations',
    art: 'North America ART',
    scrumTeam: 'Canada Development Team',
    costMultiplier: 0.85 // 85% of US rate
  },
  {
    id: 'mexico',
    name: 'Mexico',
    country: 'Mexico',
    valueStream: 'Global Operations',
    art: 'Latin America ART',
    scrumTeam: 'Mexico Development Team',
    costMultiplier: 0.65 // 65% of US rate
  },
  {
    id: 'romania',
    name: 'Romania',
    country: 'Romania',
    valueStream: 'Global Operations',
    art: 'Europe ART',
    scrumTeam: 'Romania Development Team',
    costMultiplier: 0.75 // 75% of US rate
  }
];

// Helper functions for location-based rates
export const getLocationBasedRate = (roleId: string, levelId: string, locationId: string): number => {
  const rate = LOCATION_BASED_RATES.find(r => 
    r.roleId === roleId && r.levelId === levelId && r.locationId === locationId
  );
  return rate?.hourlyRate || 0;
};

export const isLocationBasedRateAvailable = (roleId: string, levelId: string, locationId: string): boolean => {
  const rate = LOCATION_BASED_RATES.find(r => 
    r.roleId === roleId && r.levelId === levelId && r.locationId === locationId
  );
  return rate?.isAvailable || false;
};

// Legacy helper functions (for backward compatibility)
export const getRoleRate = (roleId: string, levelId: string): number => {
  const rate = ROLE_LEVEL_RATES.find(r => r.roleId === roleId && r.levelId === levelId);
  return rate?.hourlyRate || 0;
};

export const isRoleLevelAvailable = (roleId: string, levelId: string): boolean => {
  const rate = ROLE_LEVEL_RATES.find(r => r.roleId === roleId && r.levelId === levelId);
  return rate?.isAvailable || false;
};

export const getAvailableLevelsForRole = (roleId: string): Level[] => {
  const availableRates = ROLE_LEVEL_RATES.filter(r => r.roleId === roleId && r.isAvailable);
  return LEVELS.filter(level => availableRates.some(rate => rate.levelId === level.id))
                .sort((a, b) => a.order - b.order);
};

export const getAvailableRolesForLevel = (levelId: string): BaseRole[] => {
  const availableRates = ROLE_LEVEL_RATES.filter(r => r.levelId === levelId && r.isAvailable);
  return BASE_ROLES.filter(role => availableRates.some(rate => rate.roleId === role.id));
};

// Export arrays for convenience
export const VALUE_STREAMS = ['ECLC', 'Acq', 'O&D', 'B&P'];
export const ARTS = [
  'Assisted Sales',
  'Digital Sales', 
  'Billing OTC & Middleware ART',
  'Content Payment & Commissions ART',
  'Agent & Field Care services',
  'Self-Care & Identity Management',
  'Traditional Agent Care',
  'DTV via Satellite',
  'DTV via Internet & BYOD',
  'Customer Graph'
];
export const SCRUM_TEAMS = [
  'Gladiators',
  'Legends',
  'Legends Stream',
  'VPM-DTVi',
  'VPM-DTVs',
  'VPM ECL',
  'OPE OG',
  'Cash Cow',
  'Digital MuleSoft',
  'Himalayas',
  'Mewtwo',
  'WatchdatVideo',
  'Titans',
  'CPM-SPARKS',
  'CPM-Payments',
  'Middleware EI (NGM/ICAN) & Middleware Mule',
  'Middleware DTVMW Mulesoft Migration',
  'Content Payment Core & Enterprise',
  'DTV360 Services',
  'Tech Care 1 - Agent',
  'Tech Care 2 - Self Care',
  'Spark',
  'Ariane',
  'Ariane MFR',
  'Service Champion',
  'Digital BAU',
  'IDP Service Warriors/DTV Comms',
  'Porta',
  'DTV Sales Java',
  'DTV Sales SF',
  'RIO',
  'Jarvis C3 & EPOCH – Satellite',
  'TAOS - Satellite',
  'DTVs Decisioning (Pega) Satellite',
  'DTVs Decisioning(Mule) Satellite',
  'Avengers (EPOCH Stream) Internet',
  'DTVs Decisioning (Pega) Internet',
  'DTVs Decisioning(AMES-M1) Internet',
  'DTVCC'
];
export const COUNTRIES = Array.from(new Set(SAMPLE_LOCATIONS.map(loc => loc.country)));
export const ROLE_CATEGORIES = Array.from(new Set(BASE_ROLES.map(role => role.category)));
export const ROLE_LEVELS = LEVELS.map(level => level.name); 