"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const prisma_1 = __importDefault(require("../../client/prisma"));
const getUserDashboard = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    if (userData.role !== "CUSTOMER") {
        throw new Error("Unauthorized access: Dashboard is available only for customers.");
    }
    // Fetch customer data
    const customer = yield prisma_1.default.customer.findUnique({
        where: { email: userData.userEmail },
        select: {
            customerId: true,
            orders: {
                select: {
                    total: true,
                    discounts: true,
                    paymentStatus: true,
                    status: true,
                },
            },
            followers: true,
            Review: true,
        },
    });
    if (!customer) {
        throw new Error("Customer not found.");
    }
    const totalOrders = customer.orders.length;
    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
    const totalDiscounts = customer.orders.reduce((sum, order) => sum + (order.discounts || 0), 0);
    const orderStatus = customer.orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});
    const paymentStatus = customer.orders.reduce((acc, order) => {
        acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
        return acc;
    }, {});
    const totalFollowers = customer.followers.length;
    const totalReviews = customer.Review.length;
    return {
        totalOrders,
        totalSpent,
        totalDiscounts,
        orderStatus,
        paymentStatus,
        totalFollowers,
        totalReviews,
    };
});
const getVendorDashboard = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // First, get vendor details (vendorId) based on email
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: {
            email: userData.userEmail,
        },
        select: {
            vendorId: true,
        },
    });
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    // Run all other queries in parallel using Promise.all
    const [totalShops, totalProducts, totalCompletedOrders, totalEarnings] = yield Promise.all([
        prisma_1.default.shop.count({
            where: {
                vendorId: vendor.vendorId,
            },
        }),
        prisma_1.default.product.count({
            where: {
                shop: {
                    vendorId: vendor.vendorId,
                },
            },
        }),
        // Here, we're counting the orders based on the vendor's shop and the related products
        prisma_1.default.orderItem.count({
            where: {
                product: {
                    shop: {
                        vendorId: vendor.vendorId,
                    },
                },
                order: {
                    paymentStatus: "COMPLETED",
                    status: "DELIVERED",
                },
            },
        }),
        // Aggregate earnings based on the vendor's products in orders
        prisma_1.default.order.aggregate({
            _sum: {
                subTotal: true,
            },
            where: {
                items: {
                    some: {
                        product: {
                            shop: {
                                vendorId: vendor.vendorId,
                            },
                        },
                    },
                },
                paymentStatus: "COMPLETED",
                status: "DELIVERED",
            },
        }),
    ]);
    return {
        totalShops,
        totalProducts,
        totalCompletedOrders,
        totalEarnings: totalEarnings._sum.subTotal || 0, // Fallback if no earnings
    };
});
const getAdminDashboard = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch delivered orders and total earnings
        const deliveredOrders = yield prisma_1.default.order.findMany({
            where: {
                status: "DELIVERED", // Only fetch orders with 'DELIVERED' status
            },
            include: {
                customer: true, // Include customer details
                items: {
                    include: {
                        product: true, // Include product details for each order item
                        shop: true, // Include shop details for each order item
                    },
                },
            },
        });
        // Calculate total earnings from delivered orders
        const totalEarnings = deliveredOrders.reduce((accum, order) => {
            return accum + order.total; // Sum up the total price of each delivered order
        }, 0);
        // Fetch the count of different entities
        const totalUsers = yield prisma_1.default.user.count();
        const totalCustomers = yield prisma_1.default.customer.count();
        const totalVendors = yield prisma_1.default.vendor.count();
        const totalProducts = yield prisma_1.default.product.count();
        const totalOrders = yield prisma_1.default.order.count();
        const totalReviews = yield prisma_1.default.review.count();
        // Combine all the data
        return {
            deliveredOrders,
            totalEarnings,
            totalUsers,
            totalCustomers,
            totalVendors,
            totalProducts,
            totalOrders,
            totalReviews,
        };
    }
    catch (error) {
        console.error("Error getting dashboard data:", error);
        throw new Error("Unable to fetch dashboard data.");
    }
});
exports.DashboardService = {
    getUserDashboard,
    getAdminDashboard,
    getVendorDashboard,
};
