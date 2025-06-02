'use client'
import { ChangeEvent, useState, useEffect } from "react"

interface Car {
	id: number
	price: number
	carType: string
	amenities: string
	rating: number
	name: string
	fuelType: string
	location: string
	image: string
	mileage: string
	transmission: string
	reviews: string
	power: string,
	date: string,
	features: string[]
}

interface Cars {
	cars: Car[],
	total: number,
	page: number,
	limit: number
}

export interface Filter {
	names: string[]
	fuelType: string[]
	amenities: string[]
	locations: string[]
	priceRange: [number, number]
	ratings: number[]
	carType: string[]
	gear: string[]
	mileage: string[]
	power: string[]
	date: string[],
	features: string[]
}

type SortCriteria = "name" | "price" | "rating"

const useCarFilter = (carsData: any) => {
	useEffect(() => {
		if (carsData) {
			if (!itemsPerPage) setItemsPerPage(carsData.limit || 10);
			setCurrentPage(carsData.page);
		}
		// eslint-disable-next-line
	}, [carsData]);
	const [filter, setFilter] = useState<Filter>({
		names: [],
		fuelType: [],
		amenities: [],
		locations: [],
		priceRange: [0, 500],
		ratings: [],
		carType: [],
		gear: [],
		mileage: [],
		power: [],
		date: [],
		features: [],
	})
	const [sortCriteria, setSortCriteria] = useState<SortCriteria>("name")
	const [itemsPerPage, setItemsPerPage] = useState<number>(carsData?.limit || 10)
	const [currentPage, setCurrentPage] = useState<number>(carsData?.page || 1)

	// Update pagination when API data changes
	useEffect(() => {
		if (carsData) {
			setItemsPerPage(carsData.limit)
			setCurrentPage(carsData.page)
		}
	}, [carsData])

	const uniqueNames = [...new Set((carsData?.cars || []).map((car: Car) => car.name))]
	const uniqueFuelTypes = [...new Set((carsData?.cars || []).map((car: Car) => car.fuelType))]
	const uniqueAmenities = [...new Set((carsData?.cars || []).map((car: Car) => car.amenities))]
	const uniqueLocations = [...new Set((carsData?.cars || []).map((car: Car) => car.location))]
	const uniqueRatings = [...new Set((carsData?.cars || []).map((car: Car) => car.rating))]
	const uniqueCarTypes = [...new Set((carsData?.cars || []).map((car: Car) => car.carType))]

	const filteredCars = (carsData?.cars || []).filter((car: Car) => {
		return (
			(filter.names.length === 0 || filter.names.includes(car.name)) &&
			(filter.fuelType.length === 0 || filter.fuelType.includes(car.fuelType)) &&
			(filter.amenities.length === 0 || filter.amenities.includes(car.amenities)) &&
			(filter.locations.length === 0 || filter.locations.includes(car.location)) &&
			(car.price >= filter.priceRange[0] && car.price <= filter.priceRange[1]) &&
			(filter.ratings.length === 0 || filter.ratings.includes(car.rating)) &&
			(filter.carType.length === 0 || filter.carType.includes(car.carType)) &&
			(filter.gear.length === 0 || filter.gear.includes(car.transmission)) &&
			(filter.mileage.length === 0 || filter.mileage.includes(car.mileage)) &&
			(filter.power.length === 0 || filter.power.includes(car.power))
		)
	})

	const sortedCars = [...filteredCars].sort((a, b) => {
		if (sortCriteria === "name") {
			return a.name.localeCompare(b.name)
		} else if (sortCriteria === "price") {
			return a.price - b.price
		} else if (sortCriteria === "rating") {
			return b.rating - a.rating
		}
		return 0
	})
	console.log(carsData)
	// Use API's total for pagination
	const totalPages = carsData?.total
	const startIndex = carsData.page
	const endIndex = carsData.pages
	const paginatedCars = sortedCars.slice(startIndex, endIndex)

	const handleCheckboxChange = (field: keyof Filter, value: string | number) => (e: ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked
		setFilter((prevFilter) => {
			const values = prevFilter[field] as (string | number)[]
			if (checked) {
				return { ...prevFilter, [field]: [...values, value] }
			} else {
				return {
					...prevFilter,
					[field]: values.filter((item) => item !== value),
				}
			}
		})
	}

	const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSortCriteria(e.target.value as SortCriteria)
	}

	const handlePriceRangeChange = (values: [number, number]) => {
		setFilter((prevFilter) => ({
			...prevFilter,
			priceRange: values,
		}))
	}

	const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const newLimit = Number(e.target.value)
		setItemsPerPage(newLimit)
		setCurrentPage(1) // Reset to first page when changing items per page
	}

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage)
		}
	}

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1)
		}
	}

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1)
		}
	}

	const handleClearFilters = () => {
		setFilter({
			names: [],
			fuelType: [],
			amenities: [],
			locations: [],
			priceRange: [0, 500],
			ratings: [],
			carType: [],
			gear: [],
			mileage: [],
			power: [],
			date: [],
			features: [],
		})
		setSortCriteria("name")
		setItemsPerPage(carsData?.limit || 10)
		setCurrentPage(1)
	}

	// Calculate item indices based on API data
	const startItemIndex = (currentPage - 1) * (carsData?.limit || 10) + 1
	const endItemIndex = Math.min(startItemIndex + (carsData?.limit || 10) - 1, carsData?.total || 0)

	return {
		filter,
		setFilter,
		sortCriteria,
		setSortCriteria,
		itemsPerPage,
		setItemsPerPage,
		currentPage,
		setCurrentPage,
		uniqueNames,
		uniqueFuelTypes,
		uniqueAmenities,
		uniqueLocations,
		uniqueRatings,
		uniqueCarTypes,
		filteredCars,
		sortedCars,
		totalPages,
		startIndex,
		endIndex,
		paginatedCars,
		handleCheckboxChange,
		handleSortChange,
		handlePriceRangeChange,
		handleItemsPerPageChange,
		handlePageChange,
		handlePreviousPage,
		handleNextPage,
		handleClearFilters,
		startItemIndex,
		endItemIndex,
	}
}

export default useCarFilter
