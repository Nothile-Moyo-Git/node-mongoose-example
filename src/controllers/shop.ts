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

// Import the cart sequelize
import SequelizeCart from "../models/cart";
import { SequelizeProducts } from "../models/products";
import SequelizeCartItem from "../models/cart-item";

// import our express types for TypeScript use
import { Request, Response, NextFunction } from 'express';
import Products from "../models/products";


// Extend the request object in order to set variables in my request object
interface UserInterface {
    id : number,
    name : string,
    email : string
}

interface RequestWithUserRole extends Request{
    User ?: UserInterface
}

// Instantiate our products 
const productsInstance = new Products();

// Get the shop index page
const getIndex = ( request : RequestWithUserRole, response : Response, next : NextFunction ) => {

    response.render("shop/index", { pageTitle : "Shop" });
};

// Get products controller
const getProducts = (request : any, response : Response, next : NextFunction) => {

    // Render the products page async
    const getProductsAsync = async() => {

        // Get the result of the SQL query
        const result = await productsInstance.fetchAll( request.User[0].dataValues.id );

        // Render the ejs template file, we don't need a file extension to do this
        response.render("shop/product-list", { prods : result, pageTitle: "Shop", path: "/", hasProducts : result.length > 0 });
    };

    getProductsAsync();
};

// Get the orders
const getOrders = ( request : Request, response : Response, next : NextFunction ) => {

    response.render("shop/orders", { pageTitle : "Orders" });
};

// Get the checkout page from the cart
const getCheckout = ( request : Request, response : Response, next : NextFunction ) => {

    response.render("shop/checkout", { pageTitle : "Checkout" });
};

// Get product detail controller
const getProductDetails = ( request : Request, response : Response, next : NextFunction ) => {

    // Get product details async
    const getProductDetailsAsync = async() => {

        const result = await productsInstance.getProductById( request.params.id );

        let hasValue : boolean;
        result.length > 0 ? hasValue = true : hasValue = false;
    
        // Render the admin products ejs template
        response.render("shop/product-detail", { hasProduct : hasValue, productDetails : result[0], pageTitle : "Product Details" });
    };

    getProductDetailsAsync();

};

// Get the cart and all the products inside of it
const getCart = (request : RequestWithUserRole, response : Response, next : NextFunction) => {

    // Get the current cart based on the user
    const getCartAsync = async () => {

        // Get the cart results
        const cart = await request.User[0].getCart();       
        const products = await request.User[0].getProducts();
        const cartProducts = await cart.getProducts();
        
        // Render the admin products ejs template
        response.render("shop/cart", { 
            hasProducts : false, 
            products : cartProducts, 
            pageTitle : "Your Cart",
            totalPrice : 0
         });
    };

    // Execute get cart functionality
    getCartAsync();
};

// Add a new product to the cart using sequelize and a many to many relational mapper
const postCart = (request : any, response : Response, next : NextFunction) => {

    // Setting the product id from the request.body object
    const productId = request.body.productId;

    // Add a product to my cart
    const postCartAsync = async () => {

        // Get the cart
        const cart = await request.User[0].getCart();

        // Get the products associated with that cart
        const products = await cart.getProducts({ where : { id : productId }});

        console.clear();
        console.log("\n\n\n\n\n");

        // If we have a product, add quantity to it
        let product;
        let newQuantity = 1;
        let result;

        // Set the product if it already exists
        if (products.length > 0) {
            product = products[0];
        }

        // Add to the quantity or create a new quantity
        if (product) {

            // When getting a product through the cart, they're linked through a cartitem and an associative query pulls the "through" item through as well
            const cartItem = products[0].dataValues.cartItem;

            // Cart products in the cart items schema and not the products schema as these have the many to many relationship through cart items
            newQuantity = cartItem.dataValues.quantity + 1;

            // Add the product by updating the quantity
            result = await cart.addProduct(product, {
                through : {
                    quantity : newQuantity
                },
                where : {
                    productId : productId
                }
            });

        }else{

            // Get product based on the product id
            const currentProduct = await SequelizeProducts.findAll({ where : { id : productId } });

            // If we get a project, add it to the cart through the quantity which allows the field to be set
            if ( currentProduct ) {

                result = await cart.addProduct(currentProduct[0], { 
                    through : {
                        quantity : newQuantity
                    }
                });
            }
        }


        // Redirect to the cart page
        response.redirect("/cart");
    };

    postCartAsync();
}


export { getCart, postCart, getProducts, getCheckout, getIndex, getOrders, getProductDetails };