package com.tribal.service.impl;

import com.tribal.model.*;
import com.tribal.repository.*;
import com.tribal.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Map<String, Object> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalSellers", sellerRepository.count());
        metrics.put("totalBuyers", buyerRepository.count());
        metrics.put("totalProducts", productRepository.count());
        metrics.put("totalOrders", orderRepository.count());
        metrics.put("pendingSellers", sellerRepository.countByAdminApprovalStatus("PENDING"));
        long activeOrders = orderRepository.countByStatusNotIn(Arrays.asList("DELIVERED", "CANCELLED"));
        metrics.put("activeOrders", activeOrders);
        Double totalRevenue = orderRepository.sumTotalAmountByStatusIn(Arrays.asList("DELIVERED", "SHIPPED"));
        metrics.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        Double monthlyRevenue = orderRepository.sumTotalAmountByStatusInAndOrderDateAfter(
            Arrays.asList("DELIVERED", "SHIPPED"),
            java.time.LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0)
        );
        metrics.put("monthlyRevenue", monthlyRevenue != null ? monthlyRevenue : 0.0);
        return metrics;
    }

    @Override
    public List<Seller> getAllSellers() {
        return sellerRepository.findAll();
    }

    @Override
    public List<Seller> getPendingSellers(String status) {
        return sellerRepository.findByAdminApprovalStatus(status);
    }

    @Override
    public Seller getSellerbyId(Long sellerId) {
        return sellerRepository.findById(sellerId).orElse(null);
    }

    @Override
    public Seller approveSeller(Long sellerId) {
        Optional<Seller> opt = sellerRepository.findById(sellerId);
        if (opt.isEmpty()) return null;
        Seller seller = opt.get();
        seller.setAdminApprovalStatus("APPROVED");
        return sellerRepository.save(seller);
    }

    @Override
    public Seller suspendSeller(Long sellerId) {
        Optional<Seller> opt = sellerRepository.findById(sellerId);
        if (opt.isEmpty()) return null;
        Seller seller = opt.get();
        seller.setAdminApprovalStatus("REJECTED");
        return sellerRepository.save(seller);
    }

    @Override
    public Seller deleteSeller(Long sellerId) {
        Optional<Seller> opt = sellerRepository.findById(sellerId);
        if (opt.isEmpty()) return null;
        sellerRepository.deleteById(sellerId);
        return opt.get();
    }

    @Override
    public List<Buyer> getAllBuyers() {
        return buyerRepository.findAll();
    }

    @Override
    public Buyer suspendBuyer(Long buyerId) {
        Optional<Buyer> opt = buyerRepository.findById(buyerId);
        if (opt.isEmpty()) return null;
        buyerRepository.deleteById(buyerId);
        return opt.get();
    }

    @Override
    public Buyer getBuyerbyId(Long buyerId) {
        return buyerRepository.findById(buyerId).orElse(null);
    }

    @Override
    public Buyer deleteBuyer(Long buyerId) {
        Optional<Buyer> opt = buyerRepository.findById(buyerId);
        if (opt.isEmpty()) return null;
        buyerRepository.deleteById(buyerId);
        return opt.get();
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product deleteProduct(Long productId) {
        Optional<Product> opt = productRepository.findById(productId);
        if (opt.isEmpty()) return null;
        productRepository.deleteById(productId);
        return opt.get();
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public Admin getProfile() {
        List<Admin> admins = adminRepository.findAll();
        return admins.isEmpty() ? null : admins.get(0);
    }

    @Override
    public Admin updateProfile(Long adminId, Admin updatedAdmin) {
        Optional<Admin> opt = adminRepository.findById(adminId);
        if (opt.isEmpty()) return null;
        Admin admin = opt.get();
        admin.setName(updatedAdmin.getName());
        admin.setAddress(updatedAdmin.getAddress());
        admin.setEmail(updatedAdmin.getEmail());
        admin.setPhone(updatedAdmin.getPhone());
        admin.setPincode(updatedAdmin.getPincode());
        return adminRepository.save(admin);
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {
        Admin admin = getProfile();
        if (admin != null) {
            admin.setPassword(newPassword);
            admin.setConfirmPassword(newPassword);
            adminRepository.save(admin);
        }
    }
}
