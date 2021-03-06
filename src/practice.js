require('dotenv').config();
const  knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

console.log('connection successful');

function searchByProduceName(searchTerm) {
    knexInstance
        .select('product_id', 'name', 'price', 'catagory')
        .from('amazong_products')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

function paginateProducts(page) {
    const productsPerPage = 10;
    const offset = productsPerPage * (page-1);
    knexInstance
        .select('product_id', 'name', 'price', 'catagory')
        .from('amazong_products')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

function getProductsWithImages(){
    knexInstance
        .select('product_id', 'name', 'price', 'catagory', 'image')
        .from('amazong_products')
        .whereNotNull('image')
        .then(result => {
            console.log(result)
        })
}

function mostPopularVideosForDays(days) {
    knexInstance
        .select('video_name', 'region')
        .count('date_viewed AS views')
        .where(
            'date_viewed',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
            )
        .from('whopipe_video_views')
        .groupBy('video_name', 'region')
        .orderBy([
            {column: 'region', order: 'ASC'},
            {column: 'views', order: 'DESC'}
        ])
        .then(results => {
            console.log(results)
        })
}

mostPopularVideosForDays(30);

//getProductsWithImages();

//paginateProducts(2);

//searchByProduceName('holo');

