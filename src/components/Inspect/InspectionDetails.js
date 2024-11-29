"use client"
import React from "react";

const InspectionDetails = () => {
    return (
        <div className="history-legal-defects">

            <div className="container bg-[#FEF3F3]">

                <div className="content">
                    <h2 className="text-black">History and legal defects</h2>
                    <p>
                        To prevent unpleasant surprises after the purchase, we check
                        available European registers and databases for:
                    </p>
                    <ul>
                        <li>
                            <span>✔</span> Service history and accident records
                        </li>
                        <li>
                            <span>✔</span> Odometer rolled back
                        </li>
                        <li>
                            <span>✔</span> Stolen Vehicles Register
                        </li>
                        <li>
                            <span>✔</span> Unpaid leasing or other financial liabilities
                        </li>
                        <li>
                            <span>✔</span> Possibility of VAT deduction
                        </li>
                    </ul>
                </div>
                <div className="image">
                    <img
                        src="https://carvago.com/images/car-audit/process-3.webp"
                        className="h-[300px] w-[400px]"
                        alt="Man checking car history"
                    />
                </div>
            </div>
            <style jsx>{`
      .history-legal-defects {
        background-color: #FEF3F3;
        padding: 2rem;
        border-radius: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .container {
        display: flex;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }
      .content {
        flex: 1;
        padding: 1rem;
      }
      h2 {
        color: black;
        font-size: 4vw;
        margin-bottom: 1rem;
      }
      p {
        color: #333;
        margin-bottom: 1rem;
        line-height: 1.6;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        display: flex;
        align-items: center;
        font-size: 1rem;
        color: #333;
        margin-bottom: 0.5rem;
      }
      li span {
        color: #2ecc71;
        font-size: 1.2rem;
        margin-right: 0.5rem;
      }
      .image {
        flex: 1;
        padding: 1rem;
      }
      img {
        max-width: 100%;
        border-radius: 0.5rem;
      }
      @media (max-width: 768px) {
        .container {
          flex-direction: column;
        }
        .content,
        .image {
          width: 100%;
        }
      }
    `}</style>
        </div>
    );
};



export default InspectionDetails;
