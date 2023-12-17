import { Request, Response, query } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const result =await OfferedCourseServices.createOfferedCourseIntoDB(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course is created successfully !',
      data: result,
    });
});

const getAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  //   const result =
  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'OfferedCourses retrieved successfully !',
  //     data: result,
  //   });
});

const getSingleOfferedCourses = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    //   const result =
    //   sendResponse(res, {
    //     statusCode: httpStatus.OK,
    //     success: true,
    //     message: 'OfferedCourse fetched successfully',
    //     data: result,
    //   });
  },
);

const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  //   const result =
  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'OfferedCourse updated successfully',
  //     data: result,
  //   });
});

const deleteOfferedCourseFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    // sendResponse(res, {
    //   statusCode: httpStatus.OK,
    //   success: true,
    //   message: 'OfferedCourse deleted successfully',
    //   data: result,
    // });
  },
);

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourses,
  updateOfferedCourse,
  deleteOfferedCourseFromDB,
};