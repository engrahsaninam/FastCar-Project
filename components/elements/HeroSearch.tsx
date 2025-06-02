"use client";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Updated import for Next.js 13+
import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {
  CarFrontIcon as Car,
  Car as Wrench,
  Calendar,
  Gauge,
  Euro,
  ChevronDown,
} from "lucide-react";
import { useBrands, useModels, useyearsRange } from "@/services/cars/useCars";

// Define TypeScript interfaces
interface ModelOptionsType {
  [key: string]: string[];
}

// Define HeroSearch component props interface
interface HeroSearchProps {
  showAdvanced?: boolean;
}

const HeroSearch: React.FC<HeroSearchProps> = ({ showAdvanced = false }) => {
  const router = useRouter();
  const [make, setMake] = useState<string>("Brand");
  const [model, setModel] = useState<string>("Model");
  const [year, setYear] = useState<string>("Year");
  const [vatDeduction, setVatDeduction] = useState<boolean>(false);
  const [minMileage, setMinMileage] = useState<string>("");
  const [maxMileage, setMaxMileage] = useState<string>("");
  const [mileageRange, setMileageRange] = useState<string>("Kilometers");
  const [priceRange, setPriceRange] = useState<string>("Price");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showMakeDropdown, setShowMakeDropdown] = useState<boolean>(false);
  const [showModelDropdown, setShowModelDropdown] = useState<boolean>(false);
  const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);
  const [showMileageDropdown, setShowMileageDropdown] = useState<boolean>(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState<boolean>(false);

  const { data: brands } = useBrands();
  const { data: models } = useModels(make !== "Brand" ? make : "");
  const { data: yearsData } = useyearsRange();

  // Detect mobile device on client-side
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    // Check initially
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Car models dictionary based on selected make
  const modelOptions: ModelOptionsType = {
    BMW: ["X5", "5 Series", "3 Series", "X3", "i4"],
    Mercedes: ["C-Class", "E-Class", "S-Class", "GLE", "EQS"],
    Audi: ["A4", "A6", "Q5", "e-tron", "Q7"],
  };

  // Update in handleMakeSelect function
  const handleMakeSelect = (selectedMake: string): void => {
    setMake(selectedMake);
    setModel("Model"); // Reset model when make changes
    setShowMakeDropdown(false); // Close the dropdown
  };
  // Handler for model selection
  const handleModelSelect = (selectedModel: string): void => {
    setModel(selectedModel);
    setShowModelDropdown(false); // Close the dropdown
  };

  // Handler for year selection
  const handleYearSelect = (selectedYear: string): void => {
    setYear(selectedYear);
    setShowYearDropdown(false); // Close the dropdown
  };

  // Apply mileage range
  const applyMileageRange = (): void => {
    if (minMileage && maxMileage) {
      setMileageRange(`${minMileage} - ${maxMileage} km`);
    } else if (minMileage) {
      setMileageRange(`Min ${minMileage} km`);
    } else if (maxMileage) {
      setMileageRange(`Max ${maxMileage} km`);
    } else {
      setMileageRange("Kilometers");
    }
    setShowMileageDropdown(false);
  };
  // Apply price range
  const applyPriceRange = (): void => {
    if (minPrice && maxPrice) {
      setPriceRange(`${minPrice} - ${maxPrice} €`);
    } else if (minPrice) {
      setPriceRange(`Min ${minPrice} €`);
    } else if (maxPrice) {
      setPriceRange(`Max ${maxPrice} €`);
    } else {
      setPriceRange("Price");
    }
    setShowPriceDropdown(false);
  };

  // Update isModelDisabled check
  const isModelDisabled = make === "Brand";

  const handleSearch = () => {
    // Create query parameters object
    const queryParams = new URLSearchParams();

    if (make !== "Brand") queryParams.append("make", make);
    if (model !== "Model") queryParams.append("model", model);
    if (year !== "Year") queryParams.append("year", year);
    if (vatDeduction) queryParams.append("vat", "true");

    if (showAdvanced) {
      if (mileageRange !== "Mileage") {
        if (minMileage) queryParams.append("minMileage", minMileage);
        if (maxMileage) queryParams.append("maxMileage", maxMileage);
      }
      if (priceRange !== "Price") {
        if (minPrice) queryParams.append("minPrice", minPrice);
        if (maxPrice) queryParams.append("maxPrice", maxPrice);
      }
    }

    // Navigate to /cars page with query parameters
    router.push(`/cars?${queryParams.toString()}`);
  };

  return (
    <>
      <div className="box-bottom-search background-card">
        {/* First row */}
        <div className="item-search">
          <label className="text-sm-bold neutral-500">Brand</label>
          <Dropdown
            className="dropdown"
            show={showMakeDropdown}
            onToggle={(isOpen: boolean) => setShowMakeDropdown(isOpen)}
          >
            <Dropdown.Toggle
              as="div"
              className="btn btn-secondary dropdown-toggle btn-dropdown-search"
              aria-expanded={showMakeDropdown}
            >
              <div className="d-flex align-items-center">
                <Car className="icon-16 me-2" />
                {make}
                <ChevronDown className="icon-16 ms-auto" />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="dropdown-menu">
              {brands?.map((brand: string) => (
                <li key={brand}>
                  <Link
                    className="dropdown-item"
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      handleMakeSelect(brand);
                    }}
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="item-search item-search-2">
          <label className="text-sm-bold neutral-500">Model</label>
          <Dropdown
            className="dropdown"
            show={showModelDropdown && !isModelDisabled}
            onToggle={(isOpen: boolean) =>
              setShowModelDropdown(isModelDisabled ? false : isOpen)
            }
          >
            <Dropdown.Toggle
              as="div"
              className={`btn btn-secondary dropdown-toggle btn-dropdown-search ${isModelDisabled ? "disabled" : ""
                }`}
              aria-expanded={showModelDropdown}
              onClick={() =>
                isModelDisabled
                  ? null
                  : setShowModelDropdown(!showModelDropdown)
              }
            >
              <div className="d-flex align-items-center">
                <Wrench className="icon-16 me-2" />
                {model}
                <ChevronDown className="icon-16 ms-auto" />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="dropdown-menu">
              {models?.map((modelOption: string) => (
                <li key={modelOption}>
                  <Link
                    className="dropdown-item"
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      handleModelSelect(modelOption);
                    }}
                  >
                    {modelOption}
                  </Link>
                </li>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="item-search">
          <label className="text-sm-bold neutral-500">Registration from</label>
          <Dropdown
            className="dropdown"
            show={showYearDropdown}
            onToggle={(isOpen: boolean) => setShowYearDropdown(isOpen)}
          >
            <Dropdown.Toggle
              as="div"
              className="btn btn-secondary dropdown-toggle btn-dropdown-search"
              aria-expanded={showYearDropdown}
            >
              <div className="d-flex align-items-center">
                <Calendar className="icon-16 me-2" />
                {year}
                <ChevronDown className="icon-16 ms-auto" />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu as="ul" className="dropdown-menu">
              {yearsData && Array.from(
                { length: yearsData.max_year - yearsData.min_year + 1 },
                (_, i) => yearsData.max_year - i
              ).map((yearOption) => (
                <li key={yearOption}>
                  <Link
                    className="dropdown-item"
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      handleYearSelect(yearOption.toString());
                    }}
                  >
                    {yearOption}
                  </Link>
                </li>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="item-search item-search-2">
          <div className="mt-4">
            <div
              className="d-flex align-items-center"
              style={{ paddingBottom: "10px" }}
            >
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={vatDeduction}
                  onChange={() => setVatDeduction(!vatDeduction)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span
                className={`vat-label text-sm-bold ${vatDeduction ? "neutral-800" : "neutral-500"
                  }`}
              >
                VAT
              </span>
            </div>
          </div>
        </div>

        {/* Show VAT and button in first row if not showing advanced options */}
        {!showAdvanced && (
          <>
            <div className="item-search item-search-4 main-button bd-none d-flex justify-content-end">
              <button
                className="btn btn-brand-2 text-nowrap search-button"
                onClick={handleSearch} // Updated onClick
              >
                <svg
                  className="me-2"
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z"
                    stroke="#FFFFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-white">Find a Vehicle</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Second row for advanced options */}
      {showAdvanced && (
        <div className="box-bottom-search background-card mt-3">
          <div className="item-search">
            <label className="text-sm-bold neutral-500">
              {isMobile ? "Kilometers" : "Kilometers range"}
            </label>
            <Dropdown
              className="dropdown"
              show={showMileageDropdown}
              onToggle={(isOpen: boolean) => setShowMileageDropdown(isOpen)}
            >
              <Dropdown.Toggle
                as="div"
                className="btn btn-secondary dropdown-toggle btn-dropdown-search"
                aria-expanded={showMileageDropdown}
              >
                <div className="d-flex align-items-center">
                  <Gauge className="icon-16 me-2" />
                  {mileageRange}
                  <ChevronDown className="icon-16 ms-auto" />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu
                as="ul"
                className="dropdown-menu p-3"
                style={{ minWidth: "300px" }}
              >
                <div className="mb-2">
                  <label className="form-label small">
                    Min kilometers (km)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min kilometers"
                    value={minMileage}
                    onChange={(e) => setMinMileage(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small">
                    Max kilometers (km)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max kilometers"
                    value={maxMileage}
                    onChange={(e) => setMaxMileage(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={applyMileageRange}
                  >
                    Apply
                  </button>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="item-search item-search-2">
            <label className="text-sm-bold neutral-500">
              {isMobile ? "Price" : "Price range"}
            </label>
            <Dropdown
              className="dropdown"
              show={showPriceDropdown}
              onToggle={(isOpen: boolean) => setShowPriceDropdown(isOpen)}
            >
              <Dropdown.Toggle
                as="div"
                className="btn btn-secondary dropdown-toggle btn-dropdown-search"
                aria-expanded={showPriceDropdown}
              >
                <div className="d-flex align-items-center">
                  <Euro className="icon-16 me-2" />
                  {priceRange}
                  <ChevronDown className="icon-16 ms-auto" />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu
                as="ul"
                className="dropdown-menu p-3"
                style={{ minWidth: "300px" }}
              >
                <div className="mb-2">
                  <label className="form-label small">Min price (€)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small">Max price (€)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={applyPriceRange}
                  >
                    Apply
                  </button>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="item-search item-search-4 bd-none d-flex justify-content-end">
            <button
              className="btn btn-brand-2 text-nowrap search-button"
              onClick={handleSearch} // Updated onClick
            >
              <svg
                className="me-2"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z"
                  stroke="#FFFFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-white">Find a Vehicle</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSearch;
