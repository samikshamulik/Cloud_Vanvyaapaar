package com.tribal.controller;

import com.tribal.model.*;
import com.tribal.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard/metrics")
    public ResponseEntity<?> getDashboardMetrics() {
        return ResponseEntity.ok(adminService.getDashboardMetrics());
    }

    @GetMapping("/sellers")
    public ResponseEntity<?> getAllSellers() {
        List<Seller> sellers = adminService.getAllSellers();
        if (sellers.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No seller found!");
        return ResponseEntity.ok(sellers);
    }

    @GetMapping("/sellers/pending")
    public ResponseEntity<?> getPendingSellers(@RequestParam String status) {
        List<Seller> sellers = adminService.getPendingSellers(status);
        if (sellers.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No " + status + " seller found!");
        return ResponseEntity.ok(sellers);
    }

    @GetMapping("/sellers/{id}")
    public ResponseEntity<?> getSellerById(@PathVariable Long id) {
        Seller seller = adminService.getSellerbyId(id);
        if (seller != null) return ResponseEntity.ok(seller);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No seller exists with ID: " + id);
    }

    @PutMapping("/sellers/{id}/approve")
    public ResponseEntity<?> approveSeller(@PathVariable Long id) {
        Seller seller = adminService.approveSeller(id);
        if (seller != null) return ResponseEntity.ok("Seller approved: " + seller.getId());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No seller found with id " + id);
    }

    @PutMapping("/sellers/{id}/suspend")
    public ResponseEntity<?> suspendSeller(@PathVariable Long id) {
        Seller seller = adminService.suspendSeller(id);
        if (seller != null) return ResponseEntity.ok("Seller suspended: " + seller.getId());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No seller found with id " + id);
    }

    @PutMapping("/sellers/{id}/delete")
    public ResponseEntity<?> deleteSeller(@PathVariable Long id) {
        Seller seller = adminService.deleteSeller(id);
        if (seller != null) return ResponseEntity.ok("Seller deleted: " + seller.getId());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No seller found with id " + id);
    }

    @GetMapping("/buyers")
    public ResponseEntity<?> getAllBuyers() {
        List<Buyer> buyers = adminService.getAllBuyers();
        if (buyers.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No buyers exist");
        return ResponseEntity.ok(buyers);
    }

    @GetMapping("/buyers/{id}")
    public ResponseEntity<?> getBuyerById(@PathVariable Long id) {
        Buyer buyer = adminService.getBuyerbyId(id);
        if (buyer != null) return ResponseEntity.ok(buyer);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No buyer found: " + id);
    }

    @DeleteMapping("/buyers/{id}")
    public ResponseEntity<?> deleteBuyer(@PathVariable Long id) {
        Buyer buyer = adminService.deleteBuyer(id);
        if (buyer != null) return ResponseEntity.ok(buyer);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Buyer not found: " + id);
    }

    @PutMapping("/buyers/{id}/suspend")
    public ResponseEntity<?> suspendBuyer(@PathVariable Long id) {
        Buyer buyer = adminService.suspendBuyer(id);
        if (buyer != null) return ResponseEntity.ok(buyer);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No buyer found: " + id);
    }

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts() {
        List<Product> products = adminService.getAllProducts();
        if (products.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No products found");
        return ResponseEntity.ok(products);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Product product = adminService.deleteProduct(id);
        if (product != null) return ResponseEntity.ok("Product deleted: " + product.getId());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No product found with ID: " + id);
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        List<Order> orders = adminService.getAllOrders();
        if (orders.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No orders found");
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        Order order = adminService.getOrderById(id);
        if (order != null) return ResponseEntity.ok(order);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No order found with ID: " + id);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Admin admin = adminService.getProfile();
        if (admin != null) return ResponseEntity.ok(admin);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin profile not found");
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Admin updatedAdmin) {
        Admin admin = adminService.updateProfile(id, updatedAdmin);
        if (admin != null) return ResponseEntity.ok(admin);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found with ID: " + id);
    }

    @PutMapping("/profile/change-password")
    public ResponseEntity<?> changePassword(@RequestParam String oldPassword, @RequestParam String newPassword) {
        adminService.changePassword(oldPassword, newPassword);
        return ResponseEntity.ok("Password updated");
    }
}
