const CouponService = require('../../src/services/coupon.service');
const { Coupon, DiscountRule } = require('../../src/models'); // Assuming models are exported from index.js
const { v4: uuidv4 } = require('uuid');

describe('CouponService', () => {
  let couponService;

  beforeEach(() => {
    // Mock the Coupon and DiscountRule models
    Coupon.create = jest.fn();
    Coupon.findByPk = jest.fn();
    Coupon.findAll = jest.fn();
    Coupon.update = jest.fn();
    Coupon.destroy = jest.fn();
    DiscountRule.findByPk = jest.fn();

    couponService = new CouponService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCoupon', () => {
    it('should create a coupon successfully', async () => {
      const couponData = {
        code: 'SUMMER20',
        usage_limit: 100,
        starts_at: new Date(),
      };
      const createdCoupon = { id: uuidv4(), ...couponData };
      Coupon.create.mockResolvedValue(createdCoupon);

      const result = await couponService.createCoupon(couponData);

      expect(Coupon.create).toHaveBeenCalledWith(couponData);
      expect(result).toEqual(createdCoupon);
    });

    it('should create a coupon with a discount rule', async () => {
      const discountRuleId = uuidv4();
      const couponData = {
        code: 'SUMMER20',
        usage_limit: 100,
        starts_at: new Date(),
        discountRuleId: discountRuleId,
      };
      const createdCoupon = { id: uuidv4(), ...couponData };
      Coupon.create.mockResolvedValue(createdCoupon);
      DiscountRule.findByPk.mockResolvedValue({ id: discountRuleId }); // Mock finding the discount rule

      const result = await couponService.createCoupon(couponData);

      expect(DiscountRule.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(Coupon.create).toHaveBeenCalledWith(couponData);
      expect(result).toEqual(createdCoupon);
    });

    it('should throw an error if the discount rule does not exist', async () => {
      const discountRuleId = uuidv4();
      const couponData = {
        code: 'SUMMER20',
        usage_limit: 100,
        starts_at: new Date(),
        discountRuleId: discountRuleId,
      };
      DiscountRule.findByPk.mockResolvedValue(null); // Mock discount rule not found

      await expect(couponService.createCoupon(couponData)).rejects.toThrow(
        `Discount rule with ID ${discountRuleId} not found.`
      );
      expect(DiscountRule.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(Coupon.create).not.toHaveBeenCalled();
    });
  });

  describe('getCouponById', () => {
    it('should retrieve a coupon by ID', async () => {
      const couponId = uuidv4();
      const coupon = { id: couponId, code: 'TEST' };
      Coupon.findByPk.mockResolvedValue(coupon);

      const result = await couponService.getCouponById(couponId);

      expect(Coupon.findByPk).toHaveBeenCalledWith(couponId, {
        include: [DiscountRule],
      });
      expect(result).toEqual(coupon);
    });

    it('should return null if coupon is not found', async () => {
      const couponId = uuidv4();
      Coupon.findByPk.mockResolvedValue(null);

      const result = await couponService.getCouponById(couponId);

      expect(Coupon.findByPk).toHaveBeenCalledWith(couponId, {
        include: [DiscountRule],
      });
      expect(result).toBeNull();
    });
  });

  describe('getAllCoupons', () => {
    it('should retrieve all coupons', async () => {
      const coupons = [{ id: uuidv4(), code: 'TEST1' }, { id: uuidv4(), code: 'TEST2' }];
      Coupon.findAll.mockResolvedValue(coupons);

      const result = await couponService.getAllCoupons();

      expect(Coupon.findAll).toHaveBeenCalledWith({ include: [DiscountRule] });
      expect(result).toEqual(coupons);
    });
  });

  describe('updateCoupon', () => {
    it('should update a coupon successfully', async () => {
      const couponId = uuidv4();
      const updateData = { usage_limit: 50 };
      const couponToUpdate = { id: couponId, code: 'OLD_CODE', update: jest.fn().mockResolvedValue([1]) };
      Coupon.findByPk.mockResolvedValue(couponToUpdate);
      Coupon.update.mockResolvedValue([1]); // Mock successful update

      const result = await couponService.updateCoupon(couponId, updateData);

      expect(Coupon.findByPk).toHaveBeenCalledWith(couponId);
      expect(Coupon.update).toHaveBeenCalledWith(updateData, {
        where: { id: couponId },
      });
      expect(result).toBe(true);
    });

    it('should return false if coupon to update is not found', async () => {
      const couponId = uuidv4();
      const updateData = { usage_limit: 50 };
      Coupon.findByPk.mockResolvedValue(null);

      const result = await couponService.updateCoupon(couponId, updateData);

      expect(Coupon.findByPk).toHaveBeenCalledWith(couponId);
      expect(Coupon.update).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should update a coupon and associate a discount rule', async () => {
      const couponId = uuidv4();
      const discountRuleId = uuidv4();
      const updateData = { discountRuleId: discountRuleId };
      const couponToUpdate = { id: couponId, code: 'OLD_CODE', update: jest.fn().mockResolvedValue([1]) };
      Coupon.findByPk.mockResolvedValue(couponToUpdate);
      DiscountRule.findByPk.mockResolvedValue({ id: discountRuleId });
      Coupon.update.mockResolvedValue([1]);

      const result = await couponService.updateCoupon(couponId, updateData);

      expect(Coupon.findByPk).toHaveBeenCalledWith(couponId);
      expect(DiscountRule.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(Coupon.update).toHaveBeenCalledWith(updateData, {
        where: { id: couponId },
      });
      expect(result).toBe(true);
    });

    it('should throw an error if the discount rule does not exist during update', async () => {
      const couponId = uuidv4();
      const discountRuleId = uuidv4();
      const updateData = { discountRuleId: discountRuleId };
      const couponToUpdate = { id: couponId, code: 'OLD_CODE', update: jest.fn().mockResolvedValue([1]) };
      Coupon.findByPk.mockResolvedValue(couponToUpdate);
      DiscountRule.findByPk.mockResolvedValue(null);

      await expect(couponService.updateCoupon(couponId, updateData)).rejects.toThrow(
        `Discount rule with ID ${discountRuleId} not found.`
      );
      expect(Coupon.findByPk).toHaveBeenCalledWith(couponId);
      expect(DiscountRule.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(Coupon.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteCoupon', () => {
    it('should delete a coupon successfully', async () => {
      const couponId = uuidv4();
      Coupon.destroy.mockResolvedValue(1); // Mock successful deletion

      const result = await couponService.deleteCoupon(couponId);

      expect(Coupon.destroy).toHaveBeenCalledWith({ where: { id: couponId } });
      expect(result).toBe(true);
    });

    it('should return false if coupon to delete is not found', async () => {
      const couponId = uuidv4();
      Coupon.destroy.mockResolvedValue(0); // Mock no rows deleted

      const result = await couponService.deleteCoupon(couponId);

      expect(Coupon.destroy).toHaveBeenCalledWith({ where: { id: couponId } });
      expect(result).toBe(false);
    });
  });

  // Additional tests for association behavior can be added here
  // For example:
  // - Test retrieving a coupon and verifying the included discount rule data.
  // - Test creating a discount rule and then associating it with a coupon.
  // - Consider testing scenarios where a discount rule associated with a coupon is deleted (depending on foreign key constraints defined in the model/migration).
});