//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/ITokenVendor.sol';
import './interfaces/IMoney.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract TokenVendor is ITokenVendor, Ownable {
	/// @notice Address of the token contract used by the TokenVendor
	/// @return The tokens address
	IMoney public money;

	/// @inheritdoc ITokenVendor
	uint256 public override moniesPerEth = 100;

	constructor(address tokenAddress) {
		money = IMoney(tokenAddress);
	}

	/// @inheritdoc ITokenVendor
	function buy() external payable override {
		uint256 tokenAmount = msg.value * moniesPerEth;
		require(tokenAmount > 0, 'Invalid Amount');

		emit Bought(msg.sender, tokenAmount);
		money.print(msg.sender, tokenAmount);
	}

	/// @inheritdoc ITokenVendor
	function sell(uint256 tokenAmount) public override {
		require(tokenAmount > 0, 'Invalid Amount');

		uint256 amountOfEth = tokenAmount / moniesPerEth;
		require(address(this).balance >= amountOfEth, 'Not enough Ether available');

		emit Sold(msg.sender, tokenAmount);
		money.burn(msg.sender, tokenAmount);

		// slither-disable-next-line arbitrary-send
		(bool sent, ) = msg.sender.call{value: amountOfEth}('');
		require(sent, 'Failed to send Ether');
	}

	/// @inheritdoc ITokenVendor

	function sellWithPermit(
		uint256 tokenAmount,
		uint256 deadline,
		uint8 v,
		bytes32 r,
		bytes32 s
	) external override {
		money.permit(msg.sender, address(this), tokenAmount, deadline, v, r, s);
		// slither-disable-next-line reentrancy-events
		sell(tokenAmount);
	}

	/// @inheritdoc ITokenVendor

	function withdraw(uint256 amount) external override onlyOwner {
		require(amount <= address(this).balance, 'Withdrawing more than available');

		(bool sent, ) = owner().call{value: amount}('');
		require(sent, 'Failed to send Ether');
	}
}
