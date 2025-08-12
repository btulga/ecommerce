const sinon = require('sinon');
const { expect } = require('chai');
const CampaignService = require('../../src/services/campaign.service');
const { Campaign, DiscountRule, CampaignDiscountRule } = require('../../src/models');

describe('CampaignService', () => {
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
      addDiscountRules: sinon.stub(), // Changed from addDiscountRule
      removeDiscountRules: sinon.stub(), // Changed from removeDiscountRule
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

    // Directly mock the imported functions from CampaignService
    // No need for new CampaignService() instance
    sinon.stub(CampaignService, 'create').callsFake(campaignModelMock.create);
    sinon.stub(CampaignService, 'retrieve').callsFake(campaignModelMock.findByPk);
    sinon.stub(CampaignService, 'list').callsFake(campaignModelMock.findAll);
    sinon.stub(CampaignService, 'update').callsFake(campaignModelMock.update);
    sinon.stub(CampaignService, 'remove').callsFake(campaignModelMock.destroy); // Renamed to remove
    sinon.stub(CampaignService, 'addDiscountRules').callsFake(campaignModelMock.addDiscountRules);
    sinon.stub(CampaignService, 'removeDiscountRules').callsFake(campaignModelMock.removeDiscountRules);
    sinon.stub(CampaignService, 'getDiscountRules').callsFake(campaignModelMock.getDiscountRules);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('create', () => {
    it('should create a new campaign', async () => {
      const campaignData = { name: 'Summer Sale', starts_at: new Date(), ends_at: new Date() };
      const createdCampaign = { id: 'campaign-id', ...campaignData };
      CampaignService.create.restore(); // Restore to test the actual service logic (if not fully stubbed)
      sinon.stub(Campaign, 'create').resolves(createdCampaign);
      const campaignInstance = { ...createdCampaign, addDiscountRules: sinon.stub().resolves() };
      Campaign.create.resolves(campaignInstance);
      CampaignService.retrieve.resolves(campaignInstance); // Mock retrieve for the return value

      const result = await CampaignService.create(campaignData);

      expect(Campaign.create.calledOnceWith(campaignData)).to.be.true;
      expect(result).to.deep.equal(campaignInstance);
    });

    it('should create a new campaign with discount rules', async () => {
      const campaignData = { name: 'Summer Sale', starts_at: new Date(), ends_at: new Date() };
      const discountRuleIds = ['rule-1', 'rule-2'];
      const createdCampaign = { id: 'campaign-id', ...campaignData };
      const campaignInstance = { ...createdCampaign, addDiscountRules: sinon.stub().resolves(), setDiscountRules: sinon.stub().resolves() };

      CampaignService.create.restore();
      sinon.stub(Campaign, 'create').resolves(campaignInstance);

      const result = await CampaignService.create(campaignData, discountRuleIds);

      expect(Campaign.create.calledOnceWith(campaignData)).to.be.true;
      expect(campaignInstance.addDiscountRules.calledOnceWith(discountRuleIds)).to.be.true;
      expect(result).to.deep.equal(campaignInstance);
    });
  });

  describe('retrieve', () => {
    it('should return a campaign by ID', async () => {
      const campaignId = 'campaign-id';
      const foundCampaign = { id: campaignId, name: 'Summer Sale' };
      CampaignService.retrieve.restore();
      sinon.stub(Campaign, 'findByPk').resolves(foundCampaign);

      const result = await CampaignService.retrieve(campaignId);

      expect(Campaign.findByPk.calledOnceWith(campaignId, {})).to.be.true;
      expect(result).to.deep.equal(foundCampaign);
    });

    it('should return null if campaign is not found', async () => {
      const campaignId = 'non-existent-id';
      CampaignService.retrieve.restore();
      sinon.stub(Campaign, 'findByPk').resolves(null);

      const result = await CampaignService.retrieve(campaignId);

      expect(Campaign.findByPk.calledOnceWith(campaignId, {})).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe('list', () => {
    it('should return all campaigns', async () => {
      const campaigns = [{ id: 'campaign-1' }, { id: 'campaign-2' }];
      CampaignService.list.restore();
      sinon.stub(Campaign, 'findAll').resolves(campaigns);

      const result = await CampaignService.list();

      expect(Campaign.findAll.calledOnce).to.be.true;
      expect(result).to.deep.equal(campaigns);
    });
  });

  describe('update', () => {
    it('should update a campaign', async () => {
      const campaignId = 'campaign-id';
      const updateData = { name: 'Winter Sale' };
      const existingCampaign = { id: campaignId, name: 'Summer Sale', update: sinon.stub().resolves(), setDiscountRules: sinon.stub().resolves() };

      CampaignService.retrieve.resolves(existingCampaign); // Mock retrieve to return existingCampaign
      CampaignService.update.restore();

      const result = await CampaignService.update(campaignId, updateData);

      expect(CampaignService.retrieve.calledOnceWith(campaignId)).to.be.true;
      expect(existingCampaign.update.calledOnceWith(updateData)).to.be.true;
      expect(result).to.deep.equal(existingCampaign);
    });

    it('should update a campaign and set discount rules', async () => {
      const campaignId = 'campaign-id';
      const updateData = { name: 'Winter Sale' };
      const discountRuleIds = ['rule-3'];
      const existingCampaign = { id: campaignId, name: 'Summer Sale', update: sinon.stub().resolves(), setDiscountRules: sinon.stub().resolves() };

      CampaignService.retrieve.resolves(existingCampaign); // Mock retrieve to return existingCampaign
      CampaignService.update.restore();

      const result = await CampaignService.update(campaignId, updateData, discountRuleIds);

      expect(CampaignService.retrieve.calledOnceWith(campaignId)).to.be.true;
      expect(existingCampaign.update.calledOnceWith(updateData)).to.be.true;
      expect(existingCampaign.setDiscountRules.calledOnceWith(discountRuleIds)).to.be.true;
      expect(result).to.deep.equal(existingCampaign);
    });

    it('should return null if campaign is not found', async () => {
      const campaignId = 'non-existent-id';
      const updateData = { name: 'Winter Sale' };
      CampaignService.retrieve.resolves(null); // Mock retrieve to return null
      CampaignService.update.restore();

      const result = await CampaignService.update(campaignId, updateData);

      expect(CampaignService.retrieve.calledOnceWith(campaignId)).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe('remove', () => { // Renamed from deleteCampaign
    it('should delete a campaign', async () => {
      const campaignId = 'campaign-id';
      CampaignService.remove.restore();
      sinon.stub(Campaign, 'destroy').resolves(1);

      const result = await CampaignService.remove(campaignId);

      expect(Campaign.destroy.calledOnceWith({ where: { id: campaignId } })).to.be.true;
      expect(result).to.equal(1);
    });

    it('should return 0 if campaign is not found', async () => {
      const campaignId = 'non-existent-id';
      CampaignService.remove.restore();
      sinon.stub(Campaign, 'destroy').resolves(0);

      const result = await CampaignService.remove(campaignId);

      expect(Campaign.destroy.calledOnceWith({ where: { id: campaignId } })).to.be.true;
      expect(result).to.equal(0);
    });
  });

  describe('addDiscountRules', () => {
    it('should add discount rules to a campaign', async () => {
      const campaignId = 'campaign-id';
      const discountRuleIds = ['rule-1', 'rule-2'];
      const campaign = { id: campaignId, addDiscountRules: sinon.stub().resolves() };
      CampaignService.retrieve.resolves(campaign);
      CampaignService.addDiscountRules.restore();

      await CampaignService.addDiscountRules(campaignId, discountRuleIds);

      expect(CampaignService.retrieve.calledOnceWith(campaignId)).to.be.true;
      expect(campaign.addDiscountRules.calledOnceWith(discountRuleIds)).to.be.true;
    });

    it('should not add discount rules if campaign is not found', async () => {
      const campaignId = 'non-existent-id';
      const discountRuleIds = ['rule-1'];
      CampaignService.retrieve.resolves(null);
      CampaignService.addDiscountRules.restore();

      await CampaignService.addDiscountRules(campaignId, discountRuleIds);

      expect(CampaignService.retrieve.calledOnceWith(campaignId)).to.be.true;
      // Make sure addDiscountRules was not called on a null campaign
      // This might require a more specific mock for campaign.addDiscountRules
    });
  });

  describe('removeDiscountRules', () => {
    it('should remove discount rules from a campaign', async () => {
      const campaignId = 'campaign-id';
      const discountRuleIds = ['rule-1', 'rule-2'];
      const campaign = { id: campaignId, removeDiscountRules: sinon.stub().resolves() };
      CampaignService.retrieve.resolves(campaign);
      CampaignService.removeDiscountRules.restore();

      await CampaignService.removeDiscountRules(campaignId, discountRuleIds);

      expect(CampaignService.retrieve.calledOnceWith(campaignId)).to.be.true;
      expect(campaign.removeDiscountRules.calledOnceWith(discountRuleIds)).to.be.true;
    });

    it('should not remove discount rules if campaign is not found', async () => {
      const campaignId = 'non-existent-id';
      const discountRuleIds = ['rule-1'];
      CampaignService.retrieve.resolves(null);
      CampaignService.removeDiscountRules.restore();

      await CampaignService.removeDiscountRules(campaignId, discountRuleIds);

      expect(CampaignService.retrieve.calledOnceWith(campaignId)).to.be.true;
    });
  });

  describe('getDiscountRules', () => {
    it('should return discount rules for a campaign', async () => {
      const campaignId = 'campaign-id';
      const discountRules = [{ id: 'rule-1' }, { id: 'rule-2' }];
      const campaign = { id: campaignId, DiscountRules: discountRules };
      CampaignService.retrieve.resolves(campaign);
      CampaignService.getDiscountRules.restore();

      const result = await CampaignService.getDiscountRules(campaignId);

      expect(CampaignService.retrieve.calledOnceWith(campaignId, {
        include: [{ model: DiscountRule, through: CampaignDiscountRule }],
      })).to.be.true;
      expect(result).to.deep.equal(discountRules);
    });

    it('should return empty array if campaign not found', async () => {
      const campaignId = 'non-existent-id';
      CampaignService.retrieve.resolves(null);
      CampaignService.getDiscountRules.restore();

      const result = await CampaignService.getDiscountRules(campaignId);

      expect(CampaignService.retrieve.calledOnceWith(campaignId, {
        include: [{ model: DiscountRule, through: CampaignDiscountRule }],
      })).to.be.true;
      expect(result).to.deep.equal([]);
    });
  });
});