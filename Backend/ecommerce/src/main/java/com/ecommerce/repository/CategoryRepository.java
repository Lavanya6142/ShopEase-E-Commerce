package com.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.ecommerce.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}