CREATE DATABASE products;
USE products

CREATE TABLE user_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    mob_num VARCHAR(15),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255)
);

CREATE TABLE product_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_quantity INT NOT NULL,
    product_price DECIMAL(10, 2)
);

CREATE TABLE purchase_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    user_name VARCHAR(255),
    product_name VARCHAR(255),
    purchase_quantity INT,
    FOREIGN KEY (user_id) REFERENCES user_details(id),
    FOREIGN KEY (product_id) REFERENCES product_details(id)
);


select * from purchase_details;
