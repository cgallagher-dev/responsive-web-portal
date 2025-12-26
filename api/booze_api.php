<?php
// get all products
function getBooze() {
    $query = "SELECT * FROM booze ORDER BY brand, name";
    try {
        global $db;
        $booze = $db->query($query);
        $booze = $booze->fetchAll(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo json_encode($booze);
    } catch(PDOException $e) {
        echo json_encode(['error' => ['text' => $e->getMessage()]]);
    }
}

// get single product by id
function getSingleBooze($id) {
    $query = "SELECT * FROM booze WHERE id = :id";
    try {
        global $db;
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $booze = $stmt->fetch(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo json_encode($booze);
    } catch(PDOException $e) {
        echo json_encode(['error' => ['text' => $e->getMessage()]]);
    }
}

// add new product
function addBooze() {
    global $app;
    $request = $app->request();
    $booze = json_decode($request->getBody());

    $query = "INSERT INTO booze (name, brand, type, abv, volume_ml, origin_country, price, quantity_on_hand, description)
              VALUES (:name, :brand, :type, :abv, :volume_ml, :origin_country, :price, :quantity_on_hand, :description)";
    
    try {
        global $db;
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':name', $booze->name);
        $stmt->bindParam(':brand', $booze->brand);
        $stmt->bindParam(':type', $booze->type);
        $stmt->bindParam(':abv', $booze->abv);
        $stmt->bindParam(':volume_ml', $booze->volume_ml);
        $stmt->bindParam(':origin_country', $booze->origin_country);
        $stmt->bindParam(':price', $booze->price);
        $stmt->bindParam(':quantity_on_hand', $booze->quantity_on_hand);
        $stmt->bindParam(':description', $booze->description);
        
        $stmt->execute();
        $booze->id = $db->lastInsertId();
        
        header("Content-Type: application/json", true);
        echo json_encode($booze);
    } catch(PDOException $e) {
        echo json_encode(['error' => ['text' => $e->getMessage()]]);
    }
}

// update product
function updateBooze($id) {
    global $app;
    $request = $app->request();
    $booze = json_decode($request->getBody());

    $query = "UPDATE booze SET 
                name=:name, brand=:brand, type=:type, abv=:abv, 
                volume_ml=:volume_ml, origin_country=:origin_country, 
                price=:price, quantity_on_hand=:quantity_on_hand, description=:description 
              WHERE id=:id";
              
    try {
        global $db;
        $stmt = $db->prepare($query);

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $booze->name);
        $stmt->bindParam(':brand', $booze->brand);
        $stmt->bindParam(':type', $booze->type);
        $stmt->bindParam(':abv', $booze->abv);
        $stmt->bindParam(':volume_ml', $booze->volume_ml);
        $stmt->bindParam(':origin_country', $booze->origin_country);
        $stmt->bindParam(':price', $booze->price);
        $stmt->bindParam(':quantity_on_hand', $booze->quantity_on_hand);
        $stmt->bindParam(':description', $booze->description);

        $stmt->execute();
        
        header("Content-Type: application/json", true);
        echo json_encode($booze);
    } catch(PDOException $e) {
        echo json_encode(['error' => ['text' => $e->getMessage()]]);
    }
}

// delete product
function deleteBooze($id) {
    $query = "DELETE FROM booze WHERE id=:id";
    try {
        global $db;
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo json_encode(['success' => ['text' => 'item deleted successfully']]);
    } catch(PDOException $e) {
        echo json_encode(['error' => ['text' => $e->getMessage()]]);
    }
}
?>