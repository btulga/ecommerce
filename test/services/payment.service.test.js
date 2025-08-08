const PaymentService = require('../../../src/services/payment.service');

// Mock the necessary modules
jest.mock('../../../src/models', () => ({
  Payment: {
    findByPk: jest.fn(),
  },
  // Mock other models if needed by PaymentService methods being tested
  sequelize: {
    transaction: jest.fn().mockImplementation(() => ({
      commit: jest.fn(),
      rollback: jest.fn(),
    })),
  },
}));

jest.mock('../../../src/provider/payment/qpay.service', () => ({
  createInvoice: jest.fn(),
}));

const db = require('../../../src/models');
const QpayService = require('../../../src/services/qpay.service');

describe('PaymentService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initiateProviderPayment', () => {
    it('should call QpayService.createInvoice when provider is qpay', async () => {
      const mockPaymentId = 'payment-abc';
      const mockOrderId = 'order-xyz';
      const mockAmount = 10000; // Example amount in smallest unit
      const mockCurrencyCode = 'mnt';

      const mockPayment = {
        id: mockPaymentId,
        order_id: mockOrderId,
        amount: mockAmount,
        currency_code: mockCurrencyCode,
        provider_id: 'qpay',
        status: 'awaiting',
        // Add any other fields needed by the function
 getOrder: jest.fn().mockResolvedValue({ // Mock the getOrder association to get related order data
          currency_code: mockCurrencyCode,
          // Add other order fields if needed
        }),
        save: jest.fn(), // Mock the save method if the payment object is modified
      };

      db.Payment.findByPk.mockResolvedValue(mockPayment);
      QpayService.createInvoice.mockResolvedValue({ /* Mock QPay invoice response */ });

      await PaymentService.initiateProviderPayment(mockPaymentId, 'qpay');

      // Assert that Payment.findByPk was called
      expect(db.Payment.findByPk).toHaveBeenCalledWith(mockPaymentId);

      // Assert that the getOrder association was called to get order details
 expect(mockPayment.getOrder).toHaveBeenCalled(); // Ensure getOrder was called to fetch order details for currency
      expect(QpayService.createInvoice).toHaveBeenCalledWith(
        mockOrderId,
        mockAmount,
        mockCurrencyCode
      );
    });

    it('should throw an error for an unknown provider', async () => {
        const mockPaymentId = 'payment-unknown';
        const mockPayment = {
            id: mockPaymentId,
            provider_id: 'unknown_provider',
            // ... other fields
        };
 db.Payment.findByPk.mockResolvedValue(mockPayment); // Mock finding the payment

        await expect(PaymentService.initiateProviderPayment(mockPaymentId, 'unknown_provider')).rejects.toThrow('Unsupported payment provider: unknown_provider');
        expect(db.Payment.findByPk).toHaveBeenCalledWith(mockPaymentId);
        expect(QpayService.createInvoice).not.toHaveBeenCalled(); // Ensure QPay service is not called
    });

     it('should throw an error if payment record is not found', async () => {
        const mockPaymentId = 'non-existent-payment';
 db.Payment.findByPk.mockResolvedValue(null); // Mock not finding the payment

        await expect(PaymentService.initiateProviderPayment(mockPaymentId, 'qpay')).rejects.toThrow('Payment record not found');
        expect(db.Payment.findByPk).toHaveBeenCalledWith(mockPaymentId);
        expect(QpayService.createInvoice).not.toHaveBeenCalled(); // Ensure QPay service is not called
    });

    // Add more test cases for other providers if you integrate them later
  });

  // Add tests for other PaymentService functions (createPayment, capturePayment, etc.)
});