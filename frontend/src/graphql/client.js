import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'https://adanna-sja34-87786fd1c68b.herokuapp.com/graphql',
});

const authLink = setContext((_, { headers }) => {
    // CORREZIONE QUI: Usiamo 'auth_token' invece di 'token'
    const token = localStorage.getItem('auth_token');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;