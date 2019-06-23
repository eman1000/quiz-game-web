import gql from 'graphql-tag';

export const GET_CATEGORY = gql(`
  query ($id:ID!){
    getCategory(id: $id) {
      id
      name
      thumbnail
      description
      backgroundImageUrl
    }
  }
`);

export default {
  GET_CATEGORY
}