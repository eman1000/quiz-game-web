import gql from 'graphql-tag';
import { ICategory } from '../typings';
import { type } from 'os';


export type GetCategoryQuery = {
  getCategory: ICategory
}

export type GetCategoryVariables = {
  id:number;
}

export type IGetCategotyProps = {
  match:{
    params:{
      categoryId:number;
    }
  }
}
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