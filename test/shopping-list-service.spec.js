const ShoppingService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`ShoppingService object`, () => {
    let db

    testProducts = [
        {
        id: 1,
        name: 'Fish tricks',
        price: '13.10',
        date_added: new Date('2029-01-22T16:28:32.615Z'),
        checked: true,
        category: 'Main'
        },
        {
        id: 2,
        name: 'Not dogs',
        price: '4.99',
        date_added: new Date('2028-01-22T16:28:32.615Z'),
        checked: false,
        category: 'Snack'
        },
        {
        id: 3,
        name: 'Bluffalo Wings',
        price: '5.50',
        date_added: new Date('2028-01-22T16:25:32.615Z'),
        checked: false,
        category: 'Lunch'
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.DB_URL_TEST
        })
    })
    before(() => {
        return db('shopping_list').truncate()
    })
    afterEach(() => {
        return db('shopping_list').truncate()
    })

    after(() => db.destroy())

    context(`If there is data in 'shopping_list`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testProducts)
        })
        it(`getAllProducts resolves all products in 'shopping_list'`, () => {
            return ShoppingService.getAllProducts(db)
                .then(actaul => {
                    expect(actaul).to.eql(testProducts)
                })
        })
        it(`getProductById should return a product with correct id`, () => {
            return ShoppingService.getProductById(db, 2)
                .then(actual => {
                    expect(actual).to.eql(testProducts[1])
                })
        })
        it(`updateProduct updates the correct product`, () => {
            const updatedProductDetails = {
                name: 'Hot dogs',
                price: '5.00',
                date_added: new Date('2028-01-22T16:28:32.615Z'),
                checked: true,
                category: 'Snack'
            }
            const idToUpdate = 2
            return ShoppingService.updateProduct(db, idToUpdate, updatedProductDetails)
                .then(() => ShoppingService.getProductById(db, idToUpdate))
                .then(actual => {
                    expect(actual).to.eql(
                        {id: idToUpdate,
                        ... updatedProductDetails}
                    )
                })
        })
        it(`deleteProductById deletes the proper product from table`, () => {
            const idToDelete = 2;
            const arrayWithDelete = testProducts.filter(product => product.id !== idToDelete)
            return ShoppingService.deleteProductById(db, idToDelete)
                .then(() => ShoppingService.getAllProducts(db))
                .then(actual => {
                    expect(actual).to.eql(arrayWithDelete)
                })
        })
    })
})