=== Preorders for WooCommerce ===
Contributors: brightvesseldev, niloybrightvessel
Requires at least: 5.0
Tags: preorder,pre order,pre-order,woocommerce preorder,for woocommerce
Requires PHP: 7.2
WC tested up to: 4.9
Tested up to: 5.6
WC requires at least: 3.9
Stable tag: 1.2
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Ultimate Preorders Plugin for WooCommerce.

== Description ==

An efficient system that easily translates to the specific needs of store, our plugin allows you to follow up on pre-sales in a comprehensive way.

The wait for a new product (or the return of a popular one) is a great opportunity to gain new customers or engage older ones. However, too many companies misuse this unique time until customers lose interest. Engaging is critical in the days before a product release, which is why we’ve created a plugin that covers all bases. Give customers a chance to preorder so they’ll get their new item just as it becomes available, letting you monitor each step of the way.
Here’s what you can do with the Bright Plugins WooCommerce preorder Plugin:

* Manage all preorders through a specialized section on My Account.
* Set up a “preorder” status for both simple and variable products.
* Create an expiration date for preorder periods.
* Filter all orders that include products ordered during the “preorder” phase.
* Make products available automatically as soon as the preorder period ends.
* Prevent customers from adding preorder products when they have already-available items on their carts.
* Edit single product prices during the preorder period: fixed, percentage or markup on the base price.
* Apply “preorder” status to more than one product through a WordPress Bulk action grouped by tag or category.
* Enable the preorder option for a variable product, in the case that every variation was previously added to the preorder status.
* Notify website admins when products’ preorder periods are nearing their ends, emailing them a set amount of days before the date.
* Notify users when products’ preorder periods are over and they’ve become fully available.

**Our plugin supports 4 different business cases. Only case #4 is available in this free version. If you need any of the other cases, please [buy a pro license](https://brightplugins.com/woocommerc-preorder-plugin/).**

**Case #1 – Treat the whole order as a preorder**

If you choose this mode, the customer will be able to select a shipping date, and all products will be shipped together at that specific day.

That day will be limited to the latest preorder date available, for instance, if the order has 3 different products marked as preorder ones:

    Product A will be available on the 1st of September
    Product B will be available on the 3rd of September
    Product C will be available on the 1st of October

Then, the minimum shipping date will be the 1st of October (i.e: the minimum date when all products will be available).
Link to: Wordpress and WooCommerce Management

**Case #2 – Generate two separate orders, one for preorders and one for in-stock products**

If you choose this mode, the customer will get two different orders generated, one for preorder products and one for in-stock ones. For instance, if your order looks like this:

    Product A is in-stock
    Product B will be available on the 1st of September
    Product C is in-stock

Then you will get an order which will be processed now, with products A and C, and then another order which will be shipped on the 1st of September.
Link to: Wordpress and WooCommerce Management

**Case #3 – Generate separate orders for each preorder products**

If you choose this mode, then the customer will get one order for all in-stock products, and then one order for each preorder product which will be shipped in each specific preorder date.

**Case #4 – Allow only preorders**

Use this mode if you want to only allow your customers to either choose preorder products or available ones.

= CHECK OUT OUR VIDEO DEMO ON HOW THIS WORKS: =
[youtube https://youtu.be/RPM_J8_dx4U]

**Some other preorder features we offer:**

* Pick an optional date and time when the product will be available for purchase
* Set and Change release dates for preorder products
* Email feature that allows admins to notify all customers who preordered a product
* If products are no longer available, current preorders can be canceled.
* Easily filter through all preorders with a custom order status
* Compatible with simple and variant products
* Optional feature to allow for an additional charge for preorders
* Customize the text on the add to cart buttons for preorders

== Installation ==

= Minimum Requirements =

* PHP 7.2 or greater is recommended
* MySQL 5.6 or greater is recommended

= Automatic installation =

Automatic installation is the easiest option -- WordPress will handles the file transfer, and you won’t need to leave your web browser. To do an automatic install of WooCommerce, log in to your WordPress dashboard, navigate to the Plugins menu, and click “Add New.”
 
In the search field type “WooCommerce Pre Orders,” then click “Search Plugins.” Once you’ve found us,  you can view details about it such as the point release, rating, and description. Most importantly of course, you can install it by! Click “Install Now,” and WordPress will take it from there.

= Manual installation =

Manual installation method requires downloading the WooCommerce Pre Orders plugin and uploading it to your web server via your favorite FTP application. The WordPress codex contains [instructions on how to do this here](https://wordpress.org/support/article/managing-plugins/#manual-plugin-installation).

= Updating =

Automatic updates should work smoothly, but we still recommend you back up your site.

== Frequently Asked Questions ==

=I want the customer to be able to select a preorder date, how can customers select a shipping date?=
Customers can select a preorder date on the checkout page.

=Is there a way to release the preorders before the original due date that we set?= 
The free version of our plugin does not allow this feature. To modify the existing preorder date, you will need to purchase the [premium version](https://brightplugins.com/woocommerc-preorder-plugin/)

= Is detailed documentation available? =
Yes, you can find the documents by [this link](https://share.brightvessel.com/MVy/).

=does the Preorder plugin work with subscription products?=
Preorder plugin is not compatible with subscription products at this moment.

= Is the customer’s credit card charged when the order is placed, or when the product becomes available?=
the customer is charged when the order/preorder is placed.

=Is it possible to manually translate your pre-order plugin  via Poedit (.po/.mo files)?=
Yes, this is possible.

=To set up a “preorder” status for both simple and variable products, do you need the pro version?=
No, you can set up a “preorder” status for simple and variable products in the free version as well.

= Is the extension compatible with my theme? =
This plugin works on the backend, so it will not affect your theme in most cases.

= Do you plan on adding to the plugin? =
We do take feature requests [here](https://share.brightvessel.com/MAb).

== Changelog ==

= 1.2 - 8 Apr 2021 =
* Add : new option to show preorder available date before add to cart button.
* Fixed : Email notification issue

= 1.1.5 - 29 Mar 2021 =
* Fixed : single product page conflict with oceanWP theme 

= 1.1.4 - 9 Mar 2021 =
* Fixed : style for date pickter on the for checkout field
* Fixed: customer order note not sent email notification
* Fixed: WC 5.0 version compability

= 1.1.3 - 22 Jan 2021 =
* Fixed : [block preorder not working](https://wordpress.org/support/topic/block-preorder-not-working/)


= 1.1.2 - 11 Dec 2020 =
* Fixed : Wrong notice display when customer trying to add to cart preorder products from variation.
* Remove : black friday offer banner

= 1.1.1 - 26 Nov 2020 =
* Code refactor
* Small bugfixes
* Added : New Pre-Order email template for admin
* Added : 'preorder_avaiable_date_text_cart' filter add for preorder product cart notice.

= 1.1 - 19 Nov 20 =
* Added : 'change_order_status_on_preorder_date' filter for change the order status on preorder date arrive. default 'wc-completed'.
* Added : blackfriday banner
* Fixed : translation issue.
* Fixed : Prevent enter past dates for preorder products

= 1.0.11 - 19 Nov 2020 =
* Added : 'change_order_status_on_preorder_date' filter for change the order status on preorder date arrive. default 'wc-completed'.
* Fixed : translation issue.
* Fixed : Prevent enter past dates for preorder products

= 1.0.10 =
* Updated .pot file
* Added 'set_free_shipping_min_amount' filter for minium free shipping ammount
* Added 'shop_have_free_shipping_based_on_amount' filter for enable free shipping based on ammount  

= 1.0.9 =
* Fixed Wrong Notification [pending payment] sent on preorder invoice to the customers.
* Fixed Not Sent email Notification to admin for new Order [pre-order].

= 1.0.8 =
* Fixed Wrong preorder notice appear on checkout page

= 1.0.7 =
* Added language catalog files
* Added Settings link into plugin action.
* Fixed Auto complete order issue

= 1.0.6 =
* Small fixes, wording change

= 1.0.5 =
* Fixed duplicated order bugs
* Fixed mixed cart bug
* Added proper customer notifications

= 1.0.4 = 
* Fixed empty order bug

= 1.0.3 =
* Fixed wrong days issue in the cart page
* Fixed CSS conflicts with jQuery UI's calendar

= 1.0.2 =
* Fixed texts
* Fixed critical error on cart

= 1.0.1 = 
* Fixed checkout bug with shipping hook