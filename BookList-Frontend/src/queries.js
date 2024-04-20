import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    author {
      name
    }
    title
    published
    genres
  }
}
`

export const CREATE_BOOK = gql`
mutation($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(title: $title, published: $published, author: $author, genres: $genres) {
    title
    published
    author {
      name
    }
    genres
    id
  }
}
`

export const SET_BORN = gql`
mutation($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
  }
}
`

export const LOGIN = gql`
mutation($username: String!) {
  login(username: $username) {
    value
  }
}
`

export const ALL_GENRES = gql`
query {
  allGenres
}
`

export const FILTER_BY_GENRE = gql`
query($genre: String!) {
  filterByGenres(genre: $genre) {
    author {
      name
    }
    title
    published
    genres
  }
}
`

export const CURRENT_USER = gql`
query {
  me {
    username
    favoriteGenre
  }
}
`

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    title
    published
    author {
      name
    }
    genres
    id
  }
}
`