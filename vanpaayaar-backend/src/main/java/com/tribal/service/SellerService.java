package com.tribal.service;

import com.tribal.model.Seller;
import com.tribal.model.Product;
import com.tribal.model.Order;

import java.util.List;
import java.util.Map;

public interface SellerService {

    Seller getSellerById(Long sellerId);
    Seller updateProfile(Long sellerId, Seller updatedSeller);
    void deleteSeller(Long sellerId);

    Product addProduct(Long sellerId, Product product);
    List<Product> getProductsBySeller(Long sellerId);
    Product updateProduct(Long productId, Product product);
    void deleteProduct(Long productId);

    Seller registerSeller(Seller seller);
    Seller updateApprovalStatus(Long sellerId, String status);

    List<Order> getOrdersBySeller(Long sellerId);
    Order updateOrderStatus(Long orderId, String status);

    Map<String, Object> getSellerDashboard(Long sellerId);
}
