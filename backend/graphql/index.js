const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLFloat, GraphQLID, GraphQLNonNull } = require('graphql');

// Import Schemi
const UserType = require('./schemas/userType');
const ProductType = require('./schemas/productType');
const { OrderType } = require('./schemas/orderType');

// Import Resolver
const userResolver = require('./resolvers/userResolver');
const productResolver = require('./resolvers/productResolver');
const orderResolver = require('./resolvers/orderResolver');

// -- ROOT QUERY --
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        // Utente
        me: { type: UserType, resolve: userResolver.me },

        // Prodotti
        getMenu: { type: new GraphQLList(ProductType), resolve: productResolver.getMenu },

        // Ordini
        getMyOrders: { type: new GraphQLList(OrderType), resolve: orderResolver.getMyOrders }
    }
});

// -- ROOT MUTATION --
const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        // Utente
        registerUser: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                address: { type: GraphQLString }
            },
            resolve: (_, args) => userResolver.registerUser(args)
        },

        // Prodotti (Admin)
        addProduct: {
            type: ProductType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLString },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                category: { type: new GraphQLNonNull(GraphQLString) },
                image_url: { type: GraphQLString }
            },
            resolve: (_, args, context) => productResolver.addProduct(args, context)
        },
        deleteProduct: {
            type: GraphQLString,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: (_, args, context) => productResolver.deleteProduct(args, context)
        },

        // Ordini
        createOrder: {
            type: OrderType, // Ritorna l'ordine creato
            args: {
                productIds: { type: new GraphQLList(GraphQLID) },
                quantities: { type: new GraphQLList(GraphQLFloat) }
            },
            resolve: (_, args, context) => orderResolver.createOrder(args, context)
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});