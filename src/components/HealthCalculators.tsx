/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Central exports registry for all 10 CalcNova Health Calculators

export {
  BMICalculator,
  BMRCalculator,
  BodyFatCalculator,
  IdealWeightCalculator
} from './health/BodyFitnessCalculators';

export {
  CaloriesCalculator,
  WaterIntakeCalculator
} from './health/DietHydrationCalculators';

export {
  HeartRateCalculator,
  BACCalculator
} from './health/VitalsCalculators';

export {
  PregnancyCalculator,
  OvulationCalculator
} from './health/FamilyCalculators';
