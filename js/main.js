// root url for api
var rootURL = "http://localhost/liquor_inventory/api/index.php/booze";
var rootUserURL = "http://localhost/liquor_inventory/api/index.php/users";

// datatables references
var productsTable;
var usersTable;

// current edit mode
var isEditing = false;

// helper function to get stock badge - shows stock level with color
function getStockBadge(quantity) {
    if (quantity >= 50) {
        return '<span class="badge badge-success">' + quantity + '</span>';
    } else if (quantity >= 20) {
        return '<span class="badge badge-warning">' + quantity + '</span>';
    } else {
        return '<span class="badge badge-danger">' + quantity + '</span>';
    }
}

// load dashboard stats
function loadDashboardStats() {
    $.ajax({
        url: rootURL,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $('#totalProducts').text(data.length);
            
            // count unique countries (filter out null/empty values)
            var countries = [...new Set(data.map(item => item.origin_country).filter(c => c))];
            $('#totalCountries').text(countries.length);
            
            // count unique types (filter out null/empty values)
            var types = [...new Set(data.map(item => item.type).filter(t => t))];
            $('#totalTypes').text(types.length);
        },
        error: function() {
            $('#totalProducts').text('0');
            $('#totalCountries').text('0');
            $('#totalTypes').text('0');
        }
    });
    
    $.ajax({
        url: rootUserURL,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $('#totalUsers').text(data.length);
        },
        error: function() {
            $('#totalUsers').text('0');
        }
    });
}

$(document).ready(function() {

    // load dashboard stats on page load
    loadDashboardStats();

    // initialize products datatable
    productsTable = $('#productsTable').DataTable({
        ajax: {
            url: rootURL,
            dataSrc: ''
        },
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'brand' },
            { 
                data: 'type',
                render: function(data) {
                    return '<span class="badge badge-secondary">' + data + '</span>';
                }
            },
            { 
                data: 'abv',
                render: function(data) {
                    return data + '%';
                }
            },
            { 
                data: 'volume_ml',
                render: function(data) {
                    return data + 'ml';
                }
            },
            { data: 'origin_country' },
            { 
                data: 'price',
                render: function(data) {
                    return '€' + parseFloat(data).toFixed(2);
                }
            },
            { 
                data: 'quantity_on_hand',
                render: function(data) {
                    return getStockBadge(data);
                }
            },
            {
                data: null,
                render: function(data) {
                    return '<button class="btn btn-sm btn-info btn-view-product" data-id="' + data.id + '"><i class="fas fa-eye"></i></button> ' +
                           '<button class="btn btn-sm btn-warning btn-edit-product" data-id="' + data.id + '"><i class="fas fa-edit"></i></button> ' +
                           '<button class="btn btn-sm btn-danger btn-delete-product" data-id="' + data.id + '"><i class="fas fa-trash"></i></button>';
                }
            }
        ]
    });

    // initialize users datatable
    usersTable = $('#usersTable').DataTable({
        ajax: {
            url: rootUserURL,
            dataSrc: ''
        },
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'username' },
            { 
                data: 'image',
                render: function(data) {
                    if (data) {
                        return '<img src="' + data + '" alt="user" class="user-avatar">';
                    }
                    return '<i class="fas fa-user text-muted"></i>';
                }
            },
            {
                data: null,
                render: function(data) {
                    return '<button class="btn btn-sm btn-warning btn-edit-user" data-id="' + data.id + '"><i class="fas fa-edit"></i></button> ' +
                           '<button class="btn btn-sm btn-danger btn-delete-user" data-id="' + data.id + '"><i class="fas fa-trash"></i></button>';
                }
            }
        ]
    });

    // ==================== product functions ====================

    // add new product
    var addProduct = function() {
        $.ajax({
            type: 'POST',
            url: rootURL,
            contentType: 'application/json',
            dataType: "json",
            data: productFormToJSON(),
            success: function(data) {
                $('#productModal').modal('hide');
                productsTable.ajax.reload();
                alert('product added successfully');
            }
        });
    };

    // update existing product
    var updateProduct = function(id) {
        $.ajax({
            type: 'PUT',
            url: rootURL + '/' + id,
            contentType: 'application/json',
            dataType: "json",
            data: productFormToJSON(),
            success: function(data) {
                $('#productModal').modal('hide');
                productsTable.ajax.reload();
                alert('product updated successfully');
            }
        });
    };

    // delete product
    var deleteProduct = function(id) {
        $.ajax({
            type: 'DELETE',
            url: rootURL + '/' + id,
            dataType: "json",
            success: function(data) {
                $('#deleteModal').modal('hide');
                productsTable.ajax.reload();
                alert('product deleted successfully');
            }
        });
    };

    // get single product for editing
    var getProduct = function(id) {
        $.ajax({
            type: 'GET',
            url: rootURL + '/' + id,
            dataType: "json",
            success: function(data) {
                // populate form with product data
                $('#productId').val(data.id);
                $('#productName').val(data.name);
                $('#productBrand').val(data.brand);
                $('#productType').val(data.type);
                $('#productAbv').val(data.abv);
                $('#productVolume').val(data.volume_ml);
                $('#productCountry').val(data.origin_country);
                $('#productPrice').val(data.price);
                $('#productStock').val(data.quantity_on_hand);
                $('#productDescription').val(data.description);
            }
        });
    };

    // serialize product form to json
    var productFormToJSON = function() {
        return JSON.stringify({
            "name": $('#productName').val(),
            "brand": $('#productBrand').val(),
            "type": $('#productType').val(),
            "abv": $('#productAbv').val(),
            "volume_ml": $('#productVolume').val(),
            "origin_country": $('#productCountry').val(),
            "price": $('#productPrice').val(),
            "quantity_on_hand": $('#productStock').val(),
            "description": $('#productDescription').val()
        });
    };

    // clear product form
    var clearProductForm = function() {
        $('#productId').val('');
        $('#productName').val('');
        $('#productBrand').val('');
        $('#productType').val('');
        $('#productAbv').val('');
        $('#productVolume').val('');
        $('#productCountry').val('');
        $('#productPrice').val('');
        $('#productStock').val('');
        $('#productDescription').val('');
    };

    // ==================== user functions ====================

    // add new user
    var addUser = function() {
        $.ajax({
            type: 'POST',
            url: rootUserURL,
            contentType: 'application/json',
            dataType: "json",
            data: userFormToJSON(),
            success: function(data) {
                $('#userModal').modal('hide');
                usersTable.ajax.reload();
                alert('user added successfully');
            }
        });
    };

    // update existing user
    var updateUser = function(id) {
        $.ajax({
            type: 'PUT',
            url: rootUserURL + '/' + id,
            contentType: 'application/json',
            dataType: "json",
            data: userFormToJSON(),
            success: function(data) {
                $('#userModal').modal('hide');
                usersTable.ajax.reload();
                alert('user updated successfully');
            }
        });
    };

    // delete user
    var deleteUser = function(id) {
        $.ajax({
            type: 'DELETE',
            url: rootUserURL + '/' + id,
            dataType: "json",
            success: function(data) {
                $('#deleteModal').modal('hide');
                usersTable.ajax.reload();
                alert('user deleted successfully');
            }
        });
    };

    // get single user for editing
    var getUser = function(id) {
        $.ajax({
            type: 'GET',
            url: rootUserURL + '/' + id,
            dataType: "json",
            success: function(data) {
                // populate form with user data
                $('#userId').val(data.id);
                $('#userName').val(data.name);
                $('#userUsername').val(data.username);
                $('#userPassword').val('');
                $('#userImage').val(data.image);
            }
        });
    };

    // serialize user form to json
    var userFormToJSON = function() {
        return JSON.stringify({
            "name": $('#userName').val(),
            "username": $('#userUsername').val(),
            "password": $('#userPassword').val(),
            "image": $('#userImage').val()
        });
    };

    // clear user form
    var clearUserForm = function() {
        $('#userId').val('');
        $('#userName').val('');
        $('#userUsername').val('');
        $('#userPassword').val('');
        $('#userImage').val('');
    };

    // ==================== event handlers ====================

    // open add product modal
    $(document).on("click", "#btnAddProduct", function() {
        isEditing = false;
        clearProductForm();
        $('#productModalTitle').text('Add Product');
        $('#productModal').modal('show');
    });

    // open edit product modal
    $(document).on("click", ".btn-edit-product", function() {
        isEditing = true;
        var id = $(this).data('id');
        getProduct(id);
        $('#productModalTitle').text('Edit Product');
        $('#productModal').modal('show');
    });

    // save product (add or update)
    $(document).on("click", "#btnSaveProduct", function() {
        var id = $('#productId').val();
        if (isEditing && id) {
            updateProduct(id);
        } else {
            addProduct();
        }
    });

    // open delete product confirmation
    $(document).on("click", ".btn-delete-product", function() {
        var id = $(this).data('id');
        $('#deleteId').val(id);
        $('#deleteType').val('product');
        $('#deleteModal').modal('show');
    });

    // open add user modal
    $(document).on("click", "#btnAddUser", function() {
        isEditing = false;
        clearUserForm();
        $('#userModalTitle').text('Add User');
        $('#userModal').modal('show');
    });

    // open edit user modal
    $(document).on("click", ".btn-edit-user", function() {
        isEditing = true;
        var id = $(this).data('id');
        getUser(id);
        $('#userModalTitle').text('Edit User');
        $('#userModal').modal('show');
    });

    // save user (add or update)
    $(document).on("click", "#btnSaveUser", function() {
        var id = $('#userId').val();
        if (isEditing && id) {
            updateUser(id);
        } else {
            addUser();
        }
    });

    // open delete user confirmation
    $(document).on("click", ".btn-delete-user", function() {
        var id = $(this).data('id');
        $('#deleteId').val(id);
        $('#deleteType').val('user');
        $('#deleteModal').modal('show');
    });

    // confirm delete action
    $(document).on("click", "#btnConfirmDelete", function() {
        var id = $('#deleteId').val();
        var type = $('#deleteType').val();
        if (type === 'product') {
            deleteProduct(id);
        } else if (type === 'user') {
            deleteUser(id);
        }
    });

    // view product details
    $(document).on("click", ".btn-view-product", function() {
        var id = $(this).data('id');
        $.ajax({
            type: 'GET',
            url: rootURL + '/' + id,
            dataType: "json",
            success: function(data) {
                $('#viewProductName').text(data.name);
                $('#viewProductBrand').text(data.brand);
                $('#viewProductType').text(data.type);
                $('#viewProductCountry').text(data.origin_country);
                $('#viewProductAbv').text(data.abv);
                $('#viewProductVolume').text(data.volume_ml);
                $('#viewProductPrice').text(parseFloat(data.price).toFixed(2));
                $('#viewProductDescription').text(data.description || 'No description available.');
                $('#viewProductModal').modal('show');
            }
        });
    });

    // handle navbar tab switching
    $('.navbar-nav .nav-link').on('click', function(e) {
        e.preventDefault();
        
        // remove active class from all nav links
        $('.navbar-nav .nav-link').removeClass('active');
        
        // add active class to clicked link
        $(this).addClass('active');
        
        // get target tab
        var target = $(this).data('target');
        
        // hide all tab panes and show target
        $('.tab-pane').removeClass('show active');
        $(target).addClass('show active');
        
        // reload stats when returning to home
        if (target === '#home') {
            loadDashboardStats();
        }
    });

    // handle feature card links to switch tabs
    $('.feature-card .btn').on('click', function(e) {
        e.preventDefault();
        var target = $(this).data('target');
        
        // update navbar active state
        $('.navbar-nav .nav-link').removeClass('active');
        $('.navbar-nav .nav-link[data-target="' + target + '"]').addClass('active');
        
        // switch tab
        $('.tab-pane').removeClass('show active');
        $(target).addClass('show active');
    });

});
