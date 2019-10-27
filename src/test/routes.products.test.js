const assert = require('assert');
const proxyquire = require('proxyquire');

const { productsMock,ProductsServiceMock } = require('../utils/mocks.js');
const testServer = require('../utils/testServer');

describe('routes - products', function() {
    const route = proxyquire('../routes/index', {
        '../services/products': ProductsServiceMock
    });
    const request = testServer(route);
    describe('GET /products', function(){
        it('should respond with status 200' , function(done){
            request.get('/api/products').expect(200,done)
        });
        it('should respond with the list of products', function(done){
            request.get('/api/products').end((err, res) => {
                assert.deepEqual(res.body,{
                    data: productsMock,
                    message: 'products listed'
                });
                done();
            })
        });
    });
    describe('GET /products/:productId', function(){
        it('should respond with status 200' , function(done){
            request.get(`/api/products/${productsMock[0].id}`).expect(200,done)
        });
        it('should respond with the product requested', function(done){
            request.get(`/api/products/${productsMock[0].id}`).end((err, res) => {
                assert.deepEqual(res.body,{
                    data: productsMock[0],
                    message: 'product retrieved'
                });
                done();
            })
        });
    });
    
    describe('POST /products/', function(){
        it('should respond with status 201' , function(done){
            request.post('/api/products/').expect(201,done)
        });
        it('should respond with the id created', function(done){
            request.post('/api/products')
            .type('json')
            .set("Content-Type", "application/json")
            .send({
                    "id": productsMock[0].id,
                    "image": productsMock[0].image,
                    "title": productsMock[0].title,
                    "price": productsMock[0].price,
                    "description": productsMock[0].description,
            })
            .end((err, res) => {
                console.log(res.body);
                assert.deepEqual(res.body,{
                    data: productsMock[0].id,
                    message: 'product created'
                });
                done();
            })
        });
    });
    describe('PUT /products/:productId', function(){
        it('should respond with status 200' , function(done){
            request.put(`/api/products/${productsMock[0].id}`).expect(200,done)
        });
        it('should respond with the id updated', function(done){
            request
                .put(`/api/products/${productsMock[0].id}`)
                .set({
                    "title": "Avictor"
                })
                .expect(200)
                .end((err, res) => {
                    assert.deepEqual(res.body,{
                        data: productsMock[0].id,
                        message: 'Product updated'
                    });
                    done();
                })
        });
    });
    describe('DELETE /products/:productId', function(){
        it('should respond with status 200' , function(done){
            request.delete(`/api/products/${productsMock[0].id}`).expect(200,done)
        });
        it('should respond with the id deleted', function(done){
            request
                .delete(`/api/products/${productsMock[0].id}`)
                .expect(200)
                .end((err, res) => {
                    assert.deepEqual(res.body,{
                        data: productsMock[0].id,
                        message: 'product deleted'
                    });
                    done();
                })
        });
    });
});