package com.tribal.service.impl;

import com.tribal.model.Product;
import com.tribal.model.Seller;
import com.tribal.model.Order;
import com.tribal.repository.ProductRepository;
import com.tribal.repository.SellerRepository;
import com.tribal.repository.OrderRepository;
import com.tribal.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SellerServiceImpl implements SellerService {

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Seller getSellerById(Long sellerId) {
        return sellerRepository.findById(sellerId).orElse(null);
    }

    @Override
    public Seller updateProfile(Long sellerId, Seller updatedSeller) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if (optionalSeller.isEmpty()) return null;
        Seller seller = optionalSeller.get();
        if (updatedSeller.getName() != null) seller.setName(updatedSeller.getName());
        if (updatedSeller.getEmail() != null) seller.setEmail(updatedSeller.getEmail());
        if (updatedSeller.getPassword() != null) seller.setPassword(updatedSeller.getPassword());
        if (updatedSeller.getConfirmPassword() != null) seller.setConfirmPassword(updatedSeller.getConfirmPassword());
        if (updatedSeller.getPhone() != null) seller.setPhone(updatedSeller.getPhone());
        if (updatedSeller.getAddress() != null) seller.setAddress(updatedSeller.getAddress());
        if (updatedSeller.getPincode() != null) seller.setPincode(updatedSeller.getPincode());
        if (updatedSeller.getTribeName() != null) seller.setTribeName(updatedSeller.getTribeName());
        if (updatedSeller.getArtisanCategory() != null) seller.setArtisanCategory(updatedSeller.getArtisanCategory());
        if (updatedSeller.getRegion() != null) seller.setRegion(updatedSeller.getRegion());
        if (updatedSeller.getBio() != null) seller.setBio(updatedSeller.getBio());
        if (updatedSeller.getBankAccountNumber() != null) seller.setBankAccountNumber(updatedSeller.getBankAccountNumber());
        if (updatedSeller.getIfscCode() != null) seller.setIfscCode(updatedSeller.getIfscCode());
        if (updatedSeller.getPanNumber() != null) seller.setPanNumber(updatedSeller.getPanNumber());
        seller.setTermsAccepted(updatedSeller.isTermsAccepted());
        seller.setConsentAccepted(updatedSeller.isConsentAccepted());
        return sellerRepository.save(seller);
    }

    @Override
    public void deleteSeller(Long sellerId) {
        sellerRepository.deleteById(sellerId);
    }

    @Override
    public Product addProduct(Long sellerId, Product product) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if (optionalSeller.isEmpty()) return null;
        product.setSeller(optionalSeller.get());
        return productRepository.save(product);
    }

    @Override
    public List<Product> getProductsBySeller(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    @Override
    public Product updateProduct(Long productId, Product product) {
        Optional<Product> optional = productRepository.findById(productId);
        if (optional.isEmpty()) return null;
        Product existing = optional.get();
        if (product.getName() != null) existing.setName(product.getName());
        if (product.getDescription() != null) existing.setDescription(product.getDescription());
        if (product.getCategory() != null) existing.setCategory(product.getCategory());
        if (product.getPrice() != null) existing.setPrice(product.getPrice());
        if (product.getStock() != null) existing.setStock(product.getStock());
        if (product.getImageUrl() != null) existing.setImageUrl(product.getImageUrl());
        if (product.getFeatured() != null) existing.setFeatured(product.getFeatured());
        return productRepository.save(existing);
    }

    @Override
    public void deleteProduct(Long productId) {
        if (productRepository.existsById(productId)) {
            productRepository.deleteById(productId);
        }
    }

    @Override
    public Seller registerSeller(Seller seller) {
        return sellerRepository.save(seller);
    }

    @Override
    public Seller updateApprovalStatus(Long sellerId, String status) {
        Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
        if (optionalSeller.isEmpty()) return null;
        Seller s = optionalSeller.get();
        s.setAdminApprovalStatus(status);
        return sellerRepository.save(s);
    }

    @Override
    public List<Order> getOrdersBySeller(Long sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, String status) {
        Optional<Order> optional = orderRepository.findById(orderId);
        if (optional.isEmpty()) return null;
        Order order = optional.get();
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Override
    public Map<String, Object> getSellerDashboard(Long sellerId) {
        Map<String, Object> data = new HashMap<>();
        List<Product> products = productRepository.findBySellerId(sellerId);
        List<Order> orders = orderRepository.findBySellerId(sellerId);

        long pending = orders.stream().filter(o -> "Pending".equalsIgnoreCase(o.getStatus())).count();
        double totalSales = orders.stream().mapToDouble(o -> o.getTotalAmount() == null ? 0.0 : o.getTotalAmount()).sum();

        data.put("totalProducts", products.size());
        data.put("totalSales", totalSales);
        data.put("pendingOrders", pending);
        data.put("totalOrders", orders.size());
        return data;
    }
}
