const Product = require('../models/Product');
const { Op } = require('sequelize');

const normalizeProduct = (product) => {
    if (!product) return null;

    const plain = product.get ? product.get({ plain: true }) : product;

    return {
        id: plain.id,
        title: plain.title,
        desc: plain.description,
        price: Number(plain.price),
        originalPrice: plain.originalPrice !== null && plain.originalPrice !== undefined ? Number(plain.originalPrice) : null,
        images: Array.isArray(plain.images) ? plain.images : [],
        image: Array.isArray(plain.images) && plain.images.length > 0 ? plain.images[0] : null,
        category: plain.category,
        stock: plain.stock,
        sold: plain.sold,
        similar: Array.isArray(plain.similarIds) ? plain.similarIds.map((item) => String(item)) : []
    };
};

const getProducts = async (req, res) => {
    try {
        const { ids } = req.query;

        const where = {};
        if (ids) {
            const idList = ids.split(',').map((item) => item.trim()).filter(Boolean);
            where.id = { [Op.in]: idList };
        }

        const products = await Product.findAll({ order: [['id', 'DESC']], where });
        return res.json(products.map(normalizeProduct));
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load products', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.json(normalizeProduct(product));
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load product', error: error.message });
    }
};

const seedProducts = async (req, res) => {
    try {
        // Xóa tất cả sản phẩm cũ
        await Product.destroy({ where: {}, truncate: true });

        const testProducts = [
            {
                title: 'Áo thun basic',
                description: 'Áo thun cotton mềm mại, form vừa vặn. Thoáng khí, phù hợp mặc hàng ngày.',
                price: 150000,
                originalPrice: 200000,
                images: ['https://via.placeholder.com/800x600?text=Ao+Thun+1', 'https://via.placeholder.com/800x600?text=Ao+Thun+2', 'https://via.placeholder.com/800x600?text=Ao+Thun+3'],
                category: 'Thời trang',
                stock: 25,
                sold: 120,
                similarIds: [2, 3]
            },
            {
                title: 'Quần jean xanh',
                description: 'Quần jean co giãn nhẹ, phong cách hàng ngày. Chất liệu bền bỉ, phù hợp cho mọi độ tuổi.',
                price: 350000,
                originalPrice: null,
                images: ['https://via.placeholder.com/800x600?text=Jean+Xanh+1', 'https://via.placeholder.com/800x600?text=Jean+Xanh+2'],
                category: 'Thời trang',
                stock: 8,
                sold: 89,
                similarIds: [1, 3]
            },
            {
                title: 'Giày sneaker trắng',
                description: 'Giày thể thao thời trang, đế êm, nhẹ nhàng. Thiết kế hiện đại, dễ phối đồ.',
                price: 650000,
                originalPrice: 850000,
                images: ['https://via.placeholder.com/800x600?text=Giay+1', 'https://via.placeholder.com/800x600?text=Giay+2'],
                category: 'Giày dép',
                stock: 0,
                sold: 234,
                similarIds: [1, 2]
            },
            {
                title: 'Áo khoác mùa đông',
                description: 'Áo khoác ấm áp, chất liệu cao cấp. Phù hợp cho thời tiết lạnh, giữ ấm hiệu quả.',
                price: 750000,
                originalPrice: null,
                images: ['https://via.placeholder.com/800x600?text=Ao+Khoac+1'],
                category: 'Thời trang',
                stock: 12,
                sold: 67,
                similarIds: [1, 2]
            },
            {
                title: 'Túi xách da',
                description: 'Túi xách da thật cao cấp, bền bỉ. Thiết kế thanh lịch, phù hợp cho nữ công sở.',
                price: 1200000,
                originalPrice: 1500000,
                images: ['https://via.placeholder.com/800x600?text=Tui+1', 'https://via.placeholder.com/800x600?text=Tui+2'],
                category: 'Phụ kiện',
                stock: 5,
                sold: 43,
                similarIds: [4]
            },
            {
                title: 'Mũ snapback',
                description: 'Mũ snapback năng động, chất liệu tốt. Dễ dàng điều chỉnh kích thước phù hợp.',
                price: 250000,
                originalPrice: null,
                images: ['https://via.placeholder.com/800x600?text=Mu+1'],
                category: 'Phụ kiện',
                stock: 18,
                sold: 156,
                similarIds: [1]
            }
        ];

        const created = await Product.bulkCreate(testProducts);
        return res.status(201).json({
            message: 'Seeded products successfully',
            count: created.length,
            products: created.map(normalizeProduct)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to seed products', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    seedProducts,
    normalizeProduct
};
