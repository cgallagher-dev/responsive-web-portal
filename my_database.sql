DROP DATABASE IF EXISTS LiquorInventory_2025;
CREATE DATABASE IF NOT EXISTS LiquorInventory_2025;
USE LiquorInventory_2025;

-- main alcohol products table
CREATE TABLE booze (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    type VARCHAR(50),
    abv DECIMAL(4,1),
    volume_ml INT,
    origin_country VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    quantity_on_hand INT DEFAULT 0,
    description TEXT,
    PRIMARY KEY(id)
);

-- user accounts table
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    PRIMARY KEY(id)
);

-- add sample products for testing
INSERT INTO booze 
    (name, brand, type, abv, volume_ml, origin_country, price, quantity_on_hand, description) 
VALUES
(
    'Jameson Original', 'Jameson', 'Whiskey', 
    40.0, 700, 'Ireland', 30.50, 50, 
    'The classic, super smooth, triple-distilled Irish whiskey. A global favourite for a reason.'
),
(
    'Guinness Draught', 'Guinness', 'Stout', 
    4.2, 500, 'Ireland', 2.80, 200, 
    'The iconic Irish dry stout. Best served cold from the can. Sold per 500ml can.'
),
(
    'Bulmers Original Irish Cider', 'Bulmers', 'Cider', 
    4.5, 500, 'Ireland', 2.90, 150, 
    'The original crisp Irish cider. Made from 17 varieties of apple. Sold per 500ml bottle.'
),
(
    'Smirnoff Vodka', 'Smirnoff', 'Vodka', 
    37.5, 700, 'Russia', 24.50, 80, 
    'The world''s number one vodka. Triple distilled and perfect for mixing up cocktails.'
),
(
    'Powers Gold Label', 'Powers', 'Whiskey', 
    40.0, 700, 'Ireland', 32.00, 45, 
    'A classic Irish whiskey, full-bodied with a spicy, honeyed flavour. A real staple.'
),
(
    'Dingle Gin', 'Dingle', 'Gin', 
    42.5, 700, 'Ireland', 38.00, 30, 
    'An award-winning artisanal gin from Kerry, made with local botanicals like rowan berry and fuchsia.'
),
(
    'Captain Morgan Spiced Gold', 'Captain Morgan', 'Rum', 
    35.0, 700, 'Jamaica', 26.00, 60, 
    'The classic spiced rum. Smooth and medium-bodied with rich vanilla and caramel notes.'
),
(
    'Heineken', 'Heineken', 'Lager', 
    4.3, 500, 'Netherlands', 3.00, 180, 
    'A premium, globally recognised lager with a mild, slightly bitter taste. Sold per 500ml bottle.'
),
(
    'Baileys Irish Cream', 'Baileys', 'Liqueur', 
    17.0, 700, 'Ireland', 25.00, 40, 
    'The original Irish cream. A perfect blend of Irish whiskey, cream, and rich chocolate.'
),
(
    'Bacardi Superior', 'Bacardi', 'Rum', 
    37.5, 700, 'Cuba', 25.50, 55, 
    'The classic white rum for all your cocktails, from a Mojito to a Daiquiri. Clean and crisp.'
),
(
    'Cork Dry Gin', 'Cork Dry', 'Gin', 
    37.5, 700, 'Ireland', 24.00, 70, 
    'A true Irish classic. A very crisp, traditional London Dry style gin with juniper and citrus.'
),
(
    'Hophouse 13', 'Guinness', 'Lager', 
    4.1, 500, 'Ireland', 2.90, 130, 
    'A modern lager from the brewers at Guinness. Crisp and hoppy with hints of apricot and peach.'
),
(
    'Bushmills Original', 'Bushmills', 'Whiskey', 
    40.0, 700, 'Ireland', 29.00, 40, 
    'A smooth, triple-distilled blend from Ireland''s oldest distillery. Gentle and versatile.'
),
(
    'Bombay Sapphire', 'Bombay', 'Gin', 
    40.0, 700, 'England', 34.00, 35, 
    'A benchmark London Dry Gin. Famous for its bright, vapour-infused botanicals and blue bottle.'
),
(
    'Jack Daniel''s Old No. 7', 'Jack Daniel''s', 'Whiskey', 
    40.0, 700, 'USA', 33.00, 50, 
    'The world''s best-selling Tennessee whiskey. Charcoal mellowed for a sweet, smooth finish.'
);