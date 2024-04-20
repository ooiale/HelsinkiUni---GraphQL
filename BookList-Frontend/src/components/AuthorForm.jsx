import { useState } from "react"
import ReactSelect from 'react-select';
import { useMutation } from '@apollo/client'
import { SET_BORN, ALL_AUTHORS } from "../queries"

const SetBorn = ({authors}) => {
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')

    const [updateBorn] = useMutation(SET_BORN, {refetchQueries: [{query: ALL_AUTHORS}]})

    

    const onSubmit = (event) => {
        event.preventDefault()
        updateBorn({variables: {name: name.value, setBornTo: Number(born)}})
        setName('')
        setBorn('')
    }

    const options = authors.map(a => ({
        value: a.name,
        label: a.name   
    }))


    return (
        <div className="p-1">
        <form onSubmit={onSubmit}>
        <ReactSelect
            className="col-sm-2" 
            options={options}
            value={name}
            onChange={(selected) => setName(selected)}
        />
        <div className="form-group col-sm-1">
            <label >born:</label>
            <input className="form-control" value={born} onChange={({target}) => setBorn(target.value)}/>
        </div>
        <button type="submit" className="btn btn-success">
            Update Author
        </button>
        </form>
      </div>
    )
}

export default SetBorn