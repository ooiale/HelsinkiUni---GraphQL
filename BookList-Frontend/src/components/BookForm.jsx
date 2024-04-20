import { useState } from "react"
import { useMutation } from '@apollo/client'
import { CREATE_BOOK } from "../queries"

const BookForm = () => {
    const [title, setTitle] = useState('') 
    const [published, setPublished] = useState('') 
    const [author, setAuthor] = useState('') 
    const [genres, setGenres] = useState('')

    
    const [createBook] = useMutation(CREATE_BOOK)

    const onSubmit = (event) => {
        event.preventDefault()
        createBook({variables: {title, published: Number(published), author, genres: genres.split(" ")}})
        setTitle('')
        setPublished('')
        setAuthor('')
        setGenres('')
    }

    return (
      <div className="p-1">
        <form onSubmit={onSubmit}>
        <div className="form-group">
            <label >Title:</label>
            <input className="form-control" value={title} onChange={({target}) => setTitle(target.value)}/>
        </div>
        <div className="form-group">
            <label >Published:</label>
            <input className="form-control" value={published} onChange={({target}) => setPublished(target.value)}/>
        </div>
        <div className="form-group">
            <label >Authors:</label>
            <input className="form-control" value={author} onChange={({target}) => setAuthor(target.value)}/>
        </div>
        <div className="form-group">
            <label >Genres:</label>
            <input className="form-control" value={genres} onChange={({target}) => setGenres(target.value)}/>
        </div>
        <button type="submit" className="btn btn-success">
            Submit
        </button>
        </form>
      </div>
    )
}

export default BookForm