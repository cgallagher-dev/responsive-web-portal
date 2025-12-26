<?php
// include required files
require 'Slim/Slim.php';
require 'database.php';
require 'booze_api.php';
require 'users_api.php';

// initialize slim
use Slim\Slim;
\Slim\Slim::registerAutoloader();

$app = new Slim();

// booze routes
$app->get('/booze', 'getBooze');
$app->get('/booze/', 'getBooze');
$app->get('/booze/:id', 'getSingleBooze');
$app->get('/booze/:id/', 'getSingleBooze');
$app->post('/booze', 'addBooze');
$app->post('/booze/', 'addBooze');
$app->put('/booze/:id', 'updateBooze');
$app->put('/booze/:id/', 'updateBooze');
$app->delete('/booze/:id', 'deleteBooze');
$app->delete('/booze/:id/', 'deleteBooze');

// user routes
$app->get('/users', 'getUsers');
$app->get('/users/', 'getUsers');
$app->get('/users/:id', 'getSingleUser');
$app->get('/users/:id/', 'getSingleUser');
$app->post('/users', 'addUser');
$app->post('/users/', 'addUser');
$app->put('/users/:id', 'updateUser');
$app->put('/users/:id/', 'updateUser');
$app->delete('/users/:id', 'deleteUser');
$app->delete('/users/:id/', 'deleteUser');

$app->run();
?>