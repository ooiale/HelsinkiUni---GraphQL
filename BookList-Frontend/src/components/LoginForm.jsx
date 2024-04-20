import { useState, useEffect } from 'react'
import { useMutation, useApolloClient } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [token, setToken] = useState(null)

    

    const client = useApolloClient()

    const [login, result] = useMutation(LOGIN, {
        onError: (error) => console.log(error.graphQLErrors[0].message)
    })

    useEffect(() => {
        setToken(localStorage.getItem('user-token'))
    }, [])

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('user-token', token)
        }
    }, [result.data])

    const onSubmit = (event) => {
        event.preventDefault()
        login({variables: {username}})
        setUsername('')
    }

    const handleLogout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }

    if (token) {
        return (
            <div className="container mt-5">
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading">You are already logged in!</h4>
                    <hr />
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="row mb-3">
                <div className="col-sm-3">
                    <label  className="form-label"> Username</label>
                    <input  className="form-control" value={username} onChange={({target}) => setUsername(target.value)} />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-6">
                    <button type="submit" className="btn btn-primary btn-block">Sign in</button>
                </div>
            </div>
        </form>
    );
}

export default LoginForm;
