export type LandUnit =
  | 'shotok'
  | 'katha'
  | 'bigha'
  | 'acre'
  | 'sqft'
  | 'hectare'
  | 'sqmeter'
  | 'sqyd'
  | 'chhatak'
  | 'kani_ctg'
  | 'kani_tripura'
  | 'keyar'
  | 'gonda'
  | 'kora'
  | 'kranti'
  | 'til';

export interface CalculationRecord {
  id: string;
  unit: LandUnit;
  unitLabel: string;
  inputValue: number;
  shotok: number;
  sqft: number;
  katha: number;
  bigha: number;
  acre: number;
  timestamp: number;
  note?: string;
}

export type ShapeType = 'rect' | 'irregular_avg' | 'irregular_heron' | 'triangle' | 'circle';

export interface FarayezInput {
  totalLand: number;
  unit: 'shotok' | 'katha' | 'bigha';
  deceasedGender: 'male' | 'female';
  hasSpouse: boolean;
  spouseCount: number;
  sons: number;
  daughters: number;
  fatherAlive: boolean;
  motherAlive: boolean;
  brothers: number;
  sisters: number;
  landValuePerShotok?: number;
}

export interface FarayezShareResult {
  relation: string;
  count: number;
  shareFraction: string;
  percentage: number;
  landAmount: number; // in shotok
  amountPerPerson: number;
  sqftTotal: number;
  monetaryValue?: number;
}

export interface PartnerDivision {
  id: string;
  name: string;
  percentage?: number;
  ratio?: number;
  calculatedShotok?: number;
  calculatedSqft?: number;
}

export type DeedType = 'saf_kabala' | 'heba_blood' | 'batwara' | 'danpotro' | 'mortgage';
export type AreaRegion = 'city_corp' | 'municipality' | 'union_parishad';

export interface RegistrationFeeResult {
  stampDuty: number;
  registrationFee: number;
  localGovtTax: number;
  aitSourceTax: number;
  affidavitFee: number;
  eFee: number;
  totalCost: number;
  percentageOfValue: number;
}
