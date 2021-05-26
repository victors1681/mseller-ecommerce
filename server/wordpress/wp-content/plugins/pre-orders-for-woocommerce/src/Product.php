<?php

namespace Woocommerce_Preorders;

class Product
{
    private $product;
    private $isPreOrder = false;
    private $preOrderDate;

    public function __construct($productId, $variableId = 0)
    {
        $this->product = wc_get_product($productId);
        if ('yes' === get_post_meta($this->product->get_id(), '_is_pre_order', true) && new \DateTime(get_post_meta($this->product->get_id(), '_pre_order_date', true)) > new \DateTime()) {
            $this->isPreOrder = true;
            $this->preOrderDate = get_post_meta($this->product->get_id(), '_preorder_date', true);
        } elseif ('yes' === get_post_meta($variableId, '_is_pre_order', true) && new \DateTime(get_post_meta($variableId, '_pre_order_date', true)) > new \DateTime()) {
            $this->isPreOrder = true;
            $this->preOrderDate = get_post_meta($variableId, '_preorder_date', true);
        }
    }

    public function getShippingDate()
    {
        if (!$this->isPreOrder) {
            return __('Already shipped', 'preorders');
        }
        $shippingDate = strtotime($this->preOrderDate);
        $now = strtotime(time());
        $diff = round(($shippingDate - $now) / (60 * 60 * 24));

        if ($diff > 0) {
            echo sprintf(__('Available in %s days', 'preorders'), $diff->d);
        } elseif ($diff == 0) {
            return __('Available today', 'preorders');
        } else {
            return __('Already shipped', 'preorders');
        }
    }

    public function isPreOrder()
    {
        return $this->isPreOrder;
    }
}
