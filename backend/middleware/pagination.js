const pagination = (model, populate = []) => {
  return async (req, res, next) => {
    try {
      let query;

      // Copy req.query
      const reqQuery = { ...req.query };

      // Fields to exclude from normal query filtering
      const removeFields = ['select', 'sort', 'page', 'limit', 'q', 'search'];
      removeFields.forEach((param) => delete reqQuery[param]);

      // Create query string
      let queryStr = JSON.stringify(reqQuery);

      // Create operators ($gt, $gte, etc)
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

      // Base query object
      let dbQuery = JSON.parse(queryStr);

      // Full text search
      if (req.query.q || req.query.search) {
        const searchTerm = req.query.q || req.query.search;
        dbQuery.$text = { $search: searchTerm };
      }

      // Initialize query
      query = model.find(dbQuery);

      // Select Fields
      if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
      } else if (req.query.q || req.query.search) {
        // Project score if text search
        query = query.select({ score: { $meta: 'textScore' } });
      }

      // Sort
      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else if (req.query.q || req.query.search) {
        // Sort by score if text search
        query = query.sort({ score: { $meta: 'textScore' } });
      } else {
        query = query.sort('-createdAt'); // Default sort
      }

      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await model.countDocuments(dbQuery);

      query = query.skip(startIndex).limit(limit);

      // Populate
      if (populate.length > 0) {
        populate.forEach((pop) => {
          query = query.populate(pop);
        });
      }

      // Execute query
      const results = await query;

      // Pagination result
      const paginationData = {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };

      if (endIndex < total) {
        paginationData.next = {
          page: page + 1,
          limit,
        };
      }

      if (startIndex > 0) {
        paginationData.prev = {
          page: page - 1,
          limit,
        };
      }

      res.paginatedResults = {
        data: results,
        meta: { pagination: paginationData },
      };

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = pagination;
