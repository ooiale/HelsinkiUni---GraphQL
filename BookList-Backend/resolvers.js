const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: async() => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        let booksToReturn = await Book.find({}).populate('author')
        if (args.author) {
          booksToReturn = booksToReturn.filter(book => 
            book.author.name.toLowerCase() === args.author.toLowerCase())
        }
        if (args.genre) {
          booksToReturn = booksToReturn.filter(b => 
            b.genres.map(b => b.toLowerCase()).includes(args.genre.toLowerCase()))
        }
        return booksToReturn
      },
      allAuthors: async () => {
        const authors = await Author.find({})
        const updatedObject = authors.map (a => {
          const bookCount = a.booksOf.length
          return {name: a.name, born: a.born, id: a._id, bookCount}
        }) 
        
        return updatedObject
      },
      me: async (root, args, context) => {
        return context.currentUser
      },
      allGenres: async () => {
        const books = await Book.find({})
        const allGenres = books.flatMap(book => book.genres);
        const uniqueGenres = [...new Set(allGenres)];
        return uniqueGenres
      },
      filterByGenres: async (root, args) => {
        const books = await Book.find({}).populate('author')
        if (args.genre === '') return books
        return books.filter(b => b.genres.includes(args.genre))
      }
    },
    Mutation: {
      addBook: async (root, args, {currentUser}) => {
        if (!currentUser) {
          throw new GraphQLError('wrong credentials', {
            extensions: {code: 'BAD USER INPUT'}
          })
        }
        
        let author = await Author.findOne({name: args.author})
        let id = null
        if (!author) {
          author = new Author({
            name: args.author,
            born: null
          })
          try {
            await author.save()
          } catch (error) {
            throw new GraphQLError('error saving new author (Min name length = 4)', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.name,
                error
              }
            })
          }
  
          id = author._id
        } else {
          id = author._id
        }
  
        const newBook = await new Book({...args, author: id}).populate('author')
        try {
          const savedBook = await newBook.save()
          author.booksOf = author.booksOf.concat(savedBook.id)
          await author.save()
          pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })
          return savedBook
        } catch (error) {
          throw new GraphQLError('Error saving new book (min title length = 5)', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error
            }
          })
        }
  
      },
      editAuthor: async (root, args, {currentUser}) => {
        if (!currentUser) {
          throw new GraphQLError('wrong credentials', {
            extensions: {code: 'BAD USER INPUT'}
          })
        }
        
        const updatedAuthor = await Author.findOneAndUpdate({name: args.name}, {born: args.setBornTo}, {returnDocument: 'after'})
      
        return updatedAuthor
      },
      editFavoriteGenre: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new GraphQLError('wrong credentials', {
            extensions: {code: 'BAD USER INPUT'}
          })
        }
        const user = currentUser
        const updatedUser = User.findOneAndUpdate({_id: user.id}, {favoriteGenre: args.genre}, {returnDocument: 'after'})
      
        return updatedUser
      },  
      createUser: async (root,args) => {
        const user = new User({username: args.username})
  
        return await user.save()
          .catch (error => {
            throw new GraphQLError('Error creating new user', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
              }
            })
          })
        
      },
      login: async (root,args) => {
        const user = await User.findOne({username: args.username})
  
        if (!user) {
          throw new GraphQLError('WRONG CREDENTIALS', {
            extensions: {code: 'BAD USER INPUT'}
          })
        }
        const userForToken = {
          username: user.username,
          id: user._id
        }
  
        return {value: jwt.sign(userForToken, process.env.JWT_SECRET)}
      }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
    }
  }

module.exports = resolvers