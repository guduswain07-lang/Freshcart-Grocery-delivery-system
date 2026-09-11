import { Request, Response } from 'express';
import { ProductModel } from '../models/Product.ts';
import { db } from '../config/db.ts';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    const products = await ProductModel.find({
      category: category as string,
      search: search as string
    });
    res.json({ success: true, count: products.length, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, price, quantity, unit, image, description } = req.body;

    if (!name || !category || price === undefined || quantity === undefined) {
      res.status(400).json({ success: false, message: 'Please provide name, category, price, and stock quantity' });
      return;
    }

    const product = await ProductModel.create({
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
      unit: unit || '1 unit',
      image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      description: description || 'Fresh high-quality grocery item delivered straight to your door.'
    });

    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, message: 'Product updated successfully', product: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, message: 'Product deleted successfully', product: deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, categories: db.categories });
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, icon, description } = req.body;
  if (!name) {
    res.status(400).json({ success: false, message: 'Category name is required' });
    return;
  }
  const newCat = {
    _id: 'cat_' + Math.random().toString(36).substr(2, 9),
    name,
    icon: icon || 'ShoppingBag',
    description: description || ''
  };
  db.categories.push(newCat);
  res.status(201).json({ success: true, category: newCat });
};
