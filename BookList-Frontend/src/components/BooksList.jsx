import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES, FILTER_BY_GENRE } from '../queries'
import { useState, useEffect } from 'react'
import BookForm from './BookForm'
import ReactSelect from 'react-select';

const BooksList = () => {
    const [displayForm, setDisplayForm] = useState(false)
    const [filter, setFilter] = useState('')

    

    const {loading, error, data} = useQuery(ALL_BOOKS)
    const genresObject= useQuery(ALL_GENRES)
    const filteredBooksObject = useQuery(FILTER_BY_GENRE, {variables:{genre: filter.value}, skip: !filter})

    if (loading || filteredBooksObject.loading) {
      return <div> loading data... </div>
    }
    if (error || filteredBooksObject.error) {
      return <div> {error.message} {filteredBooksObject.error} </div>
    }

    const options = genresObject.loading 
    ? {}
    : genresObject.data.allGenres.map(g => {
      return {
        value: g,
        label: g
      }
    })
  
    const books = data.allBooks

    const booksToShow = filteredBooksObject.called
      ? filteredBooksObject.data.filterByGenres
      : books


    return (
        <div>
        <div>
            <div style={{display: displayForm ? 'block' : 'none'}}>
                <BookForm />
            </div>
            <button className='btn btn-default'  onClick={() => setDisplayForm(!displayForm)}> {displayForm? 'Close Form' : 'Create Book'}</button>
        </div>
        <h1>Books Table</h1>
        Filter by Genre<ReactSelect
            className="col-sm-2" 
            options={options}
            value={filter}
            onChange={(selected) => setFilter(selected)}
            />
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {booksToShow.map((book) => (
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

export default BooksList