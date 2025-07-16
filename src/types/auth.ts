// Import academic configuration
import {
  currentAcademicConfig,
  generateBranchEnum,
  generateYearEnum,
} from "@/config/academic";

// Generate enums from configuration
const branchValues = generateBranchEnum(currentAcademicConfig);
const yearValues = generateYearEnum(currentAcademicConfig);

// Create runtime enums from configuration
export const Branch = branchValues as Record<string, string>;
export const YearOfStudy = yearValues as Record<string, string>;

// Create types from the configuration
export type BranchType = keyof typeof branchValues;
export type YearOfStudyType = keyof typeof yearValues;

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isRegistered: boolean;
  isAdmin: boolean;
  registrationData?: UserRegistration;
}

export interface UserRegistration {
  name: string;
  email: string;
  orgId: string;
  gecIdCardUrl: string;
  rollNumber: string;
  branch: BranchType;
  yearOfStudy: YearOfStudyType;
  createdAt: Date;
  updatedAt: Date;
  validationStatus: ValidationStatus;
  validatedBy?: string;
  validatedAt?: Date;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  orgId: string;
  gecIdCard: File | null;
  rollNumber: string;
  branch: BranchType;
  yearOfStudy: YearOfStudyType;
}

export interface RegistrationFormErrors {
  name?: string;
  email?: string;
  orgId?: string;
  gecIdCard?: string;
  rollNumber?: string;
  branch?: string;
  yearOfStudy?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  permissions: AdminPermission[];
  createdAt: Date;
}

export enum ValidationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum AdminRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

export enum AdminPermission {
  VALIDATE_USERS = "validate_users",
  MANAGE_ADMINS = "manage_admins",
  VIEW_ANALYTICS = "view_analytics",
  EXPORT_DATA = "export_data",
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  status: ContactStatus;
  readAt?: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export enum ContactStatus {
  UNREAD = "unread",
  READ = "read",
  RESOLVED = "resolved",
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRegistration: (data: UserRegistration) => Promise<void>;
  updateUserProfile: (updates: Partial<UserRegistration>) => Promise<void>;
}

// Custom Forms Types
export interface CustomForm {
  id: string;
  title: string;
  description: string;
  status: FormStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  customFields: CustomField[];
  submissions?: number;
}

export interface CustomField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  order: number;
}

export interface FormSubmission {
  id: string;
  formId: string;
  userId: string;
  name: string;
  email: string;
  branch: BranchType;
  yearOfStudy: YearOfStudyType;
  orgId: string;
  phoneNumber: string;
  agreedToTerms: boolean;
  customResponses: Record<string, string | number>;
  submittedAt: Date;
}

export interface FormBuilderData {
  title: string;
  description: string;
  customFields: Omit<CustomField, "id">[];
}

export interface FormSubmissionData {
  name: string;
  email: string;
  branch: BranchType;
  yearOfStudy: YearOfStudyType;
  orgId: string;
  phoneNumber: string;
  agreedToTerms: boolean;
  customResponses: Record<string, string | number>;
}

export enum FormStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
}

// App Settings Types
export interface AppSettings {
  id: string;
  alloworgIdEdits: boolean;
  allowUserRegistration: boolean;
  allowContactForm: boolean;
  allowPublicFormAccess: boolean;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
}

export interface AppSettingsUpdate {
  alloworgIdEdits?: boolean;
  allowUserRegistration?: boolean;
  allowContactForm?: boolean;
  allowPublicFormAccess?: boolean;
  maintenanceMode?: boolean;
}
