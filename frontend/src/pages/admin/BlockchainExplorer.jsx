import { useState } from 'react';
import { useBlockchain } from '../../../hooks/useBlockchain';
import { formatTimestamp, truncateString } from '../../../utils/helpers';
import { usePagination } from '../../../hooks/usePagination';
import BlockDetailsModal from '../../../components/admin/BlockDetailsModal';

export default function BlockchainExplorer() {
  const { blockchain, getBlockByHash } = useBlockchain();
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    currentPage,
    paginatedData,
    totalPages,
    goToPage,
    itemsPerPage
  } = usePagination(blockchain.reverse(), 5);

  const openBlockDetails = (blockHash) => {
    const block = getBlockByHash(blockHash);
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Blockchain Explorer</h2>
        
        <div className="space-y-4">
          {paginatedData.map((block) => (
            <div 
              key={block.hash} 
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => openBlockDetails(block.hash)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Block #{block.index}</h3>
                  <p className="text-sm text-gray-500">
                    {formatTimestamp(block.timestamp)}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {block.data?.data_hash ? 'Data' : 'System'}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Hash:</span> {truncateString(block.hash, 12)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Previous:</span> {truncateString(block.previous_hash, 12)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Block Details Modal */}
        <BlockDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          block={selectedBlock}
        />
      </div>
    </div>
  );
}