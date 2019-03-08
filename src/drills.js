require('dotenv').config()
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

function searchProduct(searchTerm) {
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

function paginateProducts(page) {
    const productsPerPage = 6;
    const offset = productsPerPage * (page-1);
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(results => {
            console.log(results);
        })

}

function productsAddedDaysAgo(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(results => {
            console.log(results)
        })
}

function totalCategoryCost() {
    knexInstance
        .select('category')
        .count('category')
        .sum('price')
        .from('shopping_list')
        .groupBy('category')
        .then(results => {
            console.log(results);
        })
}

function allInCategory(category) {
    knexInstance
        .select('category')
        .sum('price')
        .groupBy('category')
        .from('shopping_list')
        .where(
            'category',
            '=',
            `${category}`)
        .then(result => {
            console.log(result)
        })
}

allInCategory('Snack')

totalCategoryCost();

productsAddedDaysAgo(10);

paginateProducts(2);

searchProduct('fish');