<?php

namespace WPGraphQL\CardNet;

class CardNetConfig
{

    public function __construct()
    {
        add_action('admin_menu', [$this, 'graphql_cardnet_register_ui']);
        add_action('admin_post_nopriv_process_form', [$this, 'submit_api_key']);
        add_action('admin_post_process_form', [$this, 'submit_api_key']);
    }
    public static function init()
    {
        add_action('admin_menu', [__CLASS__, 'graphql_cardnet_register_ui']);
    }

    function graphql_cardnet_register_ui()
    {

        add_submenu_page(
            'tools.php',
            'CardNet Tools',
            'CardNet Tools',
            'manage_options',
            'cardnet-config',
            [$this, 'add_api_keys_callback']
        );
    }

    // The admin page containing the form
    function add_api_keys_callback()
    {
        $demo_api_key = get_option('cardnet_demo_api_key');
        $demo_public_api_key = get_option('cardnet_demo_public_api_key');
        $demo_base_url = get_option('cardnet_demo_base_url');
        $api_key = get_option('cardnet_api_key');
        $public_api_key = get_option('cardnet_public_api_key');
        $base_url = get_option('cardnet_base_url');
        $test_mode = get_option('cardnet_test_mode');
?>
<div class="wrap">
    <div id="icon-tools" class="icon32"></div>
    <h2>CardNet Configuración</h2>
    <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="POST">
        <h3>Production</h3>

        <div class="wp-privacy-request-form-field">
            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row">
                            <label for="cardnet_api_key">Private Key</label>
                        </th>
                        <td>
                            <input type="text" required="" class="regular-text ltr" id="cardnet_api_key"
                                name="cardnet_api_key" value="<?= $api_key ?>">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cardnet_api_key">Public Key</label>
                        </th>
                        <td>
                            <input type="text" required="" class="regular-text ltr" id="cardnet_public_api_key"
                                name="cardnet_public_api_key" value="<?= $public_api_key ?>">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cardnet_demo_base_url">Base URL</label>
                        </th>
                        <td>
                            <input type="text" required="" class="regular-text ltr" id="cardnet_base_url"
                                name="cardnet_base_url" value="<?= $base_url ?>">
                        </td>
                    </tr>
                </tbody>
            </table>
            <h3>Demo</h3>
            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row">
                            <label for="cardnet_demo_api_key">Private Key</label>
                        </th>
                        <td>
                            <input type="text" required="" class="regular-text ltr" id="cardnet_demo_api_key"
                                name="cardnet_demo_api_key" value="<?= $demo_api_key ?>">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cardnet_demo_public_api_key">Public Key</label>
                        </th>
                        <td>
                            <input type="text" required="" class="regular-text ltr" id="cardnet_demo_public_api_key"
                                name="cardnet_demo_public_api_key" value="<?= $demo_public_api_key ?>">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cardnet_demo_base_url">Base URL</label>
                        </th>
                        <td>
                            <input type="text" required="" class="regular-text ltr" id="cardnet_demo_base_url"
                                name="cardnet_demo_base_url" value="<?= $demo_base_url ?>"
                                placeholder="https://lab.cardnet.com.do/servicios/tokens/v1/api/">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            Activar Modo de Prueba </th>
                        <td>
                            <label for="cardnet_test_mode">
                                <input type="checkbox" name="cardnet_test_mode" id="cardnet_test_mode" value="1"
                                    <?= $test_mode  == "1" ? "checked" : "" ?>>
                                Carnet Lab entorno de prueba. </label>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p class="submit">
                <input type="hidden" name="action" value="process_form">

                <input type="submit" name="submit" id="submit" class="button" value="Actualizar">
            </p>
        </div>
    </form>
</div>
<?php
    }

    // Submit functionality
    function submit_api_key()
    {


        if (isset($_POST['cardnet_test_mode'])) {

            $test_mode = sanitize_text_field($_POST['cardnet_test_mode']);
            $test_mode_exist = get_option('cardnet_test_mode');

            update_option('cardnet_test_mode', $test_mode, "0");
        } else {
            update_option('cardnet_test_mode', "0", "1");
        }


        //PROD

        if (isset($_POST['cardnet_base_url'])) {
            $api_key = sanitize_text_field($_POST['cardnet_base_url']);
            $api_exists = get_option('cardnet_base_url');

            if (!empty($api_key) && !empty($api_exists)) {
                update_option('cardnet_base_url', $api_key);
            } else {
                add_option('cardnet_base_url', $api_key);
            }
        }

        if (isset($_POST['cardnet_api_key'])) {
            $api_key = sanitize_text_field($_POST['cardnet_api_key']);
            $api_exists = get_option('cardnet_api_key');

            if (!empty($api_key) && !empty($api_exists)) {
                update_option('cardnet_api_key', $api_key);
            } else {
                add_option('cardnet_api_key', $api_key);
            }
        }
        if (isset($_POST['cardnet_public_api_key'])) {
            $api_key = sanitize_text_field($_POST['cardnet_public_api_key']);
            $api_exists = get_option('cardnet_public_api_key');

            if (!empty($api_key) && !empty($api_exists)) {
                update_option('cardnet_public_api_key', $api_key);
            } else {
                add_option('cardnet_public_api_key', $api_key);
            }
        }

        //Demo

        if (isset($_POST['cardnet_demo_base_url'])) {
            $api_key = sanitize_text_field($_POST['cardnet_demo_base_url']);
            $api_exists = get_option('cardnet_demo_base_url');

            if (!empty($api_key) && !empty($api_exists)) {
                update_option('cardnet_demo_base_url', $api_key);
            } else {
                add_option('cardnet_demo_base_url', $api_key);
            }
        }

        if (isset($_POST['cardnet_demo_api_key'])) {
            $api_key = sanitize_text_field($_POST['cardnet_demo_api_key']);
            $api_exists = get_option('cardnet_demo_api_key');

            if (!empty($api_key) && !empty($api_exists)) {
                update_option('cardnet_demo_api_key', $api_key);
            } else {
                add_option('cardnet_demo_api_key', $api_key);
            }
        }

        if (isset($_POST['cardnet_demo_public_api_key'])) {
            $api_key = sanitize_text_field($_POST['cardnet_demo_public_api_key']);
            $api_exists = get_option('cardnet_demo_public_api_key');

            if (!empty($api_key) && !empty($api_exists)) {
                update_option('cardnet_demo_public_api_key', $api_key);
            } else {
                add_option('cardnet_demo_public_api_key', $api_key);
            }
        }
        wp_redirect($_SERVER['HTTP_REFERER']);
    }
}