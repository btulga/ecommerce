// src/services/category.service.js
const db = require('../models');
const { Category, sequelize } = db;

const CategoryService = {
    /**
     * Root category-г үүсгэх
     */
    async createRootCategory({ name, description, handle, isActive, isInternal }) {
        // хамгийн баруун талын rgt олох
        const maxRight = await Category.max('rgt') || 0;

        return await Category.create({
            name,
            description,
            handle,
            parent_id: null,
            lft: maxRight + 1,
            rgt: maxRight + 2,
            is_active: isActive ?? true,
            is_internal: isInternal ?? false,
        });
    },

    /**
     * Parent category дотор шинэ хүүхэд үүсгэх
     */
    async createChildCategory(parentId, { name, description, handle, isActive, isInternal }) {
        const parent = await Category.findByPk(parentId);
        if (!parent) throw new Error('Parent category not found');

        // transaction ашиглаж, бүх update-г нэг дор хийх
        return await sequelize.transaction(async (t) => {
            // parent.rgt-ээс баруун талын бүх category-г 2 байр урагшлуулна
            await Category.update(
                { rgt: sequelize.literal('"rgt" + 2') },
                { where: { rgt: { [db.Sequelize.Op.gte]: parent.rgt } }, transaction: t }
            );
            await Category.update(
                { lft: sequelize.literal('"lft" + 2') },
                { where: { lft: { [db.Sequelize.Op.gt]: parent.rgt } }, transaction: t }
            );

            return await Category.create({
                name,
                description,
                handle,
                parent_id: parentId,
                lft: parent.rgt,
                rgt: parent.rgt + 1,
                is_active: isActive ?? true,
                is_internal: isInternal ?? false,
            }, { transaction: t });
        });
    },

    /**
     * Category-г мод бүтцээр нь авах
     */
    async getTree() {
        const categories = await Category.findAll({
            order: [['lft', 'ASC']],
        });
        return categories;
    },

    /**
     * Нэг category болон түүний бүх хүүхдүүдийг авах
     */
    async getSubtree(id) {
        const category = await Category.findByPk(id);
        if (!category) throw new Error('Category not found');

        return await Category.findAll({
            where: {
                lft: { [db.Sequelize.Op.gte]: category.lft },
                rgt: { [db.Sequelize.Op.lte]: category.rgt },
            },
            order: [['lft', 'ASC']],
        });
    },

    /**
     * Category update хийх (нэр, тайлбар, handle гэх мэт)
     */
    async updateCategory(id, updates) {
        const category = await Category.findByPk(id);
        if (!category) throw new Error('Category not found');

        // Хэрэв parent_id өөрчлөгдөөгүй бол энгийн update
        if (!updates.parent_id || updates.parent_id === category.parent_id) {
            return await category.update(updates);
        }

        // --- parent_id өөрчлөгдөх үед ---
        return await sequelize.transaction(async (t) => {
            const newParent = await Category.findByPk(updates.parent_id, { transaction: t });
            if (!newParent) throw new Error('New parent not found');

            // Хуучин subtree-ийн өргөн (width)
            const width = category.rgt - category.lft + 1;

            // 1. Эхлээд тухайн subtree-г "temporal" болгож зай гаргах
            await Category.update(
                { lft: sequelize.literal(`-lft`), rgt: sequelize.literal(`-rgt`) },
                {
                    where: {
                        lft: { [db.Sequelize.Op.gte]: category.lft },
                        rgt: { [db.Sequelize.Op.lte]: category.rgt },
                    },
                    transaction: t,
                }
            );

            // 2. Gap бөглөх (хуучин байрнаас авсан зайг нөхөх)
            await Category.update(
                { lft: sequelize.literal(`lft - ${width}`) },
                { where: { lft: { [db.Sequelize.Op.gt]: category.rgt } }, transaction: t }
            );
            await Category.update(
                { rgt: sequelize.literal(`rgt - ${width}`) },
                { where: { rgt: { [db.Sequelize.Op.gt]: category.rgt } }, transaction: t }
            );

            // 3. Шинэ parent-ийн rgt-д зай гаргах
            await Category.update(
                { rgt: sequelize.literal(`rgt + ${width}`) },
                { where: { rgt: { [db.Sequelize.Op.gte]: newParent.rgt } }, transaction: t }
            );
            await Category.update(
                { lft: sequelize.literal(`lft + ${width}`) },
                { where: { lft: { [db.Sequelize.Op.gt]: newParent.rgt } }, transaction: t }
            );

            // 4. Subtree-г шинэ байрлалд оруулах
            const shift = newParent.rgt - category.lft;
            await Category.update(
                {
                    lft: sequelize.literal(`-lft + ${shift}`),
                    rgt: sequelize.literal(`-rgt + ${shift}`),
                    parent_id: updates.parent_id,
                },
                {
                    where: {
                        lft: { [db.Sequelize.Op.lt]: 0 },
                        rgt: { [db.Sequelize.Op.lt]: 0 },
                    },
                    transaction: t,
                }
            );

            // 5. бусад талбаруудыг энгийнээр update хийх
            return await category.update(updates, { transaction: t });
        });
    },


    /**
     * Category болон бүх хүүхдүүдийг устгах
     */
    async deleteCategory(id) {
        const category = await Category.findByPk(id);
        if (!category) throw new Error('Category not found');

        const width = category.rgt - category.lft + 1;

        return await sequelize.transaction(async (t) => {
            // тухайн модыг устгах
            await Category.destroy({
                where: {
                    lft: { [db.Sequelize.Op.gte]: category.lft },
                    rgt: { [db.Sequelize.Op.lte]: category.rgt },
                },
                transaction: t,
            });

            // gaps бөглөх
            await Category.update(
                { lft: sequelize.literal(`"lft" - ${width}`) },
                { where: { lft: { [db.Sequelize.Op.gt]: category.rgt } }, transaction: t }
            );
            await Category.update(
                { rgt: sequelize.literal(`"rgt" - ${width}`) },
                { where: { rgt: { [db.Sequelize.Op.gt]: category.rgt } }, transaction: t }
            );

            return true;
        });
    },
};

module.exports = CategoryService;
