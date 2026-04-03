package com.tribal.service;

import com.tribal.model.Cart;
import com.tribal.model.Order;
import com.tribal.model.Product;
import com.tribal.model.Buyer;

import java.util.List;

public interface BuyerService {
    // Products
    List<Product> listProducts();
    Product getProduct(Long productId);

    // Cart
    Cart addToCart(Long buyerId, Long productId, int quantity);
    List<Cart> getCart(Long buyerId);
    Cart updateCartItem(Long cartItemId, int quantity);
    void removeCartItem(Long cartItemId);

    // Orders
    List<Order> placeOrder(Long buyerId);
    List<Order> getOrders(Long buyerId);

    // Profile
    Buyer getProfile(Long buyerId);
    Buyer updateProfile(Long buyerId, Buyer updatedBuyer);

    // Search / Filter
    List<Product> searchProducts(String keyword);
    List<Product> filterProductsByCategory(String category);
    List<Product> filterProductsByPriceRange(double min, double max);
}
