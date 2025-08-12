const { Campaign, DiscountRule, CampaignDiscountRule } = require('../models');

/**
 * Creates a new campaign.
 * @param {object} data - The campaign data.
 * @param {string} data.name - The name of the campaign.
 * @param {Date} [data.starts_at] - The start date of the campaign.
 * @param {Date} [data.ends_at] - The end date of the campaign.
 * @param {string[]} [discountRuleIds] - An array of DiscountRule IDs to associate with the campaign.
 * @returns {Promise<Campaign>} The created campaign.
 */
const create = async (data, discountRuleIds = []) => {
  const campaign = await Campaign.create(data);

  if (discountRuleIds && discountRuleIds.length > 0) {
    await campaign.addDiscountRules(discountRuleIds);
  }

  return campaign;
};

/**
 * Retrieves a campaign by its ID.
 * @param {string} id - The campaign ID.
 * @param {object} [options] - Options for the find operation.
 * @returns {Promise<Campaign | null>} The campaign if found, otherwise null.
 */
const retrieve = async (id, options = {}) => {
  return Campaign.findByPk(id, options);
};

/**
 * Retrieves all campaigns.
 * @param {object} [options] - Options for the find operation.
 * @returns {Promise<Campaign[]>} An array of campaigns.
 */
const list = async (options = {}) => {
  return Campaign.findAll(options);
};

/**
 * Updates a campaign.
 * @param {string} id - The campaign ID.
 * @param {object} data - The update data.
 * @param {string[]} [discountRuleIds] - An array of DiscountRule IDs to associate with the campaign.
 * @returns {Promise<Campaign | null>} The updated campaign if found, otherwise null.
 */
const update = async (id, data, discountRuleIds) => {
  const campaign = await retrieve(id);

  if (!campaign) {
    return null;
  }

  await campaign.update(data);

  if (discountRuleIds !== undefined) {
    await campaign.setDiscountRules(discountRuleIds);
  }

  return campaign;
};

/**
 * Deletes a campaign.
 * @param {string} id - The campaign ID.
 * @returns {Promise<number>} The number of destroyed rows (1 if successful, 0 if not found).
 */
const remove = async (id) => {
  return Campaign.destroy({
    where: { id },
  });
};

/**
 * Adds discount rules to a campaign.
 * @param {string} campaignId - The campaign ID.
 * @param {string[]} discountRuleIds - An array of DiscountRule IDs to add.
 * @returns {Promise<void>}\
 */
const addDiscountRules = async (campaignId, discountRuleIds) => {
  const campaign = await retrieve(campaignId);

  if (campaign && discountRuleIds && discountRuleIds.length > 0) {
    await campaign.addDiscountRules(discountRuleIds);
  }
};

/**
 * Removes discount rules from a campaign.
 * @param {string} campaignId - The campaign ID.
 * @param {string[]} discountRuleIds - An array of DiscountRule IDs to remove.
 * @returns {Promise<void>}\
 */
const removeDiscountRules = async (campaignId, discountRuleIds) => {
  const campaign = await retrieve(campaignId);

  if (campaign && discountRuleIds && discountRuleIds.length > 0) {
    await campaign.removeDiscountRules(discountRuleIds);
  }
};

/**
 * Retrieves all discount rules associated with a campaign.
 * @param {string} campaignId - The campaign ID.
 * @returns {Promise<DiscountRule[]>} An array of associated discount rules.
 */
const getDiscountRules = async (campaignId) => {
  const campaign = await retrieve(campaignId, {
    include: [{ model: DiscountRule, through: CampaignDiscountRule }],
  });

  return campaign ? campaign.DiscountRules : [];
};

module.exports = {
  create,
  retrieve,
  list,
  update,
  remove,
  addDiscountRules,
  removeDiscountRules,
  getDiscountRules,
};
