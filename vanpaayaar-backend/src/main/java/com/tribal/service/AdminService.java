package com.tribal.service;

import com.tribal.model.*;
import java.util.List;
import java.util.Map;

public interface AdminService {

    Map<String, Object> getDashboardMetrics();

    List<Seller> getAllSellers();
    List<Seller> getPendingSellers(String status);
    Seller getSellerbyId(Long sellerId);
    Seller approveSeller(Long sellerId);
    Seller suspendSeller(Long sellerId);
    Seller deleteSeller(Long sellerId);

    List<Buyer> getAllBuyers();
    Buyer suspendBuyer(Long buyerId);
    Buyer getBuyerbyId(Long buyerId);
    Buyer deleteBuyer(Long buyerId);

    List<Product> getAllProducts();
    Product deleteProduct(Long productId);

    List<Order> getAllOrders();
    Order getOrderById(Long id);

    Admin getProfile();
    Admin updateProfile(Long adminId, Admin updatedAdmin);
    void changePassword(String oldPassword, String newPassword);
}
