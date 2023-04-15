import { Industry, Locations, Position } from "api/Companies";
import { Programme } from "api/Students";

export const POSITIONS = [
  { label: "Thesis", value: Position.Thesis },
  { label: "Trainee Employment", value: Position.TraineeEmployment },
  { label: "Internship", value: Position.Internship },
  { label: "Summer job", value: Position.SummerJob },
  { label: "Foreign opportunity", value: Position.ForeignOppurtunity },
  { label: "Part time", value: Position.PartTime },
];

export const INDUSTRIES = [
  { label: "Electricity/energy/power", value: Industry.ElectricityEnergyPower },
  { label: "Environment", value: Industry.Environment },
  { label: "Banking/finance", value: Industry.BankingFinance },
  { label: "Union", value: Industry.Union },
  { label: "Investment", value: Industry.Investment },
  { label: "Insurance", value: Industry.Insurance },
  { label: "Recruitment", value: Industry.Recruitment },
  { label: "Construction", value: Industry.Construction },
  { label: "Architecture", value: Industry.Architecture },
  { label: "Graphic design", value: Industry.GraphicDesign },
  { label: "Data/IT", value: Industry.DataIT },
  { label: "Finance consultancy", value: Industry.FinanceConsultancy },
  { label: "Telecommunication", value: Industry.Telecommunication },
  { label: "Consulting", value: Industry.Consulting },
  { label: "Management", value: Industry.Management },
  { label: "Media", value: Industry.Media },
  { label: "Industry", value: Industry.Industry },
  { label: "Nuclear power", value: Industry.NuclearPower },
  { label: "Life science", value: Industry.LifeScience },
  { label: "Medical techniques", value: Industry.MedicalTechniques },
  { label: "Property infrastructure", value: Industry.PropertyInfrastructure },
  { label: "Research", value: Industry.Research },
  { label: "Coaching", value: Industry.Coaching },
];

export const PROGRAMS = [
  { label: "A", value: 100 },
  { label: "D", value: 101 },
  { label: "E", value: 102 },
  { label: "F", value: 103 },
  { label: "I", value: 104 },
  { label: "ING", value: 105 },
  { label: "K", value: 106 },
  { label: "M", value: 107 },
  { label: "V", value: 108 },
  { label: "W", value: 109 },
  { label: "Fire Protection Engineering", value: Programme.Fire_engineer },
  {
    label: "Mechanical Engineering with Technical Design",
    value: Programme.Mechanical_engineering_with_technical_design,
  },
  { label: "Electrical Engineering", value: Programme.Electrical_engineering },
  { label: "Environmental Engineering", value: Programme.Ecological_engineering },
  { label: "Mechanical Engineering", value: Programme.Mechanical_engineering },
  { label: "Engineering Nanoscience", value: Programme.Engineering_Nanoscience },
  { label: "Engineering Biotechnology", value: Programme.Engineering_Biotechnology },
  { label: "Industrial Design", value: Programme.Industrial_design },
  { label: "Architecture", value: Programme.Architecture },
  {
    label: "Engineering Information and Communication",
    value: Programme.Engineering_Information_and_comunication,
  },
  { label: "Chemical Engineering", value: Programme.Chemical_engineering },
  {
    label: "Construction and Railway Construction",
    value: Programme.Construction_and_Railway_construction,
  },
  { label: "Civil Engineering", value: Programme.Road_and_Water_construction },
  { label: "Construction and Architecture", value: Programme.Construction_and_architecture },
  { label: "Industrial Economics", value: Programme.Industrial_economics },
  { label: "Engineering Mathematics", value: Programme.Engineering_Mathematics },
  { label: "Biomedical Engineering", value: Programme.Medical_engineering },
  { label: "Land Surveying", value: Programme.Land_surveying },
  { label: "Computer Science and Engineering", value: Programme.Computer_Software_engineering },
  { label: "Engineering Physics", value: Programme.Engineering_Physics },
  { label: "Construction and Road", value: Programme.Construction_and_road },
];

export const LOCATIONS = [
  { label: "Studiecentrum", value: Locations.Studiecentrum },
  { label: "Union Building", value: Locations.Union_Building },
  { label: "E Building", value: Locations.E_Building },
  { label: "Tent", value: Locations.Tent },
];
