const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const { Sequelize, DataTypes } = require('sequelize');

// Set up in-memory SQLite database and load Category model
const sequelize = new Sequelize('sqlite::memory:', { logging: false });
const Category = require('../../src/models/product/category.model')(sequelize, DataTypes);
const db = { sequelize, Sequelize, Category };

// Mock the models module used by the service
require.cache[require.resolve('../../src/models')] = { exports: db };
const CategoryService = require('../../src/services/category.service');

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

after(async () => {
  await sequelize.close();
});

test('createChildCategory increments existing categories\' lft/rgt correctly', async () => {
  const root1 = await CategoryService.createRootCategory({ name: 'root1', handle: 'root1' });
  const root2 = await CategoryService.createRootCategory({ name: 'root2', handle: 'root2' });

  assert.strictEqual(root1.lft, 1);
  assert.strictEqual(root1.rgt, 2);
  assert.strictEqual(root2.lft, 3);
  assert.strictEqual(root2.rgt, 4);

  const child = await CategoryService.createChildCategory(root1.id, { name: 'child', handle: 'child' });

  await root1.reload();
  await root2.reload();

  assert.strictEqual(root1.lft, 1);
  assert.strictEqual(root1.rgt, 4);
  assert.strictEqual(child.lft, 2);
  assert.strictEqual(child.rgt, 3);
  assert.strictEqual(root2.lft, 5);
  assert.strictEqual(root2.rgt, 6);
});

test('createChildCategory throws error when parentId is invalid', async () => {
  await assert.rejects(
    CategoryService.createChildCategory('bad-id', { name: 'child', handle: 'child' }),
    /Parent category not found/
  );
});
