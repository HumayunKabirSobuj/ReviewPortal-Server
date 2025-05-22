import { Category } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../Errors/AppError";
import status from "http-status";

const createCategory = async (data: Category) => {
  //   console.log("createCategory...",data);

  const isCategoryExist = await prisma.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (isCategoryExist) {
    throw new Error("Category Already Exist");
  }

  const result = await prisma.category.create({
    data,
  });

  return result;
};
const getAllCategory = async () => {
  const result = await prisma.category.findMany();
  return result;
};
const getSingleCategory = async (id: string) => {
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!isCategoryExist) {
    throw new AppError(status.NOT_FOUND,"Category not exist..");
  }
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      reviews: true,
    },
  });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  getSingleCategory,
};
