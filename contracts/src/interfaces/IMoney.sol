// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol';

interface IMoney is IERC20, IERC20Permit {
	/// @notice Mints a given amount of Money to an account
	/// @param to The receiver of the Money
	/// @param amount The amount of Money that will be minted
	function print(address to, uint256 amount) external;

	/// @notice Burns a given amount of Money from an account
	/// If the receiver approved the transfer/burn
	/// @param from The account the money will be burned from
	/// @param amount The amount of Money that will be burned
	function burn(address from, uint256 amount) external;
}
