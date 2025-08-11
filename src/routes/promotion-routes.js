const express = require('express');
const router = express.Router();
const promotionService = require('../services/promotion.service');

// Promotion routes
router.post('/promotions', async (req, res) => {
  try {
    const promotion = await promotionService.createPromotion(req.body, req.body.campaignId);
    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/promotions', async (req, res) => {
  try {
    const promotions = await promotionService.getAllPromotions();
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/promotions/:id', async (req, res) => {
  try {
    const promotion = await promotionService.getPromotionById(req.params.id);
    if (promotion) {
      res.status(200).json(promotion);
    } else {
      res.status(404).json({ message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/promotions/:id', async (req, res) => {
  try {
    const updatedPromotion = await promotionService.updatePromotion(req.params.id, req.body, req.body.campaignId);
    if (updatedPromotion) {
      res.status(200).json(updatedPromotion);
    } else {
      res.status(404).json({ message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/promotions/:id', async (req, res) => {
  try {
    const success = await promotionService.deletePromotion(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Campaign routes
router.post('/campaigns', async (req, res) => {
  try {
    const campaign = await promotionService.createCampaign(req.body);
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await promotionService.getAllCampaigns();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await promotionService.getCampaignById(req.params.id);
    if (campaign) {
      res.status(200).json(campaign);
    } else {
      res.status(404).json({ message: 'Campaign not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/campaigns/:id', async (req, res) => {
  try {
    const updatedCampaign = await promotionService.updateCampaign(req.params.id, req.body);
    if (updatedCampaign) {
      res.status(200).json(updatedCampaign);
    } else {
      res.status(404).json({ message: 'Campaign not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/campaigns/:id', async (req, res) => {
  try {
    const success = await promotionService.deleteCampaign(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Campaign not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Promotion Rule routes
router.post('/promotions/:promotionId/rules', async (req, res) => {
  try {
    const rule = await promotionService.addPromotionRule(req.params.promotionId, req.body);
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/promotions/:promotionId/rules/:ruleId', async (req, res) => {
  try {
    const success = await promotionService.removePromotionRule(req.params.promotionId, req.params.ruleId);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Promotion rule not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Promotion Rule Value routes
router.post('/rules/:ruleId/values', async (req, res) => {
  try {
    const ruleValue = await promotionService.addPromotionRuleValue(req.params.ruleId, req.body);
    res.status(201).json(ruleValue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/rules/:ruleId/values/:valueId', async (req, res) => {
  try {
    const success = await promotionService.removePromotionRuleValue(req.params.ruleId, req.params.valueId);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Promotion rule value not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;