<?php

if ( ! class_exists( 'WC_Connect_Stripe' ) ) {

	class WC_Connect_Stripe {

		/**
		 * @var WC_Connect_API_Client
		 */
		private $api;

		/**
		 * @var WC_Connect_Options
		 */
		private $options;

		/**
		 * @var WC_Connect_Logger
		 */
		private $logger;

		/** @var string */
		private $error = '';

		public function __construct( WC_Connect_API_Client $client, WC_Connect_Options $options, WC_Connect_Logger $logger ) {
			$this->api = $client;
			$this->options = $options;
			$this->logger = $logger;
		}

		public function get_settings( $return_url ) {
			$email = get_option( 'admin_email' );
			$country = WC()->countries->get_base_country();
			$result = $this->api->get_stripe_oauth_init( $return_url );

			if ( is_wp_error( $result ) ) {
				return $result;
			}

			set_transient( 'wcs_stripe_state', $result->state );

			return array (
				'email' => $email,
				'country' => $country,
				'oauthUrl' => $result->oauthUrl,
			);
		}

		public function create_account( $email, $country ) {
			$response = $this->api->create_stripe_account( $email, $country );
			if ( is_wp_error( $response ) ) {
				return $response;
			}
			$this->save_stripe_keys( $response );
			return $response;
		}

		public function connect_oauth( $state, $code ) {
			if ( $state !== get_transient( 'wcs_stripe_state' ) ) {
				return new WP_Error( 'Invalid stripe state' );
			}

			$response = $this->api->get_stripe_oauth_keys( $code );

			if ( is_wp_error( $response ) ) {
				return $response;
			}

			$this->save_stripe_keys( $response );
			return $response;
		}

		private function save_stripe_keys( $result ) {
			if ( ! isset( $result->accountId, $result->publishableKey, $result->secretKey ) ) {
				$this->error = 'Unexpected server response: ' . json_encode( $result );
				add_action( 'admin_notices', array( $this, 'error_notice' ) );
				return;
			}

			$option_name = 'woocommerce_stripe_settings';
			$options = get_option( $option_name );
			$options['testmode']        = 'no';
			$options['account_id']      = $result->accountId;
			$options['publishable_key'] = $result->publishableKey;
			$options['secret_key']      = $result->secretKey;

			update_option( $option_name, $options );
			add_action( 'admin_notices', array( $this, 'success_notice' ) );
		}
	}
}