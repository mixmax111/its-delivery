import { gql } from '@apollo/client';

// 1. LOGIN
export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            userId
        }
    }
`;

// 2. PROFILO UTENTE
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
            image_url  # <--- Coerente con la tabella SQL 'products'
            category
        }
    }
`;

// 5. CREA ORDINE
export const CREATE_ORDER = gql`
    mutation CreateOrder($productIds: [ID], $quantities: [Float]) {
        createOrder(productIds: $productIds, quantities: $quantities) {
            id
            total_amount # <--- Coerente con la tabella SQL 'orders'
        }
    }
`;

// 6. I MIEI ORDINI
export const GET_MY_ORDERS = gql`
    query GetMyOrders {
        getMyOrders {
            id
            total_amount # <--- Coerente con la tabella SQL 'orders'
            status
            created_at   # <--- Coerente con la tabella SQL 'orders'
            items {
                quantity
                product {
                    name
                }
            }
        }
    }
`;