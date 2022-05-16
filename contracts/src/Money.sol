//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IMoney.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Money is ERC20Permit, Ownable, IMoney {
	address public printer;

	constructor() ERC20Permit('Money') ERC20('Money', 'MNY') {}

	/// @notice Sets the contract that is able to print/burn money
	/// @dev Only executable by contract owner
	/// @param _printer The new printer/burner
	function setPrinter(address _printer) external onlyOwner {
		emit PrinterChange(_printer);
		printer = _printer;
	}

	/// @inheritdoc IMoney
	function print(address to, uint256 amount) external {
		require(msg.sender == printer, 'Not a printer');
		_mint(to, amount);
	}

	/// @inheritdoc IMoney
	function burn(address from, uint256 amount) external {
		require(msg.sender == printer, 'Not a printer');
		_spendAllowance(from, msg.sender, amount);
		_burn(from, amount);
	}

	/// @notice Emitted when a a new money printer/burner is set
	/// @param newPrinter The new money printer
	event PrinterChange(address newPrinter);
}
