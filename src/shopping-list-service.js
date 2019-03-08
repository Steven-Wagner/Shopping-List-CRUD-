const ShoppingService = {

getAllProducts(knex) {
    return knex('shopping_list')
        .select('*')
},
getProductById(knex, id) {
    return knex('shopping_list')
        .select('*')
        .where('id', id)
        .first()
},
updateProduct(knex, id, newData) {
    return knex('shopping_list')
        .where('id', id)
        .update(newData)
},
deleteProductById(knex, id) {
    return knex('shopping_list')
        .where('id', id)
        .delete()
}

}

module.exports = ShoppingService