<?php
/*
 * Template Name: CardNetTheme
 * Description: Allow customer to enter the credit card.
 */

require_once(__DIR__ . '/../CardNetApi.php');
require_once(__DIR__ . '/../CardNetCustomer.php');

use WPGraphQL\CardNet\CardNetApi;
use WPGraphQL\CardNet\CardNetCustomer;

class CardNetTheme extends \WC_Settings_API
{


    function __construct()
    {
        $this->id = "carnetpayment";
        $this->validation();
    }


    function validation()
    {
        global $wp;
        if (is_user_logged_in()) {
            $this->loadCardnetSDK();
            $this->body();
            $this->initCardNet();
        } else {

            wp_redirect(wp_login_url(site_url(add_query_arg(array(), $wp->request))));
            exit;

            echo <<< EOT
            <style>
                .container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.9em;
                }
            </style>
            <div class="container">
                You cannot access this page.
            </div>
            EOT;
        }
    }

    function body()
    {
?>
<style>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.9em;
}
</style>

<form id="shoppingcart_form">
    <div class="container">
        <button onClick="window.location.reload();" style="display: none;" id="btnCheckout">Agregar Tardeta de
            crédito</button>
    </div>
    <p>
        <input type="hidden" id="PWTokenAux" name="PWTokenAux" /></span>
    </p>
</form>
<?php
    }


    /**
     * CardNet Javascript code
     */

    function initCardNet()
    {

    ?>
<script>
function OnTokenReceived(token) {
    var payload = JSON.stringify({
        token: token.TokenId,
        error: null
    })
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(payload);
    }
}

function showReloadButton() {
    var x = document.getElementById("btnCheckout");
    x.style.display = "block";
}

function initCreditCard() {

    PWCheckout.Bind("tokenCreated", OnTokenReceived);
    PWCheckout.SetProperties({
        "name": "<?= $this->getSiteName() ?>",
        "image": "<?= $this->getLogoUrl() ?>",
        "description": "Checkout Creditel Test.",
        "currency": "DOP",
        "form_id": "shoppingcart_form",
        "checkout_card": 1,
        "autoSubmit": "false",
    });

    <?php
                $customerData = $this->getCustomerData();
                $public_key = $this->getPublicKey();
                ?>

    var captureUrl = "<?= $customerData['captureURL']; ?>";;
    var key = "<?= $public_key; ?>";
    var customerUniqueId = "<?= $customerData['uniqueID'] ?>";
    var url = `${captureUrl}?key=${key}&session_id=${customerUniqueId}`;

    PWCheckout.OpenIframeCustom(url, customerUniqueId);

    setTimeout(function() {
        var bg = "#10488d";
        var modalView = document.getElementById("custom_modal");

        if (modalView) {
            modalView.setAttribute("onclick", null);
            modalView.style["overflow-y"] = "scroll"
            modalView.style["background-color"] = bg;
        } else {
            alert("no")
        }

        showReloadButton();

    }, 500)
    console.log(PWCheckout)
}




window.onload = function() {
    initCreditCard();
};
</script>
<?php
    }

    /**
     * Get Public cardNet Api key
     */
    function getPublicKey()
    {
        $public_key = $this->get_option('cardnet_test_mode') == "yes" ? $this->get_option('cardnet_demo_public_api_key') : $this->get_option('cardnet_demo_public_api_key');
        return $public_key;
    }

    function getBaseUrl()
    {
        $public_key = $this->get_option('cardnet_test_mode') == "yes" ? $this->get_option('cardnet_demo_base_url') : $this->get_option('cardnet_base_url');
        return $public_key;
    }

    /**
     * Load cardNet JS SDK
     */
    function loadCardnetSDK()
    {
        $bgColor = "#10488d";
        $public_key = $this->getPublicKey();
        $baseUrl = $this->getBaseUrl();
    ?>

<style>
body {
    background-color: <?=$bgColor;
    ?>;
}
</style>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<script src="<?= "{$baseUrl}/Scripts/PWCheckout.js?key={$public_key}" ?>">
</script>
<?php  }



    /**
     * Get Wordpress site name
     */
    function getSiteName()
    {
        return esc_attr(get_bloginfo('name'));
    }

    /**
     * Get custom workpress site logo
     */
    function getLogoUrl()
    {
        $custom_logo_id = get_theme_mod('custom_logo');
        $custom_logo_data = wp_get_attachment_image_src($custom_logo_id, 'full');
        return $custom_logo_data[0];
    }

    /**
     * Error Response to React Native
     */
    function sendErrorJS($errorMessage)
    {
        echo <<<EOT
    var payload = JSON.stringify({
        token: null,
        error: "$errorMessage"
    });
    if(window.ReactNativeWebView){
       window.ReactNativeWebView.postMessage(payload);
    }
    EOT;
    }

    /**
     * Get cardNet customer ID from the current user or get a new customerID 
     * to show the UI to enter the credit cards
     */
    function getCustomerData()
    {

        $userData = wp_get_current_user();
        $fname = get_user_meta($userData->ID, 'first_name', true);
        $lname = get_user_meta($userData->ID, 'last_name', true);
        $phoneNumber = get_user_meta($userData->ID, 'phone_number', true);

        $cardnetCustomerId = get_user_meta($userData->ID, 'cardnetCustomerId', true);

        $uniqueID = "";
        $captureURL = "";
        $cardNetApi = new CardNetApi();

        if (!$cardnetCustomerId) {
            //create a new one.

            $payload = [
                "CommerceCustomerId" => $userData->ID,
                "FirstName" => $fname,
                "LastName" => $lname,
                "Email" => $userData->user_email,
                "PhoneNumbe" => $phoneNumber,
                "Enabled" => true,
            ];

            try {
                $result = $cardNetApi->add_new_customer($payload);
                $data = CardNetCustomer::mapCustomerObject($result);

                $cardNetCustomerId = $data['customerId'];
                $uniqueID = $data['uniqueID'];
                $captureURL = $data['captureURL'];

                //Update the customerId on the current user
                update_user_meta($userData->ID, "cardnetCustomerId", $cardNetCustomerId);
            } catch (Exception $e) {
                $error = $e->getMessage();
                echo "alert('$error');";
                $this->sendErrorJS($error);
            }
        } else {
            //Get Current User Data
            try {
                $result = $cardNetApi->get_customer($cardnetCustomerId);
                $data = CardNetCustomer::mapCustomerObject($result);

                $uniqueID = $data['uniqueID'];
                $captureURL = $data['captureURL'];
            } catch (Exception $e) {
                $error = $e->getMessage();
                echo "alert('$error');";
                $this->sendErrorJS($error);
            }
        }

        return ["uniqueID" => $uniqueID, "captureURL" => $captureURL];
    }
}


/**
 * Initialize
 */

$theme = new CardNetTheme();
add_action('wp_head', ['theme']);
do_action('wp_head');