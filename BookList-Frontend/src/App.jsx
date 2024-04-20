import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSubscription } from '@apollo/client'


import AuthorsList from './components/AuthorsList'
import BooksList from './components/BooksList'
import LoginForm from './components/LoginForm'
import Navbar from './components/Navbar'
import Recommendation from './components/Recommendation';
import {BOOK_ADDED, ALL_BOOKS} from './queries'

function App() {

  const updateCache = (cache, query, addedBook) => {
    const uniqueByName = (books) => {
      let seen = new Set()
      return books.filter((book) => {
        let title = book.title
        return seen.has(title) ? false : seen.add(title)
      })
    }
    cache.updateQuery(query, ({allBooks}) => {
      return {
        allBooks: uniqueByName(allBooks.concat(addedBook))
      }
    })
  }
  
  useSubscription(BOOK_ADDED, {
    onData: ({data, client}) => {
      const addedBook = data.data.bookAdded
      console.log(addedBook)
      window.alert(`added book ${addedBook.title}`)
      updateCache(client.cache, {query: ALL_BOOKS}, addedBook)
    }
  })

  return (
    <div>
      <Router>
        <Navbar />

        <Routes>
          <Route path='/' element={<p> home page </p>} />
          <Route path='/Authors' element={<AuthorsList />}/>
          <Route path='/Books' element={<BooksList />}/>
          <Route path='/Login' element={<LoginForm />}/>
          <Route path='/Recommended'element={<Recommendation />}/>
        </Routes>
      </Router>
    </div>
  )

}

export default App
