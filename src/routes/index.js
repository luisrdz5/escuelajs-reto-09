const express = require('express');
const path = require('path');
//const ProductService = require('../services');
const ProductService = require('../services/products')
const receipt = '../assets/receipt.pdf'

const platziStore = (app) => {
  const router = express.Router();
  app.use('/api/', router);

  const productService = new ProductService();

  router.get('/', (req, res) => {
    res.send(`API v2`);
  });

  router.get('/receipts', (req, res, next) => {
    let file = path.join(__dirname, receipt);
    res.sendFile(file);
  });

  router.get('/products', async (req, res, next) => {
    try {
      const { tags } = req.query;
      const products = await productService.getProducts({ tags });
      res.status(200).json({
        data: products,
        message: 'products listed'
      });
    } catch (err) {
      next(err);
    }

  });






  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });
}

module.exports = platziStore;