import { Router } from 'express';
import CampaignController from '../controllers/campaign.controller';

const router = Router();

// Basic CRUD routes
router.post('/', CampaignController.createCampaign);
router.get('/', CampaignController.getAllCampaigns);
router.get('/:id', CampaignController.getCampaignById);
router.put('/:id', CampaignController.updateCampaign);
router.delete('/:id', CampaignController.deleteCampaign);

// Routes for managing DiscountRule association
router.post('/:campaignId/discount-rules/:discountRuleId', CampaignController.addDiscountRuleToCampaign);
router.delete('/:campaignId/discount-rules/:discountRuleId', CampaignController.removeDiscountRuleFromCampaign);

export default router;