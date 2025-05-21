import TuneIcon from '@mui/icons-material/Tune'

interface ClientSearchAndFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

const ClientSearchAndFilters = ({
  searchQuery,
  onSearchChange,
}: ClientSearchAndFiltersProps) => {
  return (
    <div className="flex justify-between items-center w-full p-4 bg-white border border-gray-200 rounded-md">
      <div className="relative flex-grow mr-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>{' '}
      <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50">
        <TuneIcon className="w-5 h-5 mr-2" />
        Filters
      </button>
    </div>
  )
}

export default ClientSearchAndFilters
