// src/services/campaign.service.js
const db = require('../models');
const { sequelize, Sequelize, Campaign } = db;
const { Op } = Sequelize;

/**
 * Зөвхөн Campaign-г удирдах сервис
 * - CRUD
 * - Статус өөрчлөх (draft/active/inactive/expired)
 * - Хугацааны энгийн бизнес дүрэм (validate, expire)
 *
 * ТАЙЛБАР:
 *  - Promotion-уудыг энд удирдахгүй. Хэрэв Campaign.associate-д
 *    Campaign.hasMany(models.Promotion, { as: 'promotions', ... }) гэсэн холбоо байгаа бол
 *    getById/list дээр include сонголтоор авч болно.
 */
const CampaignService = {
    /**
     * Нэг campaign авах
     * options: { withPromotions?: boolean }
     */
    async getById(id, options = {}) {
        const include = [];
        if (options.withPromotions && db.Promotion && Campaign.associations?.promotions) {
            include.push({ model: db.Promotion, as: 'promotions' });
        }
        return await Campaign.findByPk(id, { include });
    },

    /**
     * Жагсаалт
     * filters: { q?, status?, starts_from?, ends_to? }
     * pagination: { limit?, offset? }
     * options: { withPromotions?: boolean }
     */
    async list({ q, status, starts_from, ends_to, limit = 50, offset = 0 } = {}, options = {}) {
        const where = {};

        if (q) {
            const like = { [Op.iLike]: `%${q}%` };
            // name, description талбар гэж төсөөлөв — өөрийн схемдээ тааруулж өөрчилнө үү
            where[Op.or] = [{ name: like }, { description: like }];
        }
        if (status) where.status = status;

        if (starts_from || ends_to) {
            // starts_at/ends_at талбарууд гэж төсөөлсөн
            if (starts_from) where.starts_at = { [Op.gte]: new Date(starts_from) };
            if (ends_to) {
                where.ends_at = where.ends_at || {};
                where.ends_at[Op.lte] = new Date(ends_to);
            }
        }

        const include = [];
        if (options.withPromotions && db.Promotion && Campaign.associations?.promotions) {
            include.push({ model: db.Promotion, as: 'promotions' });
        }

        const { rows, count } = await Campaign.findAndCountAll({
            where,
            include,
            limit: Number(limit),
            offset: Number(offset),
            order: [['created_at', 'DESC']],
        });

        return { rows, count };
    },

    /**
     * Үүсгэх
     * data: { name, description?, status?, starts_at?, ends_at?, metadata? ... }
     * - Энд зөвхөн Campaign-г үүсгэнэ. Promotion-уудыг оруулахгүй.
     */
    async create(data) {
        await validateSchedule(data.starts_at, data.ends_at);
        return await Campaign.create(data);
    },

    /**
     * Шинэчлэх
     * - зөвхөн өөрийн талбаруудыг шинэчилнэ (Promotion-уудад нөлөөлөхгүй)
     */
    async update(id, updates) {
        await validateSchedule(updates.starts_at, updates.ends_at);

        const campaign = await Campaign.findByPk(id);
        if (!campaign) throw new Error('Campaign not found');

        await campaign.update(updates);
        return campaign;
    },

    /**
     * Устгах
     * - Promotion-уудыг удирдахгүй; FK CASCADE тохиргоо тань байгаа бол
     *   автоматаар устах, эсвэл RESTRICT байвал алдаа шиднэ (схемээсээ хамаарна)
     */
    async remove(id) {
        const n = await Campaign.destroy({ where: { id } });
        if (n === 0) throw new Error('Campaign not found');
        return true;
    },

    /**
     * Статус удирдах
     */
    async setStatus(id, status) {
        const allowed = new Set(['draft', 'active', 'inactive', 'expired']);
        if (!allowed.has(status)) throw new Error('Invalid status');

        const campaign = await Campaign.findByPk(id);
        if (!campaign) throw new Error('Campaign not found');

        const patch = { status };
        if (status === 'active' && !campaign.activated_at) patch.activated_at = new Date();

        await campaign.update(patch);
        return campaign;
    },

    async activate(id) {
        return this.setStatus(id, 'active');
    },

    async deactivate(id) {
        return this.setStatus(id, 'inactive');
    },

    /**
     * Дууссан кампейнүүдийг expire болгох (cron-оос дуудах зориулалттай)
     */
    async expireEndedCampaigns(now = new Date()) {
        const [affected] = await Campaign.update(
            { status: 'expired' },
            {
                where: {
                    status: { [Op.ne]: 'expired' },
                    ends_at: { [Op.lt]: now },
                },
            }
        );
        return { affected };
    },
};

/** ---- Helpers ---- */

async function validateSchedule(starts_at, ends_at) {
    if (!starts_at && !ends_at) return;
    const s = starts_at ? new Date(starts_at) : null;
    const e = ends_at ? new Date(ends_at) : null;
    if (s && e && s > e) {
        throw new Error('starts_at must be earlier than ends_at');
    }
}

module.exports = CampaignService;
