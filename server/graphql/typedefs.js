const { gql } = require('apollo-server-hapi')

const typeDefs = gql`

  type Size {
     id: Int!
     name: String!
  }

  type Style {
     id: Int!
     name: String!
  }
    
  type Colour {
     id: Int!
     name: String!
  }
    
  type Year {
     id: Int!
     name: String!
  }
  
  type Dimension {
     name: String!
     description: String!
   }
  
  type Query {
    years: [Year!]!
    sizes: [Size!]!
    styles: [Style!]!
    colours: [Colour!]!
    dimensions: [Dimension!]!
    dimension(name: String!): Dimension! 
    fact(
      years: [Int] 
      sizes: [Int]
      colours: [Int] 
      styles: [Int] 
      aggregators: [String]
      functionType: FunctionType = SUMMATION
    ): Result
  }
  
  type Result {
    result: [ResultAtom]!
  }
  
  type ResultAtom {
     volume: Int!
     year: Int
     size: Int
     colour: Int
     style: Int
  }
  
  enum FunctionType {
     SUMMATION
  }
  
`
module.exports = typeDefs
