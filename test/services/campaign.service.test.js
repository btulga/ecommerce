const sinon = require('sinon');
const { expect } = require('chai');
const CampaignService = require('../../src/services/campaign.service');
const { Campaign, DiscountRule, CampaignDiscountRule } = require('../../src/models');

describe('CampaignService', () => {
  let campaignService;
  let campaignModelMock;
  let discountRuleModelMock;
  let campaignDiscountRuleModelMock;

  beforeEach(() => {
    campaignModelMock = {
      create: sinon.stub(),
      findByPk: sinon.stub(),
      findAll: sinon.stub(),
      update: sinon.stub(),
      destroy: sinon.stub(),
      addDiscountRule: sinon.stub(),
      removeDiscountRule: sinon.stub(),
      setDiscountRules: sinon.stub(),
      hasDiscountRule: sinon.stub(),
      getDiscountRules: sinon.stub(),
    };
    discountRuleModelMock = {
      findByPk: sinon.stub(),
    };
    campaignDiscountRuleModelMock = {
      create: sinon.stub(),
      destroy: sinon.stub(),
    };

    campaignService = new CampaignService({
      Campaign: campaignModelMock,
      DiscountRule: discountRuleModelMock,
      CampaignDiscountRule: campaignDiscountRuleModelMock,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createCampaign', () => {
    it('should create a new campaign', async () => {
      const campaignData = { name: 'Summer Sale', starts_at: new Date(), ends_at: new Date() };
      const createdCampaign = { id: 'campaign-id', ...campaignData };
      campaignModelMock.create.resolves(createdCampaign);

      const result = await campaignService.createCampaign(campaignData);

      expect(campaignModelMock.create.calledOnceWith(campaignData)).to.be.true;
      expect(result).to.deep.equal(createdCampaign);
    });
  });

  describe('getCampaignById', () => {
    it('should return a campaign by ID', async () => {
      const campaignId = 'campaign-id';
      const foundCampaign = { id: campaignId, name: 'Summer Sale' };
      campaignModelMock.findByPk.resolves(foundCampaign);

      const result = await campaignService.getCampaignById(campaignId);

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId, { include: [DiscountRule] })).to.be.true;
      expect(result).to.deep.equal(foundCampaign);
    });

    it('should return null if campaign is not found', async () => {
      const campaignId = 'non-existent-id';
      campaignModelMock.findByPk.resolves(null);

      const result = await campaignService.getCampaignById(campaignId);

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId, { include: [DiscountRule] })).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe('getAllCampaigns', () => {
    it('should return all campaigns', async () => {
      const campaigns = [{ id: 'campaign-1' }, { id: 'campaign-2' }];
      campaignModelMock.findAll.resolves(campaigns);

      const result = await campaignService.getAllCampaigns();

      expect(campaignModelMock.findAll.calledOnce).to.be.true;
      expect(result).to.deep.equal(campaigns);
    });
  });

  describe('updateCampaign', () => {
    it('should update a campaign', async () => {
      const campaignId = 'campaign-id';
      const updateData = { name: 'Winter Sale' };
      const existingCampaign = { id: campaignId, name: 'Summer Sale', update: sinon.stub().resolves({ ...existingCampaign, ...updateData }) };
      campaignModelMock.findByPk.resolves(existingCampaign);

      const result = await campaignService.updateCampaign(campaignId, updateData);

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId)).to.be.true;
      expect(existingCampaign.update.calledOnceWith(updateData)).to.be.true;
      expect(result).to.deep.equal({ ...existingCampaign, ...updateData });
    });

    it('should return null if campaign is not found', async () => {
      const campaignId = 'non-existent-id';
      const updateData = { name: 'Winter Sale' };
      campaignModelMock.findByPk.resolves(null);

      const result = await campaignService.updateCampaign(campaignId, updateData);

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId)).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe('deleteCampaign', () => {
    it('should delete a campaign', async () => {
      const campaignId = 'campaign-id';
      const existingCampaign = { id: campaignId, destroy: sinon.stub().resolves(1) };
      campaignModelMock.findByPk.resolves(existingCampaign);

      const result = await campaignService.deleteCampaign(campaignId);

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId)).to.be.true;
      expect(existingCampaign.destroy.calledOnce).to.be.true;
      expect(result).to.be.true;
    });

    it('should return false if campaign is not found', async () => {
      const campaignId = 'non-existent-id';
      campaignModelMock.findByPk.resolves(null);

      const result = await campaignService.deleteCampaign(campaignId);

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId)).to.be.true;
      expect(result).to.be.false;
    });
  });

  describe('addDiscountRuleToCampaign', () => {
    it('should add a discount rule to a campaign', async () => {
      const campaignId = 'campaign-id';
      const discountRuleId = 'discount-rule-id';
      const campaign = { id: campaignId, addDiscountRule: sinon.stub().resolves() };
      const discountRule = { id: discountRuleId };
      campaignModelMock.findByPk.resolves(campaign);
      discountRuleModelMock.findByPk.resolves(discountRule);

      await campaignService.addDiscountRuleToCampaign(campaignId, discountRuleId);

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId)).to.be.true;
      expect(discountRuleModelMock.findByPk.calledOnceWith(discountRuleId)).to.be.true;
      expect(campaign.addDiscountRule.calledOnceWith(discountRule)).to.be.true;
    });

    it('should throw an error if campaign is not found', async () => {
      const campaignId = 'non-existent-id';
      const discountRuleId = 'discount-rule-id';
      campaignModelMock.findByPk.resolves(null);

      try {
        await campaignService.addDiscountRuleToCampaign(campaignId, discountRuleId);
      } catch (error) {
        expect(error.message).to.equal('Campaign not found');
      }

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId)).to.be.true;
      expect(discountRuleModelMock.findByPk.notCalled).to.be.true;
    });

    it('should throw an error if discount rule is not found', async () => {
      const campaignId = 'campaign-id';
      const discountRuleId = 'non-existent-id';
      const campaign = { id: campaignId, addDiscountRule: sinon.stub().resolves() };
      campaignModelMock.findByPk.resolves(campaign);
      discountRuleModelMock.findByPk.resolves(null);

      try {
        await campaignService.addDiscountRuleToCampaign(campaignId, discountRuleId);
      } catch (error) {
        expect(error.message).to.equal('Discount Rule not found');
      }

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId)).to.be.true;
      expect(discountRuleModelMock.findByPk.calledOnceWith(discountRuleId)).to.be.true;
      expect(campaign.addDiscountRule.notCalled).to.be.true;
    });
  });

  describe('removeDiscountRuleFromCampaign', () => {
    it('should remove a discount rule from a campaign', async () => {
      const campaignId = 'campaign-id';
      const discountRuleId = 'discount-rule-id';
      const campaign = { id: campaignId, removeDiscountRule: sinon.stub().resolves() };
      const discountRule = { id: discountRuleId };
      campaignModelMock.findByPk.resolves(campaign);
      discountRuleModelMock.findByPk.resolves(discountRule);

      await campaignService.removeDiscountRuleFromCampaign(campaignId, discountRuleId);

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId)).to.be.true;
      expect(discountRuleModelMock.findByPk.calledOnceWith(discountRuleId)).to.be.true;
      expect(campaign.removeDiscountRule.calledOnceWith(discountRule)).to.be.true;
    });

    it('should throw an error if campaign is not found', async () => {
      const campaignId = 'non-existent-id';
      const discountRuleId = 'discount-rule-id';
      campaignModelMock.findByPk.resolves(null);

      try {
        await campaignService.removeDiscountRuleFromCampaign(campaignId, discountRuleId);
      } catch (error) {
        expect(error.message).to.equal('Campaign not found');
      }

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId)).to.be.true;
      expect(discountRuleModelMock.findByPk.notCalled).to.be.true;
    });

    it('should throw an error if discount rule is not found', async () => {
      const campaignId = 'campaign-id';
      const discountRuleId = 'non-existent-id';
      const campaign = { id: campaignId, removeDiscountRule: sinon.stub().resolves() };
      campaignModelMock.findByPk.resolves(campaign);
      discountRuleModelMock.findByPk.resolves(null);

      try {
        await campaignService.removeDiscountRuleFromCampaign(campaignId, discountRuleId);
      } catch (error) {
        expect(error.message).to.equal('Discount Rule not found');
      }

      expect(campaignModelMock.findByPk.calledOnceWith(campaignId)).to.be.true;
      expect(discountRuleModelMock.findByPk.calledOnceWith(discountRuleId)).to.be.true;
      expect(campaign.removeDiscountRule.notCalled).to.be.true;
    });
  });
});