import { 
  MultiRoleScenario, 
  RoleConfiguration, 
  MultiRoleSimulationResult, 
  RoleConfigurationResult,
  SavingsCalculation,
  ResourceConfig
} from '../types';
import { CalculationService } from './calculationService';

export class MultiRoleCalculationService {
  static simulateMultiRoleScenario(scenario: MultiRoleScenario): MultiRoleSimulationResult {
    // Calculate results for each role configuration
    const roleResults: RoleConfigurationResult[] = scenario.roleConfigurations
      .filter(config => this.isConfigurationComplete(config))
      .map(config => this.calculateRoleConfigurationResult(config, scenario.durationMonths));

    // Calculate total savings across all configurations
    const totalSavings = this.calculateTotalSavings(roleResults, scenario.durationMonths);

    // Calculate aggregated metrics
    const aggregatedMetrics = this.calculateAggregatedMetrics(roleResults);

    return {
      scenario,
      roleResults,
      totalSavings,
      aggregatedMetrics
    };
  }

  private static isConfigurationComplete(config: RoleConfiguration): boolean {
    const isCurrentComplete = !!(
      config.currentConfig.role && 
      config.currentConfig.location && 
      config.currentConfig.count && 
      config.currentConfig.hoursPerMonth
    );
    
    const isTargetComplete = !!(
      config.targetConfig.role && 
      config.targetConfig.location && 
      config.targetConfig.count && 
      config.targetConfig.hoursPerMonth
    );

    return isCurrentComplete && isTargetComplete;
  }

  private static calculateRoleConfigurationResult(
    roleConfig: RoleConfiguration, 
    durationMonths: number
  ): RoleConfigurationResult {
    // Create a scenario for this specific role configuration
    const scenario = {
      id: roleConfig.id,
      name: roleConfig.name,
      currentConfig: roleConfig.currentConfig,
      targetConfig: roleConfig.targetConfig,
      durationMonths
    };

    // Use the existing calculation service
    const result = CalculationService.simulateScenario(scenario);

    return {
      roleConfiguration: roleConfig,
      savings: result.savings,
      additionalMetrics: result.additionalMetrics
    };
  }

  private static calculateTotalSavings(
    roleResults: RoleConfigurationResult[], 
    durationMonths: number
  ): SavingsCalculation {
    if (roleResults.length === 0) {
      return this.createEmptySavingsCalculation();
    }

    // Sum up all the savings across configurations
    const totalCurrentHourlyCost = roleResults.reduce(
      (sum, result) => sum + result.savings.currentHourlyCost, 0
    );
    const totalTargetHourlyCost = roleResults.reduce(
      (sum, result) => sum + result.savings.targetHourlyCost, 0
    );
    const totalCurrentMonthlyCost = roleResults.reduce(
      (sum, result) => sum + result.savings.currentMonthlyCost, 0
    );
    const totalTargetMonthlyCost = roleResults.reduce(
      (sum, result) => sum + result.savings.targetMonthlyCost, 0
    );
    const totalCurrentYearlyCost = roleResults.reduce(
      (sum, result) => sum + result.savings.currentYearlyCost, 0
    );
    const totalTargetYearlyCost = roleResults.reduce(
      (sum, result) => sum + result.savings.targetYearlyCost, 0
    );

    const hourlySavings = totalCurrentHourlyCost - totalTargetHourlyCost;
    const monthlySavings = totalCurrentMonthlyCost - totalTargetMonthlyCost;
    const yearlySavings = totalCurrentYearlyCost - totalTargetYearlyCost;
    const totalProjectSavings = monthlySavings * durationMonths;
    const savingsPercentage = totalCurrentMonthlyCost > 0 ? 
      (monthlySavings / totalCurrentMonthlyCost) * 100 : 0;

    return {
      currentHourlyCost: totalCurrentHourlyCost,
      targetHourlyCost: totalTargetHourlyCost,
      hourlySavings,
      currentMonthlyCost: totalCurrentMonthlyCost,
      targetMonthlyCost: totalTargetMonthlyCost,
      monthlySavings,
      currentYearlyCost: totalCurrentYearlyCost,
      targetYearlyCost: totalTargetYearlyCost,
      yearlySavings,
      totalProjectSavings,
      savingsPercentage,
      paybackPeriod: monthlySavings > 0 ? 1 : undefined
    };
  }

  private static createEmptySavingsCalculation(): SavingsCalculation {
    return {
      currentHourlyCost: 0,
      targetHourlyCost: 0,
      hourlySavings: 0,
      currentMonthlyCost: 0,
      targetMonthlyCost: 0,
      monthlySavings: 0,
      currentYearlyCost: 0,
      targetYearlyCost: 0,
      yearlySavings: 0,
      totalProjectSavings: 0,
      savingsPercentage: 0,
      paybackPeriod: undefined
    };
  }

  private static calculateAggregatedMetrics(roleResults: RoleConfigurationResult[]) {
    if (roleResults.length === 0) {
      return {
        averageProductivityGain: 0,
        averageQualityImprovement: 0,
        averageRiskReduction: 0
      };
    }

    const totalProductivityGain = roleResults.reduce(
      (sum, result) => sum + (result.additionalMetrics.productivityGain || 0), 0
    );
    const totalQualityImprovement = roleResults.reduce(
      (sum, result) => sum + (result.additionalMetrics.qualityImprovement || 0), 0
    );
    const totalRiskReduction = roleResults.reduce(
      (sum, result) => sum + (result.additionalMetrics.riskReduction || 0), 0
    );

    return {
      averageProductivityGain: totalProductivityGain / roleResults.length,
      averageQualityImprovement: totalQualityImprovement / roleResults.length,
      averageRiskReduction: totalRiskReduction / roleResults.length
    };
  }

  static formatCurrency(amount: number): string {
    return CalculationService.formatCurrency(amount);
  }

  static formatPercentage(percentage: number): string {
    return CalculationService.formatPercentage(percentage);
  }

  // Helper method to get summary statistics
  static getSummaryStatistics(result: MultiRoleSimulationResult) {
    return {
      totalConfigurations: result.scenario.roleConfigurations.length,
      completeConfigurations: result.roleResults.length,
      totalResourcesCurrent: result.roleResults.reduce(
        (sum, r) => sum + r.roleConfiguration.currentConfig.count, 0
      ),
      totalResourcesTarget: result.roleResults.reduce(
        (sum, r) => sum + r.roleConfiguration.targetConfig.count, 0
      ),
      averageSavingsPerRole: result.roleResults.length > 0 ? 
        result.totalSavings.monthlySavings / result.roleResults.length : 0
    };
  }
} 