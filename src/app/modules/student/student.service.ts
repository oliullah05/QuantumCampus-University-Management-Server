import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchAbleFileds } from './student.const';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {

// const queryObject = {...query}

  /*
  {email:{$regex:query.searchTerm,$options:i}
  {name:{$regex:query.searchTerm,$options:i}}
  
  */

//search -1

//   const studentSearchAbleFileds = ["email", "id", "name.firstName", "age"]

//   let searchTerm = '';
//   if (query?.searchTerm) {
//     searchTerm = query.searchTerm as string
//   }


// const searchQuery =  Student.find({
//   $or: studentSearchAbleFileds.map((field) => ({
//     [field]: { $regex: searchTerm, $options: "i" }
//   }))

// })

// filtering -2

// const excludeFields = ["searchTerm","sort","limit","page","fields"]

// excludeFields.forEach(elem=>delete queryObject[elem])

//   const filterQuery =  searchQuery.find(queryObject).populate('admissionSemester')
//     .populate({
//       path: 'academicDepartment',
//       populate: {
//         path: 'academicFaculty',
//       },
//     });


//sorting -3

// let sort = "-createdAt"

// if(query.sort){
//   sort= query.sort as string
// }

// const sortQuery =  filterQuery.sort(sort)


// pagination-4


// let page =1;
// let limit = 1;
// let skip =0;



// if(query.page){
//   page= Number(query.page)
// }


// if(query.limit){
//   limit = Number(query.limit) 
//   }

//   if(query.skip){
//     skip=(page-1)*limit
//   }


// const paginateQuery = sortQuery.skip(skip)


// const limitQuery = paginateQuery.limit(limit)


//field limiting -5

// let fileds = "-__v"

// if(query.fields){
//   fileds=(query.fields as string).split(",").join(" ") 
// console.log({fileds});
// }

// const fieldQuery =await limitQuery.select(fileds)


//   return fieldQuery;


const studentQuery = new QueryBuilder(Student.find().populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    })
,query).search(studentSearchAbleFileds)
.filter()
.sort()
.paginate()
.fields()


const result = await studentQuery.modelQuery



return result



};











const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*
    guardain: {
      fatherOccupation:"Teacher"
    }

    guardian.fatherOccupation = Teacher

    name.firstName = 'Mezba'
    name.lastName = 'Abedin'
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdatedData);

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
