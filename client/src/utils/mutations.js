import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($author: [String!], $description: String!, $title: String!, $bookId: ID!, $image: String!, $link: String!) {
        saveBook(input: {
            author: $author
            description: $description
            title: $title
            bookId: $bookId
            image: $image
            link: $link
        }) {
            user {
                username 
                savedBooks {
                    bookId
                    title
                }
            }
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: ID!) {
        removeBook(bookId: $bookId) {
            user {
                username 
                savedBooks {
                    bookId
                    title
                }
            }
        }
    }
`;