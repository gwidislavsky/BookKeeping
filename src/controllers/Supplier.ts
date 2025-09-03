import { Request, Response } from 'express';
import { Supplier } from '../models/Supplier';

export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
// :Promise<void>
export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};