import Link from 'next/link'

export default function CarCard1({ car }: any) {
	return (
		<>
			<div className="card-journey-small background-card hover-up">
				<div className="card-image">
					<Link href={'/car'}>
						<img src={`/assets/imgs/cars-listing/cars-listing-6/${car.image}`} alt="Fast4Car" />
					</Link>
				</div>
				<div className="card-info px-3 py-4 sm:p-4 sm:px-10">
					<div className="card-rating">
						<div className="card-left" />
						<div className="card-right">
							<span className="rating text-xs-medium rounded-pill">4.96 <span className="text-xs-medium neutral-500">(672 reviews)</span></span>
						</div>
					</div>
					<div className="card-title mt-6 sm:mt-3"><Link className="text-lg-bold neutral-1000 text-nowrap" href={`/car?id=${car.id}`}>{car.name}</Link></div>
					<div className="card-program mt-2">
						<div className="card-location mb-2">
							<p className="text-location text-sm-medium neutral-500">New South Wales, Australia</p>
						</div>
						<div className="card-facitlities gap-2">
							<p className="card-miles text-md-medium">25,100 miles</p>
							<p className="card-gear text-md-medium">Automatic</p>
							<p className="card-fuel text-md-medium">Diesel</p>
							<p className="card-seat text-md-medium">7 seats</p>
						</div>
						<div className="endtime mt-3">
							<div className="card-price">
								<h6 className="text-lg-bold neutral-1000">$89.32</h6>
								<p className="text-md-medium neutral-500">/ day</p>
							</div>
							<div className="card-button"><Link className="btn btn-gray" href={`/car?id=${car.id}`}>Book Now</Link></div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
