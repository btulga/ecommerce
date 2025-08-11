const promotionService = require('../../src/services/promotion.service');
const { Promotion, Campaign, PromotionRule, PromotionRuleValue } = require('../../src/models');

jest.mock('../../src/models', () => ({
  Promotion: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    belongsTo: jest.fn(),
    hasMany: jest.fn(),
  },
  Campaign: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    hasMany: jest.fn(),
  },
  PromotionRule: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    belongsTo: jest.fn(),
    hasMany: jest.fn(),
  },
  PromotionRuleValue: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    belongsTo: jest.fn(),
  },
}));

describe('Promotion Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Campaigns', () => {
    it('should create a campaign', async () => {
      const campaignData = { name: 'Summer Sale', description: 'Summer discount campaign', startDate: new Date(), endDate: new Date() };
      const createdCampaign = { id: 1, ...campaignData };
      Campaign.create.mockResolvedValue(createdCampaign);

      const campaign = await promotionService.createCampaign(campaignData);
      expect(Campaign.create).toHaveBeenCalledWith(campaignData);
      expect(campaign).toEqual(createdCampaign);
    });

    it('should get a campaign by ID', async () => {
      const campaignId = 1;
      const campaign = { id: campaignId, name: 'Summer Sale' };
      Campaign.findByPk.mockResolvedValue(campaign);

      const result = await promotionService.getCampaign(campaignId);
      expect(Campaign.findByPk).toHaveBeenCalledWith(campaignId, expect.anything());
      expect(result).toEqual(campaign);
    });

    it('should get all campaigns', async () => {
      const campaigns = [{ id: 1, name: 'Summer Sale' }, { id: 2, name: 'Winter Sale' }];
      Campaign.findAll.mockResolvedValue(campaigns);

      const result = await promotionService.getAllCampaigns();
      expect(Campaign.findAll).toHaveBeenCalledWith(expect.anything());
      expect(result).toEqual(campaigns);
    });

    it('should update a campaign', async () => {
      const campaignId = 1;
      const updateData = { name: 'Updated Summer Sale' };
      const updatedCampaign = { id: campaignId, ...updateData };
      Campaign.update.mockResolvedValue([1]); // Sequelize update returns an array with the number of affected rows
      Campaign.findByPk.mockResolvedValue(updatedCampaign);

      const result = await promotionService.updateCampaign(campaignId, updateData);
      expect(Campaign.update).toHaveBeenCalledWith(updateData, { where: { id: campaignId } });
      expect(Campaign.findByPk).toHaveBeenCalledWith(campaignId, expect.anything());
      expect(result).toEqual(updatedCampaign);
    });

    it('should delete a campaign', async () => {
      const campaignId = 1;
      Campaign.destroy.mockResolvedValue(1); // Sequelize destroy returns the number of deleted rows

      const result = await promotionService.deleteCampaign(campaignId);
      expect(Campaign.destroy).toHaveBeenCalledWith({ where: { id: campaignId } });
      expect(result).toBe(true);
    });

    it('should return false if campaign deletion fails', async () => {
      const campaignId = 1;
      Campaign.destroy.mockResolvedValue(0);

      const result = await promotionService.deleteCampaign(campaignId);
      expect(Campaign.destroy).toHaveBeenCalledWith({ where: { id: campaignId } });
      expect(result).toBe(false);
    });
  });

  describe('Promotions', () => {
    it('should create a promotion', async () => {
      const promotionData = { name: '10% Off', description: '10% discount on all items', startDate: new Date(), endDate: new Date(), active: true, campaignId: 1 };
      const createdPromotion = { id: 1, ...promotionData };
      Promotion.create.mockResolvedValue(createdPromotion);

      const promotion = await promotionService.createPromotion(promotionData);
      expect(Promotion.create).toHaveBeenCalledWith(promotionData);
      expect(promotion).toEqual(createdPromotion);
    });

    it('should get a promotion by ID', async () => {
      const promotionId = 1;
      const promotion = { id: promotionId, name: '10% Off' };
      Promotion.findByPk.mockResolvedValue(promotion);

      const result = await promotionService.getPromotion(promotionId);
      expect(Promotion.findByPk).toHaveBeenCalledWith(promotionId, expect.anything());
      expect(result).toEqual(promotion);
    });

    it('should get all promotions', async () => {
      const promotions = [{ id: 1, name: '10% Off' }, { id: 2, name: 'Free Shipping' }];
      Promotion.findAll.mockResolvedValue(promotions);

      const result = await promotionService.getAllPromotions();
      expect(Promotion.findAll).toHaveBeenCalledWith(expect.anything());
      expect(result).toEqual(promotions);
    });

    it('should update a promotion', async () => {
      const promotionId = 1;
      const updateData = { name: 'Updated 10% Off' };
      const updatedPromotion = { id: promotionId, ...updateData };
      Promotion.update.mockResolvedValue([1]);
      Promotion.findByPk.mockResolvedValue(updatedPromotion);

      const result = await promotionService.updatePromotion(promotionId, updateData);
      expect(Promotion.update).toHaveBeenCalledWith(updateData, { where: { id: promotionId } });
      expect(Promotion.findByPk).toHaveBeenCalledWith(promotionId, expect.anything());
      expect(result).toEqual(updatedPromotion);
    });

    it('should delete a promotion', async () => {
      const promotionId = 1;
      Promotion.destroy.mockResolvedValue(1);

      const result = await promotionService.deletePromotion(promotionId);
      expect(Promotion.destroy).toHaveBeenCalledWith({ where: { id: promotionId } });
      expect(result).toBe(true);
    });

    it('should return false if promotion deletion fails', async () => {
      const promotionId = 1;
      Promotion.destroy.mockResolvedValue(0);

      const result = await promotionService.deletePromotion(promotionId);
      expect(Promotion.destroy).toHaveBeenCalledWith({ where: { id: promotionId } });
      expect(result).toBe(false);
    });

    it('should add a promotion rule', async () => {
      const promotionId = 1;
      const ruleData = { type: 'discount', condition: {}, configuration: {} };
      const createdRule = { id: 1, promotionId: promotionId, ...ruleData };
      PromotionRule.create.mockResolvedValue(createdRule);

      const rule = await promotionService.addPromotionRule(promotionId, ruleData);
      expect(PromotionRule.create).toHaveBeenCalledWith({ ...ruleData, promotionId: promotionId });
      expect(rule).toEqual(createdRule);
    });

    it('should remove a promotion rule', async () => {
      const ruleId = 1;
      PromotionRule.destroy.mockResolvedValue(1);

      const result = await promotionService.removePromotionRule(ruleId);
      expect(PromotionRule.destroy).toHaveBeenCalledWith({ where: { id: ruleId } });
      expect(result).toBe(true);
    });

    it('should return false if promotion rule removal fails', async () => {
      const ruleId = 1;
      PromotionRule.destroy.mockResolvedValue(0);

      const result = await promotionService.removePromotionRule(ruleId);
      expect(PromotionRule.destroy).toHaveBeenCalledWith({ where: { id: ruleId } });
      expect(result).toBe(false);
    });

    it('should add a promotion rule value', async () => {
      const ruleId = 1;
      const valueData = { value: 10.00, metadata: {} };
      const createdValue = { id: 1, promotionRuleId: ruleId, ...valueData };
      PromotionRuleValue.create.mockResolvedValue(createdValue);

      const value = await promotionService.addPromotionRuleValue(ruleId, valueData);
      expect(PromotionRuleValue.create).toHaveBeenCalledWith({ ...valueData, promotionRuleId: ruleId });
      expect(value).toEqual(createdValue);
    });

    it('should remove a promotion rule value', async () => {
      const valueId = 1;
      PromotionRuleValue.destroy.mockResolvedValue(1);

      const result = await promotionService.removePromotionRuleValue(valueId);
      expect(PromotionRuleValue.destroy).toHaveBeenCalledWith({ where: { id: valueId } });
      expect(result).toBe(true);
    });

    it('should return false if promotion rule value removal fails', async () => {
      const valueId = 1;
      PromotionRuleValue.destroy.mockResolvedValue(0);

      const result = await promotionService.removePromotionRuleValue(valueId);
      expect(PromotionRuleValue.destroy).toHaveBeenCalledWith({ where: { id: valueId } });
      expect(result).toBe(false);
    });
  });
});