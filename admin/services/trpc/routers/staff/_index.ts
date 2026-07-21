import { createTRPCRouter } from "@/services/trpc/init";

import { staffRejectedStudentsRouter } from "./rejected-students";
import { staffStudentsRouter } from "./students";
import { staffTeachersRouter } from "./teachers";
import { staffWorkshopsRouter } from "./workshops";

export const staffRouter = createTRPCRouter({
  students: staffStudentsRouter,
  rejectedStudents: staffRejectedStudentsRouter,
  teachers: staffTeachersRouter,
  workshops: staffWorkshopsRouter,
});
