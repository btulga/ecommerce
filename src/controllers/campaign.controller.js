const campaignService = require('../services/campaign.service');

const createCampaign = async (req, res, next) => {
  try {
    const campaignData = req.body;
    const campaign = await campaignService.createCampaign(campaignData);
    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
};

const getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await campaignService.getCampaigns();
    res.status(200).json(campaigns);
  } catch (error) {
    next(error);
  }
};

const getCampaignById = async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    const campaign = await campaignService.getCampaignById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(campaign);
  } catch (error) {
    next(error);
  }
};

const updateCampaign = async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    const campaignData = req.body;
    const updatedCampaign = await campaignService.updateCampaign(campaignId, campaignData);
    if (!updatedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(updatedCampaign);
  } catch (error) {
    next(error);
  }
};

const deleteCampaign = async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    await campaignService.deleteCampaign(campaignId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const addDiscountRuleToCampaign = async (req, res, next) => {
  try {
    const { campaignId, discountRuleId } = req.params;
    await campaignService.addDiscountRuleToCampaign(campaignId, discountRuleId);
    res.status(200).json({ message: 'Discount rule added to campaign successfully' });
  } catch (error) {
    next(error);
  }
};

const removeDiscountRuleFromCampaign = async (req, res, next) => {
  try {
    const { campaignId, discountRuleId } = req.params;
    await campaignService.removeDiscountRuleFromCampaign(campaignId, discountRuleId);
    res.status(200).json({ message: 'Discount rule removed from campaign successfully' });
  } catch (error) {
    next(error);
  }
};

const getDiscountRulesForCampaign = async (req, res, next) => {
    try {
      const { campaignId } = req.params;
      const discountRules = await campaignService.getDiscountRulesForCampaign(campaignId);
      res.status(200).json(discountRules);
    } catch (error) {
      next(error);
    }
  };


module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  addDiscountRuleToCampaign,
  removeDiscountRuleFromCampaign,
  getDiscountRulesForCampaign,
};