const typeDefs = `
type User {
  username: String!
  favoriteGenre: String
  id: ID!
}
type Token {
  value: String!
}
type Author {
  name: String!
  born: Int
  id: ID
}  
type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID
  }
type AuthorWithBookCount {
  name: String!
  born: Int
  id: ID
  bookCount: Int
}
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks (author: String genre: String): [Book!]!
    allAuthors: [AuthorWithBookCount!]!
    me: User
    allGenres: [String!]!
    filterByGenres (genre: String!): [Book!]!
  }

  type Mutation {
    addBook (
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    editFavoriteGenre(
      genre: String!
    ): User
    createUser(
      username: String!
    ): User
    login(
      username: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

module.exports = typeDefs