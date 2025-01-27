import { gql } from '@apollo/client/core';

// export const GET_DATASET = gql`
// query {
//     authors{
//       _id
//       name
//       books{
//         title
//       }
//     }
//   }
// `
export const GET_DATASET = gql`
query{  power{    time    power_mw    pitch_angle    pitch_angle_set    blade_angle  }}
`

export const NEW_MESSAGE_SUBSCRIPTION = gql`
subscription{
  dataChanged{
    operationType
      fullDocument
    documentKey
  }
}
`