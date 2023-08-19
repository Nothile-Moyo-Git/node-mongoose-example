// import our express types for TypeScript use
import { Request, Response, NextFunction } from 'express';

// Add product controller
const getAddProduct = (request : Request, response : Response, next : NextFunction) => {

    // Send our HTML file to the browser
    response.render("admin/add-product", { pageTitle: "Add Product", path: "/admin/add-product" });
};

// Post add product controller
const postAddProduct = async(request : Request, response : Response, next : NextFunction) => {

    response.redirect("/shop/products");
};

// Get admin products controller
const getProducts = async (request : Request, response : Response, next : NextFunction) => {

    // Render the view of the page
    response.render("admin/products", { prods : [] , pageTitle : "Admin Products" , hasProducts : false } );
};

// Update product controller
const updateProduct = (request : Request, response : Response, next : NextFunction) => {

    // Render the view of the page
    response.redirect("/admin/products");
};

// Delete product controller
const deleteProduct = async (request : Request, response : Response, next : NextFunction) => {

    // Redirect to the admin products page since we executed admin functionality
    response.redirect("/admin/products");
};

export { getAddProduct, postAddProduct, getProducts, updateProduct, deleteProduct }; 