const createPaginationData = (
  page,
  limit,
  totalCount,
  resourceName = "مورد"
) => ({
  صفحه: page,
  "تعداد در هر صفحه": limit,
  "تعداد کل صفحات": Math.ceil(totalCount / limit),
  [`تعداد کل ${resourceName}`]: totalCount,
});

module.exports = createPaginationData;
