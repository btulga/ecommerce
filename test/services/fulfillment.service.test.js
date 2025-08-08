const FulfillmentService = require('../../src/services/fulfillment.service');

// Mock the database models and the TelcoService
jest.mock('../../src/models', () => ({
  Order: {
    findByPk: jest.fn(),
    save: jest.fn(),
  },
  OrderItem: {
    save: jest.fn(),
  },
}));

jest.mock('../../src/services/telco.service', () => ({
  performTopUp: jest.fn(),
  getAvailablePhoneNumbers: jest.fn(),
  activatePhoneNumber: jest.fn(),
}));

const db = require('../../src/models');
const TelcoService = require('../../src/services/telco.service');

describe('FulfillmentService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('fulfillOrder', () => {
    it('should call TelcoService.activatePhoneNumber for digital product type', async () => {
      const mockPhoneNumber = '555-1234';
      const mockOrderItemId = 'order-item-123';

      const mockOrder = {
        id: 'order-abc',
        items: [{
          id: mockOrderItemId,
          variant_id: 'variant-1',
          quantity: 1,
          unit_price: 100,
          target_phone_number: mockPhoneNumber,
          product: {
            id: 'prod-1',
            type: 'digital', // Represents phone number product
            title: 'Phone Number',
          },
          fulfillment_status: 'not_fulfilled',
          save: jest.fn(),
        }],
        fulfillment_status: 'not_fulfilled',
        save: jest.fn(), // Mock save on the order object
      };

      // Mock the updateOrderStatus function to prevent it from interfering
      jest.spyOn(FulfillmentService, 'updateOrderStatus').mockResolvedValue();

      await FulfillmentService.fulfillOrder(mockOrder);

      // Assert that activatePhoneNumber was called for the digital product item
      expect(TelcoService.activatePhoneNumber).toHaveBeenCalledTimes(1);
      expect(TelcoService.activatePhoneNumber).toHaveBeenCalledWith(mockPhoneNumber, mockOrderItemId);

      // Assert that the order item status was updated
      expect(mockOrder.items[0].fulfillment_status).toBe('fulfilled');
      expect(mockOrder.items[0].save).toHaveBeenCalledTimes(1);

      // Assert that the overall order status update was attempted (even if mocked)
      expect(FulfillmentService.updateOrderStatus).toHaveBeenCalledTimes(1);
      expect(FulfillmentService.updateOrderStatus).toHaveBeenCalledWith(mockOrder);
    });

    // Add more test cases for other product types and scenarios
  });
});