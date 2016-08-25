import React, { PropTypes } from 'react';
import NumberInput from 'components/number-field/number-input';
import Gridicon from 'components/gridicon';
import { sanitize } from 'dompurify';

const renderItemInfo = ( item, itemIndex ) => (
	<li key={ itemIndex }>
		<span dangerouslySetInnerHTML={ { __html: sanitize( item.name ) } } />
		{ 1 < item.quantity ? ' (x' + item.quantity + ')' : null }
	</li>
);

const renderPackageDimensions = ( pckg, dimensionUnit ) => {
	return `${pckg.length} ${dimensionUnit} x ${pckg.width} ${dimensionUnit} x ${pckg.height} ${dimensionUnit}`;
};

const OrderPackages = ( { packages, updateWeight, dimensionUnit, weightUnit, errors } ) => {
	const renderPackageInfo = ( pckg, pckgIndex ) => {
		const pckgErrors = errors[ pckgIndex ] || {};
		return (
			<li key={ pckgIndex }>
				{ renderPackageDimensions( pckg, dimensionUnit ) }
				{ pckgErrors.weight ? <Gridicon icon="notice" /> : null }
				<NumberInput
					value={ pckg.weight || 0 }
					onChange={ ( event ) => updateWeight( pckgIndex, event.target.value ) }
					isError={ Boolean( pckgErrors.weight ) }
					style={ { width: 60, marginLeft: 16 } }
				/> { weightUnit }

				<ul>
					{ pckg.items.map( renderItemInfo ) }
				</ul>
			</li>
		);
	};

	return (
		<ul>
			{ packages.map( renderPackageInfo ) }
		</ul>
	);
};

OrderPackages.propTypes = {
	packages: PropTypes.array.isRequired,
	updateWeight: PropTypes.func.isRequired,
	dimensionUnit: PropTypes.string.isRequired,
	weightUnit: PropTypes.string.isRequired,
	errors: PropTypes.array.isRequired,
};

export default OrderPackages;
