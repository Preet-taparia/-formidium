import React from 'react';
import PropTypes from 'prop-types';

const UserCard = ({ user, handleMakeInvoiceClick }) => {
  return (
    <div className="max-w-xs rounded-3xl overflow-hidden shadow-lg bg-white m-4" style={{ borderColor: '#aa2bff' }}>
      <div className="bg-purple-900 text-white text-center py-4">
        <h2 className="text-2xl font-semibold">User Information</h2>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-x-4 overflow-y-auto max-h-96"> {/* Grid for two columns with scrollable content */}
        <div className="mb-4">
          <span className="block text-gray-700 font-bold">Invoice Category:</span>
          <span className="block text-gray-900 overflow-hidden">{user.invoiceCategory}</span>
        </div>
        <div className="mb-4">
          <span className="block text-gray-700 font-bold">Payment Due:</span>
          <span className="block text-gray-900 overflow-hidden">{user.paymentDue}</span>
        </div>
        <div className="mb-4">
          <span className="block text-gray-700 font-bold">Company Name:</span>
          <span className="block text-gray-900 overflow-hidden">{user.companyName}</span>
        </div>
        <div className="mb-4">
          <span className="block text-gray-700 font-bold">Recipient Address:</span>
          <span className="block text-gray-900 overflow-hidden">{user.recipientAddress}</span>
        </div>
        <div className="mb-4">
          <span className="block text-gray-700 font-bold">Cryptocurrency:</span>
          <span className="block text-gray-900 overflow-hidden">{user.cryptocurrency}</span>
        </div>
        <div className="mb-4">
          <span className="block text-gray-700 font-bold">Due Date:</span>
          <span className="block text-gray-900 overflow-hidden">{user.dueDate}</span>
        </div>
        <div className="mb-4">
          <span className="block text-gray-700 font-bold">Description:</span>
          <span className="block text-gray-900 overflow-hidden">{user.description}</span>
        </div>
        <div className="mb-4">
          <span className="block text-gray-700 font-bold">Company Email:</span>
          <span className="block text-gray-900 overflow-hidden">{user.companyEmail}</span>
        </div>
      </div>
      <div className="flex justify-center mb-6"> {/* Adjusted margin-top to 6 for more space */}
        <button
          className="text-white font-bold py-2 px-4 rounded-full border hover:border-black hover:bg-gray-200 hover:text-gray-900 transition duration-300 ease-in-out"
          onClick={() => handleMakeInvoiceClick(user)}
        >
          Make Invoice
        </button>
      </div>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  handleMakeInvoiceClick: PropTypes.func.isRequired,
};

export default UserCard;
