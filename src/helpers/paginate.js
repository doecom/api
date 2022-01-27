const { Query, Types } = require('mongoose');
const { ObjectId } = Types;

const paginate = async (query, { page = 1, size = 10 } = {}) => {

  const filter = query.getFilter();
  const options = query.getOptions();
  const model = query.model;
  const collection = query._collection;

  page = parseInt(page);
  size = parseInt(size);

  const countQuery = new Query(filter, options, model, collection);

  const docsQuery = query
    .skip((page - 1) * size)
    .limit(size)
    .exec();

  const count = countQuery
    .count()
    .exec();

  const [docs, total] = await Promise.all([docsQuery, count])

  return {
    docs,
    total,
    page,
    size,
    pages: Math.ceil(total / size)
  }
}

const aggregatePaginate = async (model, pipeline) => {

  let { paginate: { page, size } } = pipeline.find(filter => Object.getOwnPropertyNames(filter).includes('paginate'));

  page = parseInt(page);
  size = parseInt(size);

  const pagination = [
    { $skip: (page - 1) * size },
    { $limit: size },
  ];

  const rawPipeline = pipeline.filter(filter => !(Object.getOwnPropertyNames(filter).includes('paginate')));
  let countPipeline = [...rawPipeline, { $count: 'total' }];
  let docsPipeline = pipeline.reduce((prev, curr) => {
    const currProperties = Object.getOwnPropertyNames(curr);
    if (currProperties.includes('paginate')) {
      prev = [...prev, ...pagination];
    } else {
      prev = [...prev, curr];
    }
    return prev;
  }, []);

  countPipeline = countPipeline.map(filter => replaceId(filter));
  docsPipeline = docsPipeline.map(filter => replaceId(filter));

  const countQuery = model.aggregate(countPipeline).exec();
  const docsQuery = model.aggregate(docsPipeline).exec();

  const [docs, count] = await Promise.all([docsQuery, countQuery])

  let total = 0;
  if (count.length) total = count[0].total;

  return {
    docs,
    total,
    page,
    size,
    pages: Math.ceil(total / size)
  }

};

const replaceId = (obj) => {
  const props = Object.getOwnPropertyNames(obj);
  if (props.includes('$match') && obj.$match._id) {
    return { $match: { _id: new ObjectId(obj.$match._id) } }
  }
  return obj;
};

const arrayPaginate = (array, page, size) => {

  page = parseInt(page);
  size = parseInt(size);

  const start = (page - 1) * size;
  const end = (page) * size;

  return {
    docs: array.slice(start, end),
    total: array.length,
    page,
    size,
    pages: Math.ceil(array.length / size)
  }
}

module.exports = {
  paginate,
  aggregatePaginate,
  arrayPaginate
}
