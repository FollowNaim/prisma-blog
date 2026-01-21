type IOptions = {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
};

type IOresult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const paginationHelper = (options: IOptions): IOresult => {
  const page = Number(options.page ?? 1);
  const limit = Number(options.limit ?? 10);
  const skip = (page - 1) * limit;
  const sortBy = (options.sortBy as string) || "createdAt";
  const sortOrder = (options.sortOrder as string) || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginationHelper;
