import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.ts';
import { JWT_SECRET, AuthRequest } from '../middleware/authMiddleware.ts';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role = 'customer', address, vehicle } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email and password' });
      return;
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      password,
      role: role as 'customer' | 'delivery' | 'admin',
      address: address || '',
      vehicle: vehicle || ''
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        vehicle: user.vehicle
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await UserModel.findOne({ email: cleanEmail });
    if (!user) {
      if (cleanEmail === 'rider@freshcart.com') {
        user = await UserModel.findOne({ email: 'delivery@freshcart.com' });
      } else if (cleanEmail === 'delivery@freshcart.com') {
        user = await UserModel.findOne({ email: 'rider@freshcart.com' });
      }
    }

    if (!user || user.password !== password) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        vehicle: user.vehicle
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    success: true,
    user: req.user
  });
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roleFilter = req.query.role as string;
    const filter: any = {};
    if (roleFilter) {
      filter.role = roleFilter;
    }
    const users = await UserModel.find(filter);
    res.json({
      success: true,
      count: users.length,
      users: users.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        address: u.address,
        vehicle: u.vehicle,
        createdAt: u.createdAt
      }))
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, address, vehicle } = req.body;
    const updated = await UserModel.findByIdAndUpdate(req.user._id, {
      name: name ?? req.user.name,
      phone: phone ?? req.user.phone,
      address: address ?? req.user.address,
      vehicle: vehicle ?? req.user.vehicle
    });
    res.json({ success: true, user: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
