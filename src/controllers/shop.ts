/**
 * 
 * Shop controller.
 * This controller handles the routing for the cart and shop functionality.
 * It also hooks up the "shop" model which can be used to manage our data
 * 
 * @method getIndex : ( request : Request, response : Response, next : NextFunction ) => void
 * @method getShop : ( request : Request, response : Response, next : NextFunction ) => void
 * @method getCart : ( request : Request, response : Response, next : NextFunction ) => void
 * @method getCheckout : ( request : Request, response : Response, next : NextFunction ) => void
 * @method getOrders : ( request : Request, response : Response, next : NextFunction ) => void
 * @method getProductDetails : ( request : Request, response : Response, next : NextFunction ) => void
 */


// import our express types for TypeScript use
import { Request, Response, NextFunction } from 'express';

// Get the shop index page
const getIndex = ( request : Request, response : Response, next : NextFunction ) => {

    response.render("shop/index", { pageTitle : "Shop" });
};

// Get products controller
const getProducts = async (request : Request, response : Response, next : NextFunction) => {

    // Testing for Mongoose
    const products = [];

    // Render the products view
    response.render("shop/product-list", { prods : products, pageTitle: "My Products", path: "/", hasProducts : products.length > 0 });
};

// Get the orders
const getOrders = async ( request : Request, response : Response, next : NextFunction ) => {

    // Get the orders for the current user
    const orders = [];

    // Orders will either return an array of BSON(Binary JSON) objects or an empty array
    const hasProducts = orders.length > 0;

    // Render the view page
    response.render("shop/orders", { pageTitle : "Orders", orders : orders, hasProducts : hasProducts });
};

// Get the checkout page from the cart
const getCheckout = ( request : Request, response : Response, next : NextFunction ) => {

    response.render("shop/checkout", { pageTitle : "Checkout" });
};

// Get product detail controller
const getProductDetails = async ( request : Request, response : Response, next : NextFunction ) => {

    // Render the admin products ejs template
    response.render("shop/product-detail", { hasProduct : false, productDetails : {}, pageTitle : "Product details" });
};

// Get the cart and all the products inside of it
const getCart = async (request : any, response : Response, next : NextFunction) => {

    const items = [];
 
    // Render the admin products ejs template
    response.render("shop/cart", { 
        hasProducts : false, 
        products : items, 
        pageTitle : "Your Cart",
        totalPrice : 0
    });
};

// Add a new product to the cart using a post request
// Acts as an add product handler
const postCart = async (request : Request, response : Response, next : NextFunction) => {
    
    // Redirect to the cart page
    response.redirect("/cart");
}

// Delete an item from the cart using cart item
const postCartDelete = (request : Request, response : Response, next : NextFunction) => {

    response.redirect('back');
};

// Create an order in the SQL backend
const postOrderCreate = async (request : Request, response : Response, next : NextFunction) => {
    
    // Move to the orders page
    response.redirect("orders");
};

export { getCart, postCart, postOrderCreate, postCartDelete, getProducts, getCheckout, getIndex, getOrders, getProductDetails };