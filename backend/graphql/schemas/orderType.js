const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLList } = require('graphql');
const ProductType = require('./productType');

// Tipo per gli elementi dentro l'ordine (es: 2 pizze margherita)
const OrderItemType = new GraphQLObjectType({
    name: 'OrderItem',
    fields: () => ({
        quantity: { type: GraphQLFloat }, // Int o Float
        product: { type: ProductType }     // Relazione col prodotto
    })
});

// Tipo per l'ordine completo
const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: { type: GraphQLID },
        total_amount: { type: GraphQLFloat },
        status: { type: GraphQLString },
        created_at: { type: GraphQLString },
        items: { type: new GraphQLList(OrderItemType) } // Lista di prodotti
    })
});

module.exports = { OrderType, OrderItemType };