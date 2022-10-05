import { getAuth, postAuth } from "../http/_HttpHelpers";


export interface SSApplication {
  id: number;
  motivation: string;
  status: number;
  studentId: number;
  companyId: number;
  booked: boolean;
}
export const getApplications = async (): Promise<SSApplication[]> => {
  const response = await getAuth(`/applications/my/company`);
  const json = await response.json();
  const Applications = json as SSApplication[];
  return Applications;
}
export const sendApplication = async (companyId: number, msg: string) => {
  await postAuth(`/applications/company/${companyId}`, msg);
};
