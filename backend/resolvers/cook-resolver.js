import {
  findWhere,
  findFirstWhere,
  insertObject,
  updateObject,
  deleteObject,
  performOperation,
  performPagination,
} from './utils';

const TABLE_NAME = 'cooks';

async function getCook(args) {
  const result = await findFirstWhere(TABLE_NAME, args.cook_id);
  return result;
}

async function getCooks(args) {
  const result = await performPagination(TABLE_NAME, args);
  return result;
}

async function getCookWorkshops(args) {
  const result = await findWhere('workshops', args.cook_id, 'cook_id');
  return result;
}

async function getCookEvaluations(args) {
  const result = await findWhere('evaluations', args.cook_id);
  return result;
}

async function createCook(args) {
  const result = await insertObject(TABLE_NAME, args);
  return result;
}

async function updateCook(args) {
  const { is_admin: isAdmin, request_author_id: requestAuthorId, ...updateArgs } = args;
  const result = performOperation(
    args,
    getCook({ cook_id: updateArgs.id }),
    updateObject(TABLE_NAME, updateArgs),
    'id',
  );
  return result;
}

async function deleteCook(args) {
  const { is_admin: isAdmin, request_author_id: requestAuthorId, ...deleteArgs } = args;
  const result = await performOperation(
    args,
    getCook({ cook_id: deleteArgs.id }),
    deleteObject(TABLE_NAME, deleteArgs.id),
    'id',
  );
  return result;
}

export {
  getCook,
  getCooks,
  createCook,
  deleteCook,
  updateCook,
  getCookWorkshops,
  getCookEvaluations,
};
