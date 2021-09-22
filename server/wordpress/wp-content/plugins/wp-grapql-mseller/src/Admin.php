<?php

namespace MSeller;

class Admin
{

    public static function init()
    {
        add_action('admin_init', [__CLASS__, 'dbi_register_settings']);
        add_action('admin_menu', [__CLASS__, 'dbi_add_settings_page']);
    }


    public static function dbi_add_settings_page()
    {
        add_options_page('MSeller Configuration', 'MSeller Configuration', 'manage_options', 'dbi-example-plugin', [__CLASS__, 'dbi_render_plugin_settings_page']);
    }

    public static function dbi_render_plugin_settings_page()
    {
?>
<h2>MSeller Settings</h2>
<form action="options.php" method="post">
    <?php
            settings_fields('mseller_options');
            do_settings_sections('mseller_plugin'); ?>
    <input name="submit" class="button button-primary" type="submit" value="<?php esc_attr_e('Save'); ?>" />
</form>
<?php
    }

    public static function mseller_options_validate($input)
    {
        $newinput['firebase_credentials'] =  trim($input['firebase_credentials']);
        $newinput['firebase_url'] =  trim($input['firebase_url']);

        return $newinput;
    }


    public static function dbi_plugin_section_text()
    {
        echo '<p>Firebase integrations</p>';
    }

    public static function mseller_firebase_credentials()
    {
        $options = get_option('mseller_options');
        $firebaseCredentials = isset($options['firebase_credentials']) ? $options['firebase_credentials'] : '';
        echo "<textarea id='mseller_firebase_credentials' name='mseller_options[firebase_credentials]' rows='10' cols='70' >" . esc_attr($firebaseCredentials) . "</textarea>";
    }

    public static function mseller_firebase_url()
    {
        $options = get_option('mseller_options');
        $firebaseUrl = isset($options['firebase_url']) ? $options['firebase_url'] : '';
        echo "<input id='mseller_firebase_url' name='mseller_options[firebase_url]' type='text' size='70' placeholder='https://mseller-shop-default-rtdb.firebaseio.com' value='" . esc_attr($firebaseUrl) . "' />";
    }


    public static  function dbi_register_settings()
    {
        register_setting('mseller_options', 'mseller_options', [__CLASS__, 'mseller_options_validate']);
        add_settings_section('mseller_settings', 'Firebase Settings', [__CLASS__, 'dbi_plugin_section_text'], 'mseller_plugin');

        add_settings_field('mseller_firebase_credentials', 'Firebase Credentials JSON', [__CLASS__, 'mseller_firebase_credentials'], 'mseller_plugin', 'mseller_settings');
        add_settings_field('mseller_firebase_url', 'Firebase URL', [__CLASS__, 'mseller_firebase_url'], 'mseller_plugin', 'mseller_settings');
    }
}