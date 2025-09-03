import { Document, Model } from 'mongoose';

declare module 'mongoose' {
  interface Document {
    _id: any; // This adds _id to all documents
  }
}
