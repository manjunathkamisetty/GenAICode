export interface BaseRole {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface Level {
  id: string;
  name: string;
  order: number; // For sorting (1 = Trainee, 2 = Junior, etc.)
  description?: string;
}

export interface RoleLevelRate {
  roleId: string;
  levelId: string;
  hourlyRate: number;
  isAvailable: boolean; // Some role-level combinations might not exist
}

// Enhanced rate structure that includes location-specific rates
export interface LocationBasedRate {
  roleId: string;
  levelId: string;
  locationId: string;
  hourlyRate: number;
  isAvailable: boolean;
}

export interface Role {
  id: string;
  name: string;
  level: string;
  hourlyRate: number;
  category: string;
}

export interface Location {
  id: string;
  name: string;
  country: string;
  valueStream: string;
  art: string; // Agile Release Train
  scrumTeam: string;
  costMultiplier: number; // Factor to adjust costs based on location
}

export interface ResourceConfig {
  role: Role;
  location: Location;
  count: number; // Number of resources
  hoursPerMonth: number;
}

export interface EnhancedResourceConfig {
  baseRole: BaseRole;
  level: Level;
  location: Location;
  count: number;
  hoursPerMonth: number;
  hourlyRate: number; // Calculated from role-level combination
}

export interface RoleConfiguration {
  id: string;
  name: string;
  currentConfig: ResourceConfig;
  targetConfig: ResourceConfig;
}

export interface EnhancedRoleConfiguration {
  id: string;
  name: string;
  currentConfig: EnhancedResourceConfig;
  targetConfig: EnhancedResourceConfig;
}

export interface MultiRoleScenario {
  id: string;
  name: string;
  roleConfigurations: RoleConfiguration[];
  durationMonths: number;
}

export interface EnhancedMultiRoleScenario {
  id: string;
  name: string;
  roleConfigurations: EnhancedRoleConfiguration[];
  durationMonths: number;
}

export interface CPScenario {
  id: string;
  name: string;
  currentConfig: ResourceConfig;
  targetConfig: ResourceConfig;
  durationMonths: number;
}

export interface SavingsCalculation {
  // Hourly calculations
  currentHourlyCost: number;
  targetHourlyCost: number;
  hourlySavings: number;
  
  // Monthly calculations  
  currentMonthlyCost: number;
  targetMonthlyCost: number;
  monthlySavings: number;
  
  // Yearly calculations
  currentYearlyCost: number;
  targetYearlyCost: number;
  yearlySavings: number;
  
  // Total savings over project duration
  totalProjectSavings: number;
  savingsPercentage: number;
  paybackPeriod?: number;
}

export interface RoleConfigurationResult {
  roleConfiguration: RoleConfiguration;
  savings: SavingsCalculation;
  additionalMetrics: {
    productivityGain?: number;
    qualityImprovement?: number;
    riskReduction?: number;
  };
}

export interface MultiRoleSimulationResult {
  scenario: MultiRoleScenario;
  roleResults: RoleConfigurationResult[];
  totalSavings: SavingsCalculation;
  aggregatedMetrics: {
    averageProductivityGain: number;
    averageQualityImprovement: number;
    averageRiskReduction: number;
  };
}

export interface CPSimulationResult {
  scenario: CPScenario;
  savings: SavingsCalculation;
  additionalMetrics: {
    productivityGain?: number;
    qualityImprovement?: number;
    riskReduction?: number;
  };
} 