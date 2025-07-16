// Academic Configuration
// Customize this file to match your institution's academic structure

export interface AcademicBranch {
  value: string;
  label: string;
  code?: string;
}

export interface AcademicYear {
  value: string;
  label: string;
  order: number;
}

// Default Engineering College Configuration
export const engineeringCollegeConfig = {
  branches: [
    { value: "COMPUTER_SCIENCE", label: "Computer Science", code: "CS" },
    {
      value: "ELECTRONICS_TELECOMMUNICATIONS",
      label: "Electronics & Telecommunications",
      code: "ENTC",
    },
    { value: "ELECTRICAL", label: "Electrical & Electronics", code: "EE" },
    { value: "MECHANICAL", label: "Mechanical", code: "MECH" },
    { value: "CIVIL", label: "Civil", code: "CIVIL" },
    {
      value: "INFORMATION_TECHNOLOGY",
      label: "Information Technology",
      code: "IT",
    },
    { value: "VLSI", label: "VLSI Design", code: "VLSI" },
  ] as AcademicBranch[],

  years: [
    { value: "FIRST_YEAR", label: "1st Year (FE)", order: 1 },
    { value: "SECOND_YEAR", label: "2nd Year (SE)", order: 2 },
    { value: "THIRD_YEAR", label: "3rd Year (TE)", order: 3 },
    { value: "FINAL_YEAR", label: "4th Year (BE)", order: 4 },
  ] as AcademicYear[],
};

// Alternative University Configuration (4-year program)
export const universityConfig = {
  branches: [
    { value: "COMPUTER_SCIENCE", label: "Computer Science", code: "CS" },
    {
      value: "INFORMATION_TECHNOLOGY",
      label: "Information Technology",
      code: "IT",
    },
    {
      value: "SOFTWARE_ENGINEERING",
      label: "Software Engineering",
      code: "SE",
    },
    { value: "ELECTRICAL", label: "Electrical Engineering", code: "EE" },
    { value: "MECHANICAL", label: "Mechanical Engineering", code: "ME" },
    { value: "CIVIL", label: "Civil Engineering", code: "CE" },
  ] as AcademicBranch[],

  years: [
    { value: "FRESHMAN", label: "Freshman", order: 1 },
    { value: "SOPHOMORE", label: "Sophomore", order: 2 },
    { value: "JUNIOR", label: "Junior", order: 3 },
    { value: "SENIOR", label: "Senior", order: 4 },
  ] as AcademicYear[],
};

// Technical Institute Configuration (3-year diploma)
export const technicalInstituteConfig = {
  branches: [
    { value: "COMPUTER_TECHNOLOGY", label: "Computer Technology", code: "CT" },
    { value: "ELECTRONICS", label: "Electronics Engineering", code: "EE" },
    { value: "MECHANICAL", label: "Mechanical Engineering", code: "ME" },
    { value: "ELECTRICAL", label: "Electrical Engineering", code: "EL" },
    { value: "CIVIL", label: "Civil Engineering", code: "CE" },
  ] as AcademicBranch[],

  years: [
    { value: "FIRST_YEAR", label: "1st Year", order: 1 },
    { value: "SECOND_YEAR", label: "2nd Year", order: 2 },
    { value: "THIRD_YEAR", label: "3rd Year", order: 3 },
  ] as AcademicYear[],
};

// Configuration selector based on institution type
export const getAcademicConfig = (
  institutionType: string = "engineering_college",
) => {
  switch (institutionType) {
    case "university":
      return universityConfig;
    case "technical_institute":
      return technicalInstituteConfig;
    case "engineering_college":
    default:
      return engineeringCollegeConfig;
  }
};

// Export current configuration (change this to match your institution)
export const currentAcademicConfig = getAcademicConfig(
  process.env.NEXT_PUBLIC_INSTITUTION_TYPE || "engineering_college",
);

// Helper functions to generate enums from configuration
export const generateBranchEnum = (config: typeof engineeringCollegeConfig) => {
  return config.branches.reduce(
    (acc, branch) => {
      acc[branch.value] = branch.label;
      return acc;
    },
    {} as Record<string, string>,
  );
};

export const generateYearEnum = (config: typeof engineeringCollegeConfig) => {
  return config.years.reduce(
    (acc, year) => {
      acc[year.value] = year.label;
      return acc;
    },
    {} as Record<string, string>,
  );
};
