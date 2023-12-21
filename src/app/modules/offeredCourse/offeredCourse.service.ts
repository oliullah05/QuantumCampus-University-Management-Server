import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TofferedCourse } from "./offeredCourse.interface";
import OfferedCourse from "./offeredCourse.model";


const createOfferedCourseIntoDB = async (payload: TofferedCourse) => {
  const { semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty } = payload;

const isSemesterRegistrationExits =await SemesterRegistration.findById(semesterRegistration)

if(!isSemesterRegistrationExits){
  throw new AppError(404,"semesterRegistration not found")
}



const isAcademicFacultyExits =await AcademicFaculty.findById(academicFaculty)

if(!isAcademicFacultyExits){
  throw new AppError(404,"AcademicFaculty not found")
}



const isacAdemicDepartmentExits =await AcademicDepartment.findById(academicDepartment)

if(!isacAdemicDepartmentExits){
  throw new AppError(404,"academicDepartment not found")
}



const isCourseExits =await Course.findById(course)

if(!isCourseExits){
  throw new AppError(404,"Course not found")
}



const isFacultyExits =await Faculty.findById(faculty)

if(!isFacultyExits){
  throw new AppError(404,"faculty not found")
}


// check if the department belong to the faculty 

const isTheDepartmentBelongToFaculty = await AcademicDepartment.findOne({
  academicFaculty,
  _id:academicDepartment
})


if(!isTheDepartmentBelongToFaculty){
  throw new AppError(400,`the ${isacAdemicDepartmentExits.name} is not belong to this ${isAcademicFacultyExits.name} `)
}



// if the same offered course , same section , same register semester exits


const isSameOfferedCourseWithSameSemesterRegisterWithSameSection = await OfferedCourse.findOne({
  section,
  semesterRegistration,
  course
})

if(isSameOfferedCourseWithSameSemesterRegisterWithSameSection){
  throw new AppError(400,`Offered course with same section is alrady exits `)
}


const academicSemester = isSemesterRegistrationExits.academicSemester


  const result = OfferedCourse.create({...payload,academicSemester})
  return result;

};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(404, 'Offered Course not found');
  }

  return offeredCourse;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Partial<TOfferedCourse>,
) => { };

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};