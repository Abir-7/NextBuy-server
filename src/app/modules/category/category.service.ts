import prisma from "../../client/prisma";

const createCategory = async (data: { name: string }) => {
  const result = await prisma.category.create({ data: data });
  return result;
};

const getAllCategory = async () => {
  const result = await prisma.category.findMany();
  return result;
};
export const CategoryService = {
  createCategory,
  getAllCategory,
};
