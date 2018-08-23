import {
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  DELETE,
} from 'react-admin';
import { QUERY_TYPES } from 'ra-data-graphql';
import { TypeKind } from 'graphql';
import pluralize from 'pluralize';

import { encodeQuery, encodeMutation } from './graphqlify';
import getFinalType from './getFinalType';
import isList from './isList';
import isRequired from './isRequired';

const getField = (fieldName) => {
  switch (fieldName) {
    case 'gourmet':
      return {
        id: {},
        first_name: {},
        last_name: {},
      };
    default:
      return { id: {} };
  }
};

export const buildFields = introspectionResults => fields => (
  fields.reduce((acc, field) => {
    const type = getFinalType(field.type);

    if (type.name.startsWith('_')) {
      return acc;
    }

    if (type.kind !== TypeKind.OBJECT) {
      return { ...acc, [field.name]: {} };
    }

    const linkedResource = introspectionResults.resources.find(r => r.type.name === type.name);

    if (linkedResource) {
      return { ...acc, [field.name]: { fields: getField(field.name) } };
    }

    // const linkedType = introspectionResults.types.find(t => t.name === type.name);

    // if (linkedType) {
    //   return {
    //     ...acc,
    //     [field.name]: {
    //       fields: buildFields(introspectionResults)(
    //         linkedType.fields,
    //       ),
    //     },
    //   };
    // }

    // NOTE: We might have to handle linked types which are not resources but will have to be careful about
    // ending with endless circular dependencies !!! check later
    return acc;
  }, {})
);

export const getArgType = (arg) => {
  const type = getFinalType(arg.type);
  const required = isRequired(arg.type);
  const list = isList(arg.type);

  return `${list ? '[' : ''}${type.name}${list ? '!]' : ''}${
    required ? '!' : ''
  }`;
};

export const buildArgs = (query, variables) => {
  if (query.args.length === 0) {
    return {};
  }

  const validVariables = Object.keys(variables).filter(k => typeof variables[k] !== 'undefined');

  const args = query.args
    .filter(a => validVariables.includes(a.name))
    .reduce(
      (acc, arg) => ({ ...acc, [`${arg.name}`]: `$${arg.name}` }),
      {},
    );

  return args;
};

export const buildApolloArgs = (query, variables) => {
  if (query.args.length === 0) {
    return {};
  }

  const validVariables = Object.keys(variables).filter(k => typeof variables[k] !== 'undefined');

  const args = query.args
    .filter(a => validVariables.includes(a.name))
    .reduce(
      (acc, arg) => ({ ...acc, [`$${arg.name}`]: getArgType(arg) }),
      {},
    );

  return args;
};

export default introspectionResults => (
  resource,
  aorFetchType,
  queryType,
  variables,
  resourceName,
) => {
  const apolloArgs = buildApolloArgs(queryType, variables);
  const args = buildArgs(queryType, variables);
  const fields = buildFields(introspectionResults)(resource.type.fields);

  if (aorFetchType === GET_LIST || aorFetchType === GET_MANY || aorFetchType === GET_MANY_REFERENCE) {
    return encodeQuery(queryType.name, {
      params: apolloArgs,
      fields: {
        [queryType.name]: {
          params: args,
          fields: {
            [resourceName]: {
              fields: {
                items: {
                  fields: {
                    ...fields,
                  },
                },
                total: {},
              },
            },
            message: {},
            errors: {
              fields: {
                message: {},
              },
            },
          },
        },
      },
    });
  }

  if (aorFetchType === DELETE) {
    return encodeMutation(queryType.name, {
      params: apolloArgs,
      fields: {
        data: {
          field: queryType.name,
          params: args,
          fields: { id: {} },
        },
      },
    });
  }

  const query = {
    params: apolloArgs,
    fields: {
      [queryType.name]: {
        params: args,
        fields: {
          [pluralize.singular(resourceName)]: {
            fields: {
              ...fields,
            },
          },
          message: {},
          errors: {
            fields: {
              message: {},
            },
          },
        },
      },
    },
  };

  const result = QUERY_TYPES.includes(aorFetchType)
    ? encodeQuery(queryType.name, query)
    : encodeMutation(queryType.name, query);

  return result;
};
