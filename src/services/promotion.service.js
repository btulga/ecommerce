const { Promotion, Campaign, PromotionRule, PromotionRuleValue } = require('../models');

const PromotionService = {
  /**
   * Creates a new promotion.
   * @param {object} data - The promotion data.
   * @param {string} data.name - The name of the promotion.
   * @param {string} data.description - The description of the promotion.
   * @param {Date} data.startDate - The start date of the promotion.
   * @param {Date} data.endDate - The end date of the promotion.
   * @param {boolean} data.active - The active status of the promotion.
   * @param {number} [data.campaignId] - The ID of the associated campaign (optional).
   * @returns {Promise<Promotion>} The created promotion.
   */
  createPromotion: async (data) => {
    return Promotion.create(data);
  },

  /**
   * Retrieves all promotions.
   * @returns {Promise<Array<Promotion>>} A list of all promotions.
   */
  getPromotions: async () => {
    return Promotion.findAll({
      include: [
        { model: PromotionRule, include: [PromotionRuleValue] },
        { model: Campaign }
      ]
    });
  },

  getPromotionById: async (id) => {
    return Promotion.findByPk(id, {
      include: [{
        model: PromotionRule,
        include: [PromotionRuleValue]
      }]
    });
  },

  /**
   * Updates an existing promotion.
   * @param {number} id - The ID of the promotion to update.
   * @param {object} data - The updated promotion data.
   * @returns {Promise<Promotion|null>} The updated promotion or null if not found.
   */
  updatePromotion: async (id, data) => {
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      return null;
    }
    return promotion.update(data);
  },

  /**
   * Deletes a promotion.
   * @param {number} id - The ID of the promotion to delete.
   * @returns {Promise<number>} The number of deleted rows (1 if successful, 0 if not found).
   */
  deletePromotion: async (id) => {
    const promotion = await Promotion.findByPk(id);
    if (!promotion) {
      return null;
    }
    return promotion.destroy();
  },

  /**
   * Adds a promotion rule to a promotion.
   * @param {number} promotionId - The ID of the promotion.
   * @param {object} ruleData - The promotion rule data.
   * @returns {Promise<PromotionRule|null>} The created promotion rule or null if the promotion is not found.
   */
  addPromotionRule: async (promotionId, ruleData) => {
    const promotion = await Promotion.findByPk(promotionId);
    if (!promotion) {
      return null;
    }
    return PromotionRule.create({ ...ruleData, promotionId });
  },

  /**
   * Removes a promotion rule.
   * @param {number} ruleId - The ID of the promotion rule to remove.
   * @returns {Promise<number>} The number of deleted rows (1 if successful, 0 if not found).
   */
  removePromotionRule: async (ruleId) => {
    const rule = await PromotionRule.findByPk(ruleId);
    if (!rule) {
      return null;
    }
    return rule.destroy();
  },

  /**
   * Adds a promotion rule value to a promotion rule.
   * @param {number} ruleId - The ID of the promotion rule.
   * @param {object} valueData - The promotion rule value data.
   * @returns {Promise<PromotionRuleValue|null>} The created promotion rule value or null if the promotion rule is not found.
   */
  addPromotionRuleValue: async (ruleId, valueData) => {
    const rule = await PromotionRule.findByPk(ruleId);
    if (!rule) {
      return null;
    }
    return PromotionRuleValue.create({ ...valueData, promotionRuleId: ruleId });
  },

  /**
   * Removes a promotion rule value.
   * @param {number} valueId - The ID of the promotion rule value to remove.
   * @returns {Promise<number>} The number of deleted rows (1 if successful, 0 if not found).
   */
  removePromotionRuleValue: async (valueId) => {
    const value = await PromotionRuleValue.findByPk(valueId);
    if (!value) {
      return null;
    }
    return value.destroy();
  }
};

const CampaignService = {
  /**
   * Creates a new campaign.
   * @param {object} data - The campaign data.
   * @param {string} data.name - The name of the campaign.
   * @param {string} data.description - The description of the campaign.
   * @param {Date} data.startDate - The start date of the campaign.
   * @param {Date} data.endDate - The end date of the campaign.
   * @returns {Promise<Campaign>} The created campaign.
   */
  createCampaign: async (data) => {
    return Campaign.create(data);
  },

  getCampaigns: async () => {
    return Campaign.findAll({ include: [Promotion] });
  },

  getCampaignById: async (id) => {
    return Campaign.findByPk(id, { include: [Promotion] });
  },

  /**
   * Updates an existing campaign.
   */
  updateCampaign: async (id, data) => {
    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      return null;
    }
    return campaign.update(data);
  },

  /**
   * Deletes a campaign.
   */
  deleteCampaign: async (id) => {
    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      return null;
    }
    return campaign.destroy();
  }
};

module.exports = {
  PromotionService,
  CampaignService
};