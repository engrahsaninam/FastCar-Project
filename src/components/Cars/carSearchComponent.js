// import React, { useState, useEffect } from 'react';
// import { Search, X } from 'lucide-react';

// const SearchBar = ({ onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isFocused, setIsFocused] = useState(false);
  

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     onSearch(value);
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//     onSearch('');
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 py-4">
//       <div 
//         className={`relative flex items-center w-full h-12 rounded-lg border ${
//           isFocused ? 'border-red-400 shadow-sm' : 'border-gray-200'
//         } bg-white transition-all duration-200`}
//       >
//         <div className="grid place-items-center h-full w-12">
//           <Search className={`w-5 h-5 ${isFocused ? 'text-red-400' : 'text-gray-400'}`} />
//         </div>

//         <input
//           className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 placeholder:text-gray-400"
//           type="text"
//           placeholder="Search by car name, features, or specifications..."
//           value={searchTerm}
//           onChange={(e) => handleSearch(e.target.value)}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//         />

//         {searchTerm && (
//           <button
//             onClick={clearSearch}
//             className="absolute right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-4 h-4 text-gray-400" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchBar;