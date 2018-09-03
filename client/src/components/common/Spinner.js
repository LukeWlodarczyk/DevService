import React from 'react';

const Spinner = () => (
	<div className="row">
		<div className="col"> </div>
		<div style={{ textAlign: 'center' }} className="col">
			<i className="fas fa-sync fa-spin fa-2x" />
		</div>
		<div className="col" />
	</div>
);

export default Spinner;
