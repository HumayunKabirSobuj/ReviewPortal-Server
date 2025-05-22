import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CategoryService } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category Created Successfuly.",
    data: result,
  });
});
const getAllCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategory();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category Data Fetched Successfuly.",
    data: result,
  });
});
const getSingleCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.getSingleCategory(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category Data Fetched Successfuly.",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategory,
  getSingleCategory,
};
