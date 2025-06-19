"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Updated import for Next.js 13+ and useSearchParams
import React, { useState, useEffect, useCallback } from "react";
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
import { useTranslation } from 'react-i18next';

// Define TypeScript interfaces
interface ModelOptionsType {
  [key: string]: string[];
}

// Define HeroSearch component props interface
interface HeroSearchProps {
  showAdvanced?: boolean;
}

const HeroSearch: React.FC<HeroSearchProps> = ({ showAdvanced = false }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Create a function to update URL and trigger search
  const updateSearch = useCallback((params: Record<string, string>) => {
    if (!searchParams) return;

    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Update or remove params
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "Brand" && value !== "Model" && value !== "Year") {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    // Reset page to 1 when filters change
    current.set("page", "1");

    // Create the new URL
    const search = current.toString();
    const query = search ? `?${search}` : "";

    // Update the URL without full page reload
    router.push(`/deals${query}`, { scroll: false });
  }, [router, searchParams]);

  // Update handlers to use updateSearch
  const handleMakeSelect = (selectedMake: string): void => {
    setMake(selectedMake);
    setModel("Model"); // Reset model when make changes
    setShowMakeDropdown(false);
    updateSearch({ brand: selectedMake });
  };

  const handleModelSelect = (selectedModel: string): void => {
    setModel(selectedModel);
    setShowModelDropdown(false);
    updateSearch({ model: selectedModel });
  };

  const handleYearSelect = (selectedYear: string): void => {
    setYear(selectedYear);
    setShowYearDropdown(false);
    updateSearch({ year: selectedYear });
  };

  // Update VAT handler
  const handleVatChange = (checked: boolean) => {
    setVatDeduction(checked);
    updateSearch({ vat: checked ? "true" : "" });
  };

  // Update mileage range handler
  const applyMileageRange = (): void => {
    if (minMileage && maxMileage) {
      setMileageRange(`${minMileage} - ${maxMileage} km`);
      updateSearch({
        minMileage,
        maxMileage
      });
    } else if (minMileage) {
      setMileageRange(`Min ${minMileage} km`);
      updateSearch({ minMileage });
    } else if (maxMileage) {
      setMileageRange(`Max ${maxMileage} km`);
      updateSearch({ maxMileage });
    } else {
      setMileageRange("Kilometers");
      updateSearch({ minMileage: "", maxMileage: "" });
    }
    setShowMileageDropdown(false);
  };

  // Update price range handler
  const applyPriceRange = (): void => {
    if (minPrice && maxPrice) {
      setPriceRange(`${minPrice} - ${maxPrice} €`);
      updateSearch({
        minPrice,
        maxPrice
      });
    } else if (minPrice) {
      setPriceRange(`Min ${minPrice} €`);
      updateSearch({ minPrice });
    } else if (maxPrice) {
      setPriceRange(`Max ${maxPrice} €`);
      updateSearch({ maxPrice });
    } else {
      setPriceRange("Price");
      updateSearch({ minPrice: "", maxPrice: "" });
    }
    setShowPriceDropdown(false);
  };

  // Initialize state from URL params on mount
  useEffect(() => {
    if (!searchParams) return;

    const brand = searchParams.get("brand");
    // const page = searchParams.get("page");
    const model = searchParams.get("model");
    const year = searchParams.get("year");
    const vat = searchParams.get("vat");
    const minMileage = searchParams.get("minMileage");
    const maxMileage = searchParams.get("maxMileage");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (brand) setMake(brand);
    if (model) setModel(model);
    if (year) setYear(year);
    if (vat) setVatDeduction(vat === "true");
    if (minMileage || maxMileage) {
      setMinMileage(minMileage || "");
      setMaxMileage(maxMileage || "");
      setMileageRange(
        minMileage && maxMileage
          ? `${minMileage} - ${maxMileage} km`
          : minMileage
            ? `Min ${minMileage} km`
            : `Max ${maxMileage} km`
      );
    }
    if (minPrice || maxPrice) {
      setMinPrice(minPrice || "");
      setMaxPrice(maxPrice || "");
      setPriceRange(
        minPrice && maxPrice
          ? `${minPrice} - ${maxPrice} €`
          : minPrice
            ? `Min ${minPrice} €`
            : `Max ${maxPrice} €`
      );
    }
  }, [searchParams]);

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
          <label className="text-sm-bold neutral-500">{t('search.brand')}</label>
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
          <label className="text-sm-bold neutral-500">{t('search.model')}</label>
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
          <label className="text-sm-bold neutral-500">{t('search.registrationFrom')}</label>
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
                  onChange={(e) => handleVatChange(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span
                className={`vat-label text-sm-bold ${vatDeduction ? "neutral-800" : "neutral-500"
                  }`}
              >
                {t('search.vat')}
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
                <span className="text-white">{t('search.findVehicle')}</span>
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
              {isMobile ? t('search.kilometers') : t('search.kilometersRange')}
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
                    {t('search.minKilometers')}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder={t('search.minKilometers')}
                    value={minMileage}
                    onChange={(e) => setMinMileage(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small">
                    {t('search.maxKilometers')}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder={t('search.maxKilometers')}
                    value={maxMileage}
                    onChange={(e) => setMaxMileage(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={applyMileageRange}
                  >
                    {t('search.apply')}
                  </button>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="item-search item-search-2">
            <label className="text-sm-bold neutral-500">
              {isMobile ? t('search.price') : t('search.priceRange')}
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
                  <label className="form-label small">{t('search.minPrice')}</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder={t('search.minPrice')}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small">{t('search.maxPrice')}</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder={t('search.maxPrice')}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={applyPriceRange}
                  >
                    {t('search.apply')}
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
              <span className="text-white">{t('search.findVehicle')}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSearch;
