import { JwtPayload } from "jsonwebtoken";
import prisma from "../../client/prisma";

const getUserDashboard = async (
  userData: JwtPayload & { userEmail: string; role: string }
) => {
  if (userData.role !== "CUSTOMER") {
    throw new Error(
      "Unauthorized access: Dashboard is available only for customers."
    );
  }

  // Fetch customer data
  const customer = await prisma.customer.findUnique({
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
  const totalSpent = customer.orders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const totalDiscounts = customer.orders.reduce(
    (sum, order) => sum + (order.discounts || 0),
    0
  );

  const orderStatus = customer.orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const paymentStatus = customer.orders.reduce((acc, order) => {
    acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
};

const getVendorDashboard = async (
  userData: JwtPayload & { userEmail: string; role: string }
) => {
  // First, get vendor details (vendorId) based on email
  const vendor = await prisma.vendor.findUnique({
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
  const [totalShops, totalProducts, totalCompletedOrders, totalEarnings] =
    await Promise.all([
      prisma.shop.count({
        where: {
          vendorId: vendor.vendorId,
        },
      }),

      prisma.product.count({
        where: {
          shop: {
            vendorId: vendor.vendorId,
          },
        },
      }),

      // Here, we're counting the orders based on the vendor's shop and the related products
      prisma.orderItem.count({
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
      prisma.order.aggregate({
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
};

const getAdminDashboard = async () => {
  try {
    // Fetch delivered orders and total earnings
    const deliveredOrders = await prisma.order.findMany({
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
    const totalUsers = await prisma.user.count();
    const totalCustomers = await prisma.customer.count();
    const totalVendors = await prisma.vendor.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const totalReviews = await prisma.review.count();

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
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    throw new Error("Unable to fetch dashboard data.");
  }
};
export const DashboardService = {
  getUserDashboard,
  getAdminDashboard,
  getVendorDashboard,
};
