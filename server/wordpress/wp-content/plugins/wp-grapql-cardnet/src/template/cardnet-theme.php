<?php
/*
 * Template Name: CardNetTheme
 * Description: Allow customer to enter the credit card.
 */


require_once(__DIR__ . '/../CardNetApi.php');
require_once(__DIR__ . '/../CardNetCustomer.php');

use WPGraphQL\CardNet\CardNetApi;
use WPGraphQL\CardNet\CardNetCustomer;

function getPublicKey()
{
    $public_key = get_option('cardnet_test_mode') == "1" ? get_option('cardnet_demo_public_api_key') : get_option('cardnet_demo_public_api_key');
    return $public_key;
}
function loadCardnetSDK()
{
    $bgColor = "#10488d";
    //public key
    $public_key = getPublicKey();
?>

<style>
body {
    background-color: <?=$bgColor;
    ?>;
}
</style>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<script src="<?= "https://lab.cardnet.com.do/servicios/tokens/v1/Scripts/PWCheckout.js?key={$public_key}" ?>">
</script>
<?php  }



add_action('wp_head', 'loadCardnetSDK');

//Load the header after add the SDK
do_action('wp_head');



function getSiteName()
{
    return esc_attr(get_bloginfo('name'));
}

function getLogoUrl()
{
    $custom_logo_id = get_theme_mod('custom_logo');
    $custom_logo_data = wp_get_attachment_image_src($custom_logo_id, 'full');
    return $custom_logo_data[0];
}

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

            //TODO: set cardnetCustomer to meta
            update_user_meta($userData->ID, "cardnetCustomerId", $cardNetCustomerId);
        } catch (Exception $e) {
            $error = $e->getMessage();
            echo "alert('$error');";
            sendErrorJS($error);
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
            sendErrorJS($error);
        }
    }

    return ["uniqueID" => $uniqueID, "captureURL" => $captureURL];

    //return 'X56VkWMBxv8IcGfgS-wtbG_I56ONV7HQ'; //Testing
}

/**
 * CardNet Javascript code
 */


function initCardnet()
{

?>
<script>
function OnTokenReceived(token) {
    //console.log("token.TokenId", token.TokenId)
    //document.getElementById("PWTokenAux").value = token.TokenId;

    var payload = JSON.stringify({
        token: token.TokenId,
        error: null
    })
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(payload);
    }
}

function initCreditCard() {

    PWCheckout.Bind("tokenCreated", OnTokenReceived);
    PWCheckout.SetProperties({
        "name": "<?= getSiteName() ?>",
        //"email": "credit@mseller.app",
        "image": "<?= getLogoUrl() ?>",
        //"button-label": "Pagar #monto#",
        "description": "Checkout Creditel Test.",
        "currency": "DOP",
        //"button_label": "Pagar #monto#",
        //"amount": "100",
        //"lang": "ESP",
        "form_id": "shoppingcart_form",
        "checkout_card": 1,
        "autoSubmit": "false",
        //"empty": "true"
    });

    <?php
            $customerData = getCustomerData();
            $public_key = getPublicKey();
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

    }, 500)
    console.log(PWCheckout)
}

window.onload = function() {
    initCreditCard();
};
</script>
<?php
}

function body()
{
?>
<form id="shoppingcart_form">
    <p>
        <button id="btnCheckout">ABRIR IFRAME DE CAPTURA</button>
    </p>
    <p>
        <span class="itemName">OTT TOKEN: <input type="text" id="PWTokenAux" name="PWTokenAux" /></span>
    </p>
</form>
<?php
}


if (is_user_logged_in()) {
    body();
    initCardnet();
} else {
    echo 'You cannot access this page.';
}