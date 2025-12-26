<?php
// get all users
function getUsers() {
    $query = "SELECT id, name, username, image FROM users ORDER BY username";
    try {
        global $db;
        $users = $db->query($query);
        $users = $users->fetchAll(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo json_encode($users);
    } catch(PDOException $e) {
        echo json_encode(['error' => ['text' => $e->getMessage()]]);
    }
}

// get single user by id
function getSingleUser($id) {
    $query = "SELECT id, name, username, image FROM users WHERE id = :id";
    try {
        global $db;
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo json_encode($user);
    } catch(PDOException $e) {
        echo json_encode(['error' => ['text' => $e->getMessage()]]);
    }
}

// add new user
function addUser() {
    global $app;
    $request = $app->request();
    $user = json_decode($request->getBody());

    // hash password
    $hashedPassword = password_hash($user->password, PASSWORD_DEFAULT);

    $query = "INSERT INTO users (name, username, password, image)
              VALUES (:name, :username, :password, :image)";
    
    try {
        global $db;
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':name', $user->name);
        $stmt->bindParam(':username', $user->username);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':image', $user->image);
        
        $stmt->execute();
        $user->id = $db->lastInsertId();
        
        unset($user->password);
        
        header("Content-Type: application/json", true);
        echo json_encode($user);
    } catch(PDOException $e) {
        echo json_encode(['error' => ['text' => $e->getMessage()]]);
    }
}

// update user
function updateUser($id) {
    global $app;
    $request = $app->request();
    $user = json_decode($request->getBody());

    // check if password needs updating
    if (!empty($user->password)) {
        $hashedPassword = password_hash($user->password, PASSWORD_DEFAULT);
        $query = "UPDATE users SET 
                    name=:name, username=:username, password=:password, image=:image 
                  WHERE id=:id";
    } else {
        $query = "UPDATE users SET 
                    name=:name, username=:username, image=:image 
                  WHERE id=:id";
    }
              
    try {
        global $db;
        $stmt = $db->prepare($query);

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $user->name);
        $stmt->bindParam(':username', $user->username);
        $stmt->bindParam(':image', $user->image);
        
        if (!empty($user->password)) {
            $stmt->bindParam(':password', $hashedPassword);
        }

        $stmt->execute();
        
        unset($user->password);
        
        header("Content-Type: application/json", true);
        echo json_encode($user);
    } catch(PDOException $e) {
        echo json_encode(['error' => ['text' => $e->getMessage()]]);
    }
}

// delete user
function deleteUser($id) {
    $query = "DELETE FROM users WHERE id=:id";
    try {
        global $db;
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo json_encode(['success' => ['text' => 'user deleted successfully']]);
    } catch(PDOException $e) {
        echo json_encode(['error' => ['text' => $e->getMessage()]]);
    }
}
?>
