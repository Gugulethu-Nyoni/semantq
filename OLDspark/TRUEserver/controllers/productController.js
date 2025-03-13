import { productService } from '../services/productService.js';

const productController = {
  // Handle the product purchase
  async buy(req, res) {
    try {
      const { amount, currency, userId, productDetails } = req.body;

      // Call the productService to handle the checkout
      const data = await productService.buy({
        amount, currency, userId, productDetails
      });

      res.status(200).json({ message: 'Product Purchase successful', data });
    } catch (error) {
      res.status(500).json({ message: 'Error buying product', error: error.message });
    }
  },
};

export default productController;
