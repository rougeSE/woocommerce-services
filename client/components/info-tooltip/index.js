/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Gridicon from 'gridicons';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Tooltip from 'components/tooltip';

export default class InfoTooltip extends Component {
	static propTypes = {
		className: PropTypes.string,
		position: PropTypes.string,
		anchor: PropTypes.node,
		maxWidth: PropTypes.oneOfType( [
			PropTypes.string,
			PropTypes.number,
		] ),
	};

	static defaultProps = {
		position: 'top',
		maxWidth: 'auto',
	};

	constructor( props ) {
		super( props );

		this.state = {
			showTooltip: false,
		};
	}

	openTooltip = () => {
		this.setState( { showTooltip: true } );
	}

	closeTooltip = () => {
		this.setState( { showTooltip: false } );
	}

	setToolTipRef = ( input ) => {
		this.toolTipSpan = input;
	}

	render() {
		const anchor = this.props.anchor || <Gridicon icon="info-outline" size={ 18 } />;

		return (
			<span className={ classNames( 'info-tooltip', this.props.className ) } >
				<span ref={ this.setToolTipRef }
					onMouseEnter={ this.openTooltip }
					onMouseLeave={ this.closeTooltip } >
					{ anchor }
				</span>
				<Tooltip
					className="info-tooltip__container wcc-root"
					isVisible={ this.state.showTooltip }
					showOnMobile
					onClose={ this.closeTooltip }
					position={ this.props.position }
					context={ this.toolTipSpan }>
					<div className="info-tooltip__contents"
						style={ { maxWidth: this.props.maxWidth } } >
						{ this.props.children }
					</div>
				</Tooltip>
			</span>
		);
	}
}
