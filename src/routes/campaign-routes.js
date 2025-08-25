// src/routes/campaign-routes.js
const express = require('express');
const CampaignController = require('../controllers/campaign.controller');

const router = express.Router();

/**
 * Admin endpoints
 */
router.post('/admin/campaigns', CampaignController.create);
router.put('/admin/campaigns/:id', CampaignController.update);
router.delete('/admin/campaigns/:id', CampaignController.remove);

router.get('/admin/campaigns', CampaignController.listAdmin);
router.get('/admin/campaigns/:id', CampaignController.getOneAdmin);

// статус удирдах
router.patch('/admin/campaigns/:id/status', CampaignController.setStatus);
router.post('/admin/campaigns/:id/activate', CampaignController.activate);
router.post('/admin/campaigns/:id/deactivate', CampaignController.deactivate);

// дууссан кампейнүүдийг expire болгох
router.get('/admin/campaigns/expire-ended', CampaignController.expireEnded);

/**
 * Public endpoints (readonly)
 */
router.get('/campaigns', CampaignController.list);
router.get('/campaigns/:id', CampaignController.getOne);

module.exports = router;
