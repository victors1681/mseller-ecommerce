<?php

if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly

class WC_Preorder_Email extends WC_Email
{
    /**
     * Set email defaults
     *
     * @since 0.1
     */
    public function __construct()
    {
        // set ID, this simply needs to be a unique name
        $this->id = 'wc_preorder_available';

        // this is the title in WooCommerce Email settings
        $this->title = __('Pre-order Available', 'preorders');

        // this is the description in WooCommerce email settings
        $this->description = __('This e-mail is triggered when a pre-order is available.', 'preorders');

        // these are the default heading and subject lines that can be overridden using the settings
        $this->heading = 'The products you pre-ordered are ready for shipping';
        $this->subject = 'Your pre-order is ready!';

        // these define the locations of the templates that this email should use, we'll just use the new order template since this email is similar
        $this->template_html = 'emails/admin-new-order.php';
        $this->template_plain = 'emails/plain/admin-new-order.php';

        $this->customer_email = true;

        // Trigger on new paid orders
        add_action('woocommerce_order_status_preorder_to_completed_notification', [$this, 'trigger']);

        // Call parent constructor to load any other defaults not explicity defined here
        parent::__construct();
    }

    /**
     * Determine if the email should actually be sent and setup email merge variables
     *
     * @since 0.1
     * @param int $order_id
     */
    public function trigger($order_id, $order = false)
    {
        if ($order_id && !is_a($order, 'WC_Order')) {
            $order = wc_get_order($order_id);
        }

        // setup order object
        $this->object = new WC_Order($order_id);

        $this->object = $order;

        // replace variables in the subject/headings
        $this->find[] = '{order_date}';
        $this->replace[] = date_i18n(wc_date_format(), strtotime($this->object->get_date_completed()));

        $this->find[] = '{order_number}';
        $this->replace[] = $order_id;

        if (!$this->is_enabled() || !$this->get_recipient()) {
            return;
        }

        // woohoo, send the email!
        $this->send($this->get_recipient(), $this->get_subject(), $this->get_content(), $this->get_headers(), $this->get_attachments());
    }

    /**
     * get_content_html function.
     *
     * @since 0.1
     * @return string
     */
    public function get_content_html()
    {
        ob_start();
        woocommerce_get_template($this->template_html, [
            'order' => $this->object,
            'email_heading' => $this->get_heading(),
            'sent_to_admin' => false,
            'plain_text' => false,
            'email'              => $this,
            'additional_content' => $this->get_additional_content()
        ]);
        return ob_get_clean();
    }

    /**
     * get_content_plain function.
     *
     * @since 0.1
     * @return string
     */
    public function get_content_plain()
    {
        ob_start();
        woocommerce_get_template($this->template_plain, [
            'order' => $this->object,
            'email_heading' => $this->get_heading(),
            'sent_to_admin' => false,
            'plain_text'         => true,
            'email'              => $this,
            'additional_content' => $this->get_additional_content()
        ]);
        return ob_get_clean();
    }

    /**
     * Initialize Settings Form Fields
     *
     * @since 0.1
     */
    public function init_form_fields()
    {
        $this->form_fields = [
            'enabled' => [
                'title' => __('Enable/Disable', 'preorders'),
                'type' => 'checkbox',
                'label' => __('Enable this email notification', 'preorders'),
                'default' => 'yes'
            ],
            'recipient' => [
                'title' => __('Recipient(s)', 'preorders'),
                'type' => 'text',
                'description' => sprintf(
                    /* translators: Email. */
                    __('Enter recipients (comma separated) for this email. Defaults to <code>%s</code>.', 'preorders'), esc_attr(get_option('admin_email'))
                ),
                'placeholder' => '',
                'default' => ''
            ],
            'subject' => [
                'title' => __('Subject', 'preorders'),
                'type' => 'text',
                'description' => sprintf(
                    /* translators:  code. */
                    __('This controls the email subject line. Leave blank to use the default subject: <code>%s</code>.', 'preorders'), $this->subject
                ),
                'placeholder' => '',
                'default' => 'Your pre-order is ready!'
            ],
            'heading' => [
                'title' => __('Email Heading', 'preorders'),
                'type' => 'text',
                'description' => sprintf(
                    /* translators: code. */
                    __('This controls the main heading contained within the email notification. Leave blank to use the default heading: <code>%s</code>.', 'preorders'), $this->heading),
                'placeholder' => '',
                'default' => 'The products you pre-ordered are ready for shipping'
            ],
            'email_type' => [
                'title' => __('Email type', 'preorders'),
                'type' => 'select',
                'description' => __('Choose which format of email to send.', 'preorders'),
                'default' => 'html',
                'class' => 'email_type',
                'options' => [
                    'plain' => 'Plain text',
                    'html' => 'HTML', 'woocommerce',
                    'multipart' => 'Multipart', 'woocommerce',
                ]
            ]
        ];
    }
}
