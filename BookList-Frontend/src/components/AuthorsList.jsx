import { useQuery } from '@apollo/client'
import { ALL_AUTHORS
 } from '../queries'

import AuthorForm from './AuthorForm'

const AuthorsList = () => {
  const {loading, error, data} = useQuery(ALL_AUTHORS)

  

  if (loading) {
    return <div> loading data... </div>
  }
  if (error) {
    return <div> {error.message} </div>
  }

  const authors = data.allAuthors

  return (
    <div>
      <h1>Authors Table</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born ?? '-'}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2> Set Birthyear</h2>
      <div>
        <AuthorForm authors={authors}/>
      </div>
    </div>
    )
}

export default AuthorsList