import { gql } from '@apollo/client/core';

export const GET_DATASET = gql`
query {
    authors{
      _id
      name
      books{
        title
      }
    }
  }
`