import { gql } from '@apollo/client'; // ✅ IMPORTANTE

export const LOGIN_USER = gql`
    query LoginUser {
        me {
            id
            email
            role
            address
        }
    }
`;

export const REGISTER_USER = gql`
    mutation Register($email: String!, $password: String!, $address: String) {
        registerUser(email: $email, password: $password, address: $address) {
            id
            email
        }
    }
`;

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

export const CREATE_ORDER = gql`
    mutation CreateOrder($productIds: [ID], $quantities: [Float]) {
        createOrder(productIds: $productIds, quantities: $quantities) {
            id
            total_amount
            status
        }
    }
`;

export const GET_MY_ORDERS = gql`
    query GetMyOrders {
        getMyOrders {
            id
            total_amount
            status
            created_at
            items {
                quantity
                product {
                    name
                }
            }
        }
    }
`;