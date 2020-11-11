import React, { useState, useContext } from 'react'
import { gql, useMutation } from '@apollo/client';
import {Form, Button} from 'semantic-ui-react'
import {useForm} from '../util/hooks'
import { AuthContext } from '../context/Auth'

const Register = ({history}) => {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const {onChange, onSubmit, values } = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    }) 

    const [addUser, {loading}] = useMutation(REGISTER_USER, {
        update(proxy, {data: {register: userData}}){
            context.login(userData)
            history.push('/')
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    function registerUser (){
        addUser()
    }
    return (
        <div className= "form-container">
            <Form onSubmit = {onSubmit} noValidate className = {loading ? 'loading': null}> 
                <h1>Register</h1>
                <Form.Input
                    label = 'Username'
                    placeholder = 'Username...'
                    name = 'username'
                    type = 'text'
                    value = {values.username}
                    error = {errors.username ? true : false}
                    onChange = {onChange}
                    />
                     <Form.Input
                    label = 'Email'
                    placeholder = 'Email...'
                    name = 'email'
                    type = 'email'
                    value = {values.email}
                    error = {errors.email ? true : false}
                    onChange = {onChange}
                    />
                    <Form.Input
                    label = 'Password'
                    placeholder = 'Password...'
                    name = 'password'
                    type = 'password'
                    value = {values.password}
                    error = {errors.password ? true : false}
                    onChange = {onChange}
                    />
                    <Form.Input
                    label = 'ConfirmPassword'
                    placeholder = 'ConfirmPassword...'
                    name = 'confirmPassword'
                    type = 'password'
                    value = {values.confirmPassword}
                    error = {errors.confirmPassword ? true : false}
                    onChange = {onChange}
                    />
                    <Button type = "submit" primary>Register</Button>
            </Form>
            {Object.keys(errors).length > 0 &&(
                    <div className ='ui error message'>
                        <ul className= 'list'>
                            {Object.values(errors).map(value => (
                                <li key={value}>{value}</li>
                            ))}
                        </ul>
                    </div>
                )}
        </div>
    )
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            id
            email
            username
            createdAt
            token
        }
    }
`

export default Register