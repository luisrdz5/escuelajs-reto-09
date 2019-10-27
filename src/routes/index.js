const express = require('express');
const path = require('path');
const ProductService = require('../services/products')
const receipt = '../assets/receipt.pdf'
const bodyParser = require('body-parser');

const platziStore = (app) => {
  const router = express.Router();
  app.use(bodyParser.json());
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
  router.get('/products/:productId',  async function(req, res, next) {
      const { productId } = req.params;
      try {
        const products = await productService.getProduct({ productId });

        res.status(200).json({
          data: products,
          message: 'product retrieved'
        });
      } catch (err) {
        next(err);
      }
    }
  );
  router.delete('/products/:productId', async function(req, res, next) {
    const { productId } = req.params;
    try {
      const deletedProductId = await productService.deleteProduct({ productId });
      res.status(200).json({
        data: deletedProductId,
        message: 'product deleted'
      });
    } catch (err) {
      next(err);
    }
  }
);
  router.post('/products', async function(req, res, next) {
    const { body: product } = req;
    try {
      const createdProductId = await productService.createProduct({ product });

      res.status(201).json({
        data: createdProductId,
        message: 'product created'
      });
    } catch (err) {
      next(err);
    }
  });
  router.put('/products/:productId',async function(req, res, next) {
      const { productId } = req.params;
      const { body: product } = req;
      try {
        const updatedProductId = await productService.updateProduct({
          productId,
          product
        });

        res.status(200).json({
          data: updatedProductId,
          message: 'Product updated'
        });
      } catch (err) {
        next(err);
      }
    }
  );



























  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });
}

module.exports = platziStore;