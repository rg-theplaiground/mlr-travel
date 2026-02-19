
import { LucideIcon } from 'lucide-react';

export enum OnboardingStep {
  ROLE_SELECTION = 0,
  EMAIL_ENTRY = 1,
  ACCOUNT_DETAILS = 2,
  COMPLETION = 3
}

export interface UserRoleOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
}

export interface UserData {
  role: string | null;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
}

export interface Passport {
  id: string;
  issuingCountry: string;
  citizenshipCountry: string;
  number: string;
  issueDate: string;
  expirationDate: string;
}

export interface TravelerProfile {
  legalFirstName: string;
  legalMiddleName: string;
  legalLastName: string;
  suffix: string;
  gender: string;
  birthdate: string;
  mobileCountryCode: string;
  mobileNumber: string;
  ktnNumber: string;
  redressNumber: string;
  seatPreference: string;
  specialMeal: string;
  specialAssistance: string;
  homeAirport: string;
  passports: Passport[];
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  city: string;
  date: string;
  venue: string;
  image: string;
  priceStart: number;
}

export type AppView = 'onboarding' | 'dashboard' | 'profile' | 'booking' | 'checkout' | 'match-booking';
export type ProfileTab = 'traveler-info' | 'loyalty-programs' | 'payment-methods' | 'contact-info' | 'rewards';
