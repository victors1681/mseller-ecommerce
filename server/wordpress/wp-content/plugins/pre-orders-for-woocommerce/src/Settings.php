<?php
namespace Woocommerce_Preorders;

class Settings
{
    protected $pluginBase = WCPO_PLUGIN_BASE;

    public function __construct()
    {
        add_filter('woocommerce_settings_tabs_array', [$this, 'addSettingsTab'], 50);
        add_action('woocommerce_settings_tabs_settings_tab_preorders', [$this, 'settingsTab']);
        add_action('woocommerce_update_options_settings_tab_preorders', [$this, 'updateSettings']);
        add_filter("plugin_action_links_$this->pluginBase", [$this, 'wcpo_plugin_settings_link']);
    }

    public function wcpo_plugin_settings_link($links)
    {
        $row_meta = array(
            'settings' => '<a href="'.get_admin_url(null, 'admin.php?page=wc-settings&tab=settings_tab_preorders').'">' . __('Settings', 'preorders') . '</a>',
            'pro_link' => '<a href="' . esc_url('https://brightplugins.com/woocommerce-preorder-plugin-review/') . '" target="_blank" aria-label="' . esc_attr__('Pro Version', 'wpgs') . '" style="color:green;font-weight:600;">' . esc_html__('Pro Version', 'preorders') . '</a>',
        );
        
        return  array_merge($links, $row_meta);
    }


    public function addSettingsTab($settings_tabs)
    {
        $settings_tabs['settings_tab_preorders'] = __('Preorders', 'preorders');

        return $settings_tabs;
    }

    public function settingsTab()
    {
        woocommerce_admin_fields($this->getSettings());
    }

    public function updateSettings()
    {
        woocommerce_update_options($this->getSettings());
    }

    public function getSettings()
    {
        update_option('wc_preorders_mode', 'either');

        do_action('before_preoder_settings_tab');
        
        $settings = [
            'section_title' => [
                'name' => __('PreOrder Settings', 'preorders'),
                'type' => 'title',
                'id' => 'wc_settings_tab_preorders_section_title',
            ],
            'preorders_mode' => [
                'name' => __('Preorder Modes', 'preorders'),
                'type' => 'select',
                'class'    => 'wc-enhanced-select',
                'css'      => 'min-width: 350px;',
                'options' => [
                    'q1' => __('Treat the entire order as preordered - Available in Pro', 'preorders'),
                    'q2' => __('Generate a separate order with all preordered products - Available in Pro', 'preorders'),
                    'q3' => __('Generate a separate order for each preordered products - Available in Pro', 'preorders'),
                    'either' => __('Order only preorder products or available ones', 'preorders'),
                ],
                'id' => 'wc_preorders_mode',
            ],
            'change_button' => [
                'name' => __('Change button title for preorder products', 'preorders'),
                'type' => 'checkbox',
                'std' => 'yes',
                'default' => 'yes',
                'id' => 'wc_preorders_change_button',
            ],
            'change_button_text' => [
                'name' => __('Add Button Title', 'preorders'),
                'type' => 'text',
                'std' => 'Preorder Now!',
                'default' => 'Preorder Now!',
                'id' => 'wc_preorders_button_text',
            ],
            'change_avaiable_date_text' => [
                'name' => __('Available date Text', 'preorders'),
                'type' => 'text',
                'default' => 'Available on {date_format}',
                'desc' => '
                Choose how the available date should be displayed. <br/>
                <code>{date_format}</code> = Default site date format (Ex: January 15, 2020 ) <br/>
               
                <pre><a target="_blank" href="https://brightplugins.com/woocommerce-preorder-plugin-review/">Upgrade to Pro version</a> If you want to activate all the functionalities.</pre>',
                'id' => 'wc_preorders_avaiable_date_text',
            ],
            'section_end' => [
                'type' => 'sectionend',
                'id' => 'wc_settings_tab_preorders_section_end',
            ],
        ];
        
        return apply_filters('wc_settings_tab_preorders_settings', $settings);
    }
}
