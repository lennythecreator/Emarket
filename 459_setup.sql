CREATE DATABASE IF NOT EXISTS 459midterm;

-- Create Users table
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Plaintext passwords for now
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create Inventory table
CREATE TABLE Inventory (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity_in_stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255) DEFAULT 'https://github.com/shadcn.png'
);

-- Create Transactions table with username as the foreign key
CREATE TABLE Transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50),
    product_id INT,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (product_id) REFERENCES Inventory(product_id)
);


INSERT INTO Users (username, email, password) 
VALUES 
('john_doe', 'john@example.com', 'password123'),
('jane_smith', 'jane@example.com', 'mypassword'),
('michael_brown', 'michael@example.com', 'pass456'),
('susan_lee', 'susan@example.com', 'qwerty789'),
('emily_clark', 'emily@example.com', 'password111');

INSERT INTO Inventory (name, description, price, quantity_in_stock) 
VALUES 
('Sleek Watch', 'A stylish and modern watch', 199.99, 30),
('Designer Sunglasses', 'High-end sunglasses with UV protection', 249.99, 20),
('Wireless Earbuds', 'Noise-cancelling wireless earbuds', 149.99, 100),
('Leather Wallet', 'Premium leather wallet with RFID protection', 79.99, 50),
('Gaming Headset', 'High-quality gaming headset with surround sound', 129.99, 40),
('Fitness Tracker', 'Waterproof fitness tracker with heart rate monitor', 99.99, 60),
('Smartphone', 'A high-end smartphone', 699.99, 25),
('Laptop', 'A powerful laptop', 1299.99, 10),
('Bluetooth Speaker', 'Portable Bluetooth speaker with deep bass', 89.99, 45),
('Wireless Mouse', 'Ergonomic wireless mouse', 39.99, 75);





