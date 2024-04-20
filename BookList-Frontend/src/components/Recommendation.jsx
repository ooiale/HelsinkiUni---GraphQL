import { FILTER_BY_GENRE, CURRENT_USER  } from '../queries'
import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
const Recommendation = () => {
    const [filter, setFilter] = useState("")

    const user = useQuery(CURRENT_USER);
    
    
    const filteredBooks = useQuery(FILTER_BY_GENRE, {variables:{genre: filter}, skip: !filter})

    useEffect(() => {
        if (!user.loading) setFilter(user.data.me.favoriteGenre)
    }, [user])


    if ( user.loading || filteredBooks.loading) {
        return <div>Loading data...</div>;
    }

    if ( user.error || filteredBooks.error) {
        return <div>Error: { user.error || filteredBooks.error}</div>;
    }

    const books = filteredBooks.called 
        ? filteredBooks.data.filterByGenres 
        : []


    return (
        <div>
        <h1>Recommended books</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}

export default Recommendation