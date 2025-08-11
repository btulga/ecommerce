const { Campaign, DiscountRule, CampaignDiscountRule } = require('../models');

class CampaignService {
  /**
   * Creates a new campaign.
   * @param {object} data - The campaign data.
   * @param {string} data.name - The name of the campaign.
   * @param {Date} [data.starts_at] - The start date of the campaign.
   * @param {Date} [data.ends_at] - The end date of the campaign.
   * @param {string[]} [discountRuleIds] - An array of DiscountRule IDs to associate with the campaign.
   * @returns {Promise<Campaign>} The created campaign.
   */
  async create(data, discountRuleIds = []) {
    const campaign = await Campaign.create(data);

    if (discountRuleIds && discountRuleIds.length > 0) {
      await campaign.addDiscountRules(discountRuleIds);
    }

    return campaign;
  }

  /**
   * Retrieves a campaign by its ID.
   * @param {string} id - The campaign ID.
   * @param {object} [options] - Options for the find operation.
   * @returns {Promise<Campaign | null>} The campaign if found, otherwise null.
   */
  async retrieve(id, options = {}) {
    return Campaign.findByPk(id, options);
  }

  /**
   * Retrieves all campaigns.
   * @param {object} [options] - Options for the find operation.
   * @returns {Promise<Campaign[]>} An array of campaigns.
   */
  async list(options = {}) {
    return Campaign.findAll(options);
  }

  /**
   * Updates a campaign.
   * @param {string} id - The campaign ID.
   * @param {object} data - The update data.
   * @param {string[]} [discountRuleIds] - An array of DiscountRule IDs to associate with the campaign.
   * @returns {Promise<Campaign | null>} The updated campaign if found, otherwise null.
   */
  async update(id, data, discountRuleIds) {
    const campaign = await this.retrieve(id);

    if (!campaign) {
      return null;
    }

    await campaign.update(data);

    if (discountRuleIds !== undefined) {
      await campaign.setDiscountRules(discountRuleIds);
    }

    return campaign;
  }

  /**
   * Deletes a campaign.
   * @param {string} id - The campaign ID.
   * @returns {Promise<number>} The number of destroyed rows (1 if successful, 0 if not found).
   */
  async delete(id) {
    return Campaign.destroy({
      where: { id },
    });
  }

  /**
   * Adds discount rules to a campaign.
   * @param {string} campaignId - The campaign ID.
   * @param {string[]} discountRuleIds - An array of DiscountRule IDs to add.
   * @returns {Promise<void>}
   */
  async addDiscountRules(campaignId, discountRuleIds) {
    const campaign = await this.retrieve(campaignId);

    if (campaign && discountRuleIds && discountRuleIds.length > 0) {
      await campaign.addDiscountRules(discountRuleIds);
    }
  }

  /**
   * Removes discount rules from a campaign.
   * @param {string} campaignId - The campaign ID.
   * @param {string[]} discountRuleIds - An array of DiscountRule IDs to remove.
   * @returns {Promise<void>}
   */
  async removeDiscountRules(campaignId, discountRuleIds) {
    const campaign = await this.retrieve(campaignId);

    if (campaign && discountRuleIds && discountRuleIds.length > 0) {
      await campaign.removeDiscountRules(discountRuleIds);
    }
  }

  /**
   * Retrieves all discount rules associated with a campaign.
   * @param {string} campaignId - The campaign ID.
   * @returns {Promise<DiscountRule[]>} An array of associated discount rules.
   */
  async getDiscountRules(campaignId) {
    const campaign = await this.retrieve(campaignId, {
      include: [{ model: DiscountRule, through: CampaignDiscountRule }],
    });

    return campaign ? campaign.DiscountRules : [];
  }
}

module.exports = CampaignService;