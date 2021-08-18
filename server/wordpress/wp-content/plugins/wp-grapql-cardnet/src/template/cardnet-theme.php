<?php
/*
 * Template Name: CardNetTheme
 * Description: Allow customer to enter the credit card.
 */


function loadCardnetSDK()
{
    //public key
    $public_key = get_option('cardnet_test_mode') == "1" ? get_option('cardnet_demo_public_api_key') : get_option('cardnet_demo_public_api_key');
?>

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

function getUniqueId()
{

    //this is only for testing.. 
    //will get the unique id getting the user data and then get the cardnet customer object
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    if (isset($id)) {
        return $id;
    }
    return 'X56VkWMBxv8IcGfgS-wtbG_I56ONV7HQ'; //Testing
}

/**
 * CardNet Javascript code
 */


function initCardnet()
{

?>
<script>
function OnTokenReceived(token) {
    //alert(token.TokenId); 
    console.log("token.TokenId", token.TokenId)
    document.getElementById("PWTokenAux").value = token.TokenId;
}

function myFunction() {
    console.log(" window.PWCheckout", window.PWCheckout)
    var captureUrl = "https://lab.cardnet.com.do/servicios/tokens/v1/Capture/";
    var key = "<?= getUniqueId(); ?>";
    var customerUniqueId = "UI_9d123bb4-7a62-4f41-98c2-4beee709952a";
    var url = `${captureUrl}?key=${key}&session_id=${customerUniqueId}`;
    //PWCheckout.OpenIframeNormal();
    console.log({
        url,
        customerUniqueId
    })
    window.PWCheckout.OpenIframeCustom(url, customerUniqueId);
}


window.PWCheckout.Bind("tokenCreated", OnTokenReceived);
window.PWCheckout.SetProperties({
    "name": "<?= getSiteName() ?>",
    "email": "credit@mseller.app",
    "image": "<?= getLogoUrl() ?>",
    "button-label": "Pagar #monto#",
    "description": "Checkout Creditel Test.",
    "currency": "DOP",
    "button_label": "Pagar #monto#",
    "amount": "100",
    "lang": "ESP",
    "form_id": "shoppingcart_form",
    "checkout_card": 1,
    "autoSubmit": "false",
    "empty": "true"
});


window.onload = function() {
    myFunction();
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