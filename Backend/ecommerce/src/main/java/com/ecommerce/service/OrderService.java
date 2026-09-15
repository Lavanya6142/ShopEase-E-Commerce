package com.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.ecommerce.entity.Order;
import com.ecommerce.ecommerce.entity.OrderItem;
import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order saveOrder(Order order, String email) {

        User user = userRepository.findByEmail(email);

        if (user != null) {
            order.setUser(user);
        }

        Order savedOrder = orderRepository.save(order);

        if (order.getOrderItems() != null) {

            for (OrderItem item : order.getOrderItems()) {

                item.setOrder(savedOrder);

                if (item.getProduct() != null &&
                    item.getProduct().getId() != null) {

                    item.setProduct(
                        productRepository
                            .findById(item.getProduct().getId())
                            .orElse(null)
                    );
                }

                orderItemRepository.save(item);
            }
        }

        return savedOrder;
    }

    public Order updateOrder(Long id, Order order) {

        Order existingOrder =
                orderRepository.findById(id).orElse(null);

        if (existingOrder != null) {

            existingOrder.setStatus(order.getStatus());

            return orderRepository.save(existingOrder);
        }

        return null;
    }

    public void deleteOrder(Long id) {

        Order order =
                orderRepository.findById(id).orElse(null);

        if (order != null) {

            List<OrderItem> orderItems =
                    orderItemRepository.findAll();

            for (OrderItem item : orderItems) {

                if (item.getOrder() != null &&
                    item.getOrder().getId().equals(id)) {

                    orderItemRepository.delete(item);
                }
            }

            orderRepository.delete(order);
        }
    }

    public Order cancelOrder(Long id) {

    Order order = orderRepository.findById(id).orElse(null);

    if (order != null) {

        order.setStatus("CANCELLED");

        return orderRepository.save(order);
    }

    return null;
  }
}