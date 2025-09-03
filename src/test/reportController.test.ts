import request from 'supertest';
import app from '../app';
import { Income } from '../models/Income';
import { Expense } from '../models/Expense';


// Mock של מודלי Income ו-Expense
jest.mock('../models/Income');
jest.mock('../models/Expense');

const MockedIncome = Income as jest.Mocked<typeof Income>;
const MockedExpense = Expense as jest.Mocked<typeof Expense>;

describe('Report Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/reports/income-vs-expense', () => {
    it('should get income vs expense report successfully', async () => {
      const mockIncomeResult = [{ _id: null, total: 5000 }];
      const mockExpenseResult = [{ _id: null, total: 3000 }];

      MockedIncome.aggregate = jest.fn().mockResolvedValue(mockIncomeResult);
      MockedExpense.aggregate = jest.fn().mockResolvedValue(mockExpenseResult);

      const response = await request(app)
        .get('/api/reports/income-vs-expense')
        .query({
          from: '2024-01-01',
          to: '2024-12-31'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        totalIncome: 5000,
        totalExpense: 3000
      });

      expect(MockedIncome.aggregate).toHaveBeenCalledWith([
        { $match: { date: { $gte: new Date('2024-01-01'), $lte: new Date('2024-12-31') } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      expect(MockedExpense.aggregate).toHaveBeenCalledWith([
        { $match: { date: { $gte: new Date('2024-01-01'), $lte: new Date('2024-12-31') } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
    });

    it('should handle empty results (no income or expenses)', async () => {
      MockedIncome.aggregate = jest.fn().mockResolvedValue([]);
      MockedExpense.aggregate = jest.fn().mockResolvedValue([]);

      const response = await request(app).get('/api/reports/income-vs-expense');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        totalIncome: 0,
        totalExpense: 0
      });
    });

    it('should use default date range when no dates provided', async () => {
      MockedIncome.aggregate = jest.fn().mockResolvedValue([{ _id: null, total: 2000 }]);
      MockedExpense.aggregate = jest.fn().mockResolvedValue([{ _id: null, total: 1000 }]);

      const response = await request(app).get('/api/reports/income-vs-expense');

      expect(response.status).toBe(200);
      expect(MockedIncome.aggregate).toHaveBeenCalledWith([
        { $match: { date: { $gte: new Date('1970-01-01'), $lte: expect.any(Date) } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
    });

    it('should handle database errors', async () => {
      MockedIncome.aggregate = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/reports/income-vs-expense');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /api/reports/income-analysis', () => {
    it('should get income analysis successfully', async () => {
      const mockAnalysisResult = [
        {
          _id: { client: 'clientId1', paymentType: 'cash' },
          total: 2000,
          count: 3
        },
        {
          _id: { client: 'clientId2', paymentType: 'credit' },
          total: 1500,
          count: 2
        }
      ];

      MockedIncome.aggregate = jest.fn().mockResolvedValue(mockAnalysisResult);

      const response = await request(app)
        .get('/api/reports/income-analysis')
        .query({
          from: '2024-01-01',
          to: '2024-12-31',
          client: 'clientId1',
          paymentType: 'cash'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAnalysisResult);

      expect(MockedIncome.aggregate).toHaveBeenCalledWith([
        { 
          $match: { 
            date: { $gte: new Date('2024-01-01'), $lte: new Date('2024-12-31') },
            client: 'clientId1',
            paymentType: 'cash'
          } 
        },
        {
          $group: {
            _id: { client: '$client', paymentType: '$paymentType' },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);
    });

    it('should handle income analysis without filters', async () => {
      const mockAnalysisResult = [
        {
          _id: { client: 'clientId1', paymentType: 'cash' },
          total: 3000,
          count: 5
        }
      ];

      MockedIncome.aggregate = jest.fn().mockResolvedValue(mockAnalysisResult);

      const response = await request(app).get('/api/reports/income-analysis');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAnalysisResult);

      expect(MockedIncome.aggregate).toHaveBeenCalledWith([
        { $match: {} },
        {
          $group: {
            _id: { client: '$client', paymentType: '$paymentType' },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);
    });

    it('should handle database errors in income analysis', async () => {
      MockedIncome.aggregate = jest.fn().mockRejectedValue(new Error('Analysis error'));

      const response = await request(app).get('/api/reports/income-analysis');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Analysis error');
    });
  });

  describe('GET /api/reports/expense-analysis', () => {
    it('should get expense analysis successfully', async () => {
      const mockExpenseAnalysis = [
        {
          _id: { category: 'categoryId1', paymentType: 'cash' },
          total: 1200,
          count: 4
        },
        {
          _id: { category: 'categoryId2', paymentType: 'credit' },
          total: 800,
          count: 2
        }
      ];

      MockedExpense.aggregate = jest.fn().mockResolvedValue(mockExpenseAnalysis);

      const response = await request(app)
        .get('/api/reports/expense-analysis')
        .query({
          from: '2024-01-01',
          to: '2024-12-31',
          category: 'categoryId1',
          paymentType: 'cash'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockExpenseAnalysis);

      expect(MockedExpense.aggregate).toHaveBeenCalledWith([
        { 
          $match: { 
            date: { $gte: new Date('2024-01-01'), $lte: new Date('2024-12-31') },
            category: 'categoryId1',
            paymentType: 'cash'
          } 
        },
        {
          $group: {
            _id: { category: '$category', paymentType: '$paymentType' },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);
    });

    it('should handle expense analysis without filters', async () => {
      const mockExpenseAnalysis = [
        {
          _id: { category: 'office', paymentType: 'credit' },
          total: 2500,
          count: 8
        }
      ];

      MockedExpense.aggregate = jest.fn().mockResolvedValue(mockExpenseAnalysis);

      const response = await request(app).get('/api/reports/expense-analysis');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockExpenseAnalysis);

      expect(MockedExpense.aggregate).toHaveBeenCalledWith([
        { $match: {} },
        {
          $group: {
            _id: { category: '$category', paymentType: '$paymentType' },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);
    });

    it('should handle partial date filters', async () => {
      const mockExpenseAnalysis = [
        {
          _id: { category: 'travel', paymentType: 'cash' },
          total: 750,
          count: 3
        }
      ];

      MockedExpense.aggregate = jest.fn().mockResolvedValue(mockExpenseAnalysis);

      const response = await request(app)
        .get('/api/reports/expense-analysis')
        .query({
          from: '2024-06-01'
          // no 'to' date
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockExpenseAnalysis);

      expect(MockedExpense.aggregate).toHaveBeenCalledWith([
        { 
          $match: { 
            date: { $gte: new Date('2024-06-01') }
          } 
        },
        {
          $group: {
            _id: { category: '$category', paymentType: '$paymentType' },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);
    });

    it('should handle database errors in expense analysis', async () => {
      MockedExpense.aggregate = jest.fn().mockRejectedValue(new Error('Expense analysis error'));

      const response = await request(app).get('/api/reports/expense-analysis');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Expense analysis error');
    });
  });
});
