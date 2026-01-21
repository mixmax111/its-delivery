import { gql } from '@apollo/client';

// 1. LOGIN (Mutation vera: scambia email/password con il Token)
export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            userId
        }
    }
`;

// 2. PROFILO UTENTE (Da usare DOPO aver fatto login per sapere chi sei)
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

// 3. REGISTRAZIONE
export const REGISTER_USER = gql`
    mutation Register($email: String!, $password: String!, $address: String) {
        registerUser(email: $email, password: $password, address: $address) {
            id
            email
        }
    }
`;

// 4. MENU PIZZE
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

// 5. CREA ORDINE
export const CREATE_ORDER = gql`
    mutation CreateOrder($productIds: [ID], $quantities: [Float]) {
        createOrder(productIds: $productIds, quantities: $quantities) {
            id
            totalAmount # Assicurati che nel backend si chiami così (o total_amount)
        }
    }
`;

// 6. I MIEI ORDINI
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