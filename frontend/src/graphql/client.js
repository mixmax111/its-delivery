import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_API_URL || 'http://localhost:4001/graphql',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('auth_token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Basic ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;