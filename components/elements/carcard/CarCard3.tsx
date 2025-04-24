import Link from 'next/link'
import React from 'react'

export default function CarCard3({ car }: any) {
	return (
		<>
			<div className="card-hotel card-hotel-1 card-tour-2">
				<div className="card-image flash">
					<Link href={'/car'}>
						<img src={`/assets/imgs/cars-listing/cars-listing-2/${car.image}`} alt="Fast4Car" />
					</Link>
					<a className="wish link-wish active" data-tooltip="Save to wishlist" data-tooltip-pos="down" href="javascript:void(0)">
						<svg className="ms-auto" xmlns="http://www.w3.org/2000/svg" width={20} height={19} viewBox="0 0 20 19" fill="none">
							<path d="M10 18.4999C9.85585 18.5001 9.71377 18.4653 9.58614 18.3986C9.45852 18.3319 9.34978 18.2353 9.26985 18.1174C7.25582 15.6292 5.64141 13.5986 4.36638 11.8402C2.85071 9.75505 2 7.86655 2 5.82644C2.00104 4.65499 2.3629 3.51527 3.03763 2.57195C3.71236 1.62862 4.66125 0.934347 5.73989 0.586627C6.81853 0.238906 7.98015 0.255085 9.04765 0.632807C10.1152 1.01053 11.0268 1.72977 11.6649 2.6718C12.3029 1.73065 13.2136 1.01221 14.2799 0.634428C15.3462 0.256644 16.5064 0.240266 17.5838 0.587564C18.6612 0.934862 19.609 1.6287 20.2834 2.57132C20.9577 3.51394 21.3197 4.65279 21.321 5.82368C21.321 7.86379 20.4703 9.75505 18.9547 11.8375C17.6796 13.5986 16.0652 15.6292 14.0512 18.1147C13.9713 18.2326 13.8625 18.3292 13.7349 18.3959C13.6073 18.4626 13.4652 18.4974 13.321 18.4972L10 18.4999ZM6.34266 2.42801C5.51923 2.42726 4.72772 2.7458 4.11203 3.32C3.49633 3.89419 3.10108 4.68882 3.00287 5.55407C3.00287 7.10489 3.67807 8.61514 5.01337 10.4568C6.23941 12.1528 7.77697 14.08 9.99908 16.8103C12.2259 14.08 13.7635 12.1555 14.9895 10.4541C16.3201 8.61514 16.9953 7.10766 16.9953 5.5513C16.9139 4.76371 16.585 4.02356 16.0603 3.43267C15.5357 2.84179 14.8406 2.43327 14.0747 2.26391C13.3088 2.09455 12.5076 2.17234 11.7867 2.48632C11.0657 2.8003 10.4646 3.33659 10.0746 4.01788L9.99632 4.15194L9.91803 4.01788C9.63448 3.51642 9.23484 3.10088 8.75472 2.80984C8.27459 2.51879 7.7283 2.36214 7.17369 2.3536C6.89543 2.37626 6.61888 2.39338 6.34266 2.43077V2.42801Z" fill="#F8554E" />
						</svg>
					</a>
				</div>
				<div className="card-info px-3 py-4 sm:p-4 md:p-6">
					<label className="sale-lbl">-25%</label>
					<div className="tour-rate">
						<div className="rate-element"><span className="rating">{car.rating} <span className="text-sm-medium neutral-500">(672 reviews)</span></span></div>
					</div>
					<div className="card-title mt-3"><Link className="heading-6 neutral-1000" href={`/car?id=${car.id}`}>{car.name}</Link></div>
					<div className="card-program mt-2">
						<div className="card-location mb-3">
							<p className="text-location text-md-medium neutral-500">Manchester, England</p>
						</div>
						<div className="card-facilities gap-2">
							<div className="item-facilities">
								<p className="room text-md-medium neutral-1000">Unlimited mileage</p>
							</div>
							<div className="item-facilities">
								<p className="size text-md-medium neutral-1000">Automatic</p>
							</div>
							<div className="item-facilities">
								<p className="parking text-md-medium neutral-1000">3 Large bags</p>
							</div>
							<div className="item-facilities">
								<p className="bed text-md-medium neutral-1000">5 Diesel</p>
							</div>
							<div className="item-facilities">
								<p className="bathroom text-md-medium neutral-1000">7 seats</p>
							</div>
							<div className="item-facilities">
								<p className="pet text-md-medium neutral-1000">SUVs</p>
							</div>
						</div>
						<div className="endtime mt-4">
							<div className="card-price">
								<p className="text-md-medium neutral-500 mr-2">From </p>
								<h6 className="heading-6 neutral-1000">${car.price}</h6>
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
