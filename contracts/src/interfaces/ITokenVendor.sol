// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITokenVendor {
	/// @notice Emitted when a user buys tokens from the TokenVendor
	/// @param buyer The user who bought the tokens
	/// @param amount The amount of tokens bought
	event Bought(address indexed buyer, uint256 amount);

	/// @notice Emitted when a user sells tokens to the TokenVendor
	/// @param seller The user who sold the tokens
	/// @param amount The amount of tokens sold
	event Sold(address indexed seller, uint256 amount);

	/// @notice Amount of Money exchanged for one Ether
	/// @return Amount of tokens per eth
	function moniesPerEth() external view returns (uint256);

	/// @notice Transfers newly minted money to caller based
	/// on amount of sent ether
	/// @dev Emits a Bought and Transfer event
	function buy() external payable;

	/// @notice Transfers ether to the message sender
	/// calculated based on the given amount of sent money
	/// @dev Emits a Sold and Transfer event.
	/// Sent money will be burned
	function sell(uint256 amount) external;

	/// @notice Transfers ether to the message sender
	/// calculated based on the given amount of sent money
	/// @dev Same as `sellTokens` with additional, with additional
	/// signature parameters which which allow the approval and
	/// transfer of Money in a single Transaction using EIP-2612 Permits
	/// Emits a Sold and Transfer event.
	/// @param tokenAmount Amount of tokens that will be burned by the TokenVendor
	/// @param deadline timestamp until when the given signature will be valid
	/// @param v The parity of the y co-ordinate of r of the signature
	/// @param r The x co-ordinate of the r value of the signature
	/// @param s The x co-ordinate of the s value of the signature
	function sellWithPermit(
		uint256 tokenAmount,
		uint256 deadline,
		uint8 v,
		bytes32 r,
		bytes32 s
	) external;

	/// @notice Transfers given amount of ether to the contract owner
	/// @dev Only executable by contract owner
	/// @param amount Amount of ether that should be transferred
	function withdraw(uint256 amount) external;
}
