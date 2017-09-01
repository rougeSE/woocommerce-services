<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( class_exists( 'WC_REST_Connect_Stripe_Settings_Controller' ) ) {
	return;
}

class WC_REST_Connect_Stripe_Settings_Controller extends WC_REST_Connect_Base_Controller {
	protected $rest_base = 'connect/stripe/settings';
	private $stripe;

	public function __construct( WC_Connect_Stripe $stripe, WC_Connect_API_Client $api_client, WC_Connect_Service_Settings_Store $settings_store, WC_Connect_Logger $logger ) {
		parent::__construct( $api_client, $settings_store, $logger );
		$this->stripe = $stripe;
	}

	public function post( $request ) {
		$data = $request->get_json_params();
		$settings = $this->stripe->get_settings( $data['returnUrl'] );

		if ( is_wp_error( $settings ) ) {
			$this->logger->debug( $settings, __CLASS__ );
			return new WP_REST_Response( array(
				'success'   => false,
				'data'      => array(
					'message' => $settings->get_error_message(),
				),
			), 400 );
		}

		return new WP_REST_Response( array(
			'success' => true,
			'email' => $settings['email'],
			'country' => $settings['country'],
			'oauthUrl' => $settings['oauthUrl'],
		), 200 );
	}
}