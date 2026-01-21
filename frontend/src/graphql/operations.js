import { gql } from '@apollo/client';

// LOGIN
export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            userId
        }
    }
`;

// PROFILO UTENTE
export const GET_ME = gql`
    query Me {
        me {
            id
            email
            role
            address
        }
    }
`;

// REGISTRAZIONE
export const REGISTER_USER = gql`
    mutation Register($email: String!, $password: String!, $address: String) {
        registerUser(email: $email, password: $password, address: $address) {
            id
            email
        }
    }
`;

// MENU PIZZE
export const GET_MENU = gql`
    query GetMenu {
        getMenu {
            id
            name
            description
            price
            image_url
            category
        }
    }
`;

// CREA ORDINE
export const CREATE_ORDER = gql`
    mutation CreateOrder($productIds: [ID], $quantities: [Float]) {
        createOrder(productIds: $productIds, quantities: $quantities) {
            id
            totalAmount
        }
    }
`;

// I MIEI ORDINI
export const GET_MY_ORDERS = gql`
    query GetMyOrders {
        getMyOrders {
            id
            totalAmount
            status
            createdAt
            items {
                quantity
                product {
                    name
                }
            }
        }
    }
`;