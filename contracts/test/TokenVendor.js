const {ethers} = require('hardhat');

const {use, expect} = require('chai');
const {solidity} = require('ethereum-waffle');

const {testFixture} = require('./shared/fixtures.js');
const {signPermit} = require('./shared/helper.js');

use(solidity);

describe('TokenVendor', function () {
	let owner, alice, bob, eve;
	let Money, TokenVendor;

	let testData = {
		moniesPerEth: 0,
		amountOfTokens: 0,
		ethAmount: ethers.utils.parseEther('1'),
		validDeadline: ethers.constants.MaxUint256,
		invalidDeadline: Math.floor(new Date('2000/01/01').getTime() / 1000)
	};

	beforeEach(async function () {
		[owner, alice, bob, eve] = await ethers.getSigners();
		({Money, TokenVendor} = await testFixture([owner]));

		testData.moniesPerEth = await TokenVendor.moniesPerEth();
		testData.amountOfTokens = testData.ethAmount.mul(testData.moniesPerEth);
	});

	describe('owner', function () {
		it('Should return the correct owner', async function () {
			expect(await TokenVendor.owner()).to.equal(owner.address);
		});
	});

	describe('buyToken', function () {
		it('Should exchange the correct amount of tokens for ether and emit an event', async function () {
			await expect(TokenVendor.connect(alice).buy({value: testData.ethAmount}))
				.to.emit(TokenVendor, 'Bought')
				.withArgs(alice.address, testData.amountOfTokens);

			expect(await Money.balanceOf(alice.address)).to.equal(testData.amountOfTokens);
		});
		it('Should revert if an invalid amount of tokens is given', async function () {
			await expect(TokenVendor.connect(alice).buy({value: 0})).to.be.revertedWith(
				'Invalid Amount'
			);
		});
	});

	describe('sellToken', function () {
		it('Should exchange the correct amount of ether for tokens and emit an event', async function () {
			await TokenVendor.connect(alice).buy({value: testData.ethAmount});
			await Money.connect(alice).approve(TokenVendor.address, testData.amountOfTokens);

			await expect(await TokenVendor.connect(alice).sell(testData.amountOfTokens))
				.to.emit(TokenVendor, 'Sold')
				.withArgs(alice.address, testData.amountOfTokens)
				.to.changeEtherBalances(
					[TokenVendor, alice],
					[testData.ethAmount.mul(-1), testData.ethAmount]
				);

			expect(await Money.balanceOf(alice.address)).to.equal(0);
		});

		it('Should revert if an invalid amount of tokens is given', async function () {
			await expect(TokenVendor.connect(alice).sell(0)).to.be.revertedWith('Invalid Amount');
		});
		it('Should revert if not enough ethers are available', async function () {
			await TokenVendor.connect(alice).buy({value: testData.ethAmount});
			await Money.connect(alice).approve(TokenVendor.address, testData.amountOfTokens);

			await TokenVendor.withdraw(testData.ethAmount);

			await expect(
				TokenVendor.connect(alice).sell(testData.amountOfTokens)
			).to.be.revertedWith('Not enough Ether available');
		});
		it('Should revert if the token holder did not approve the exchange', async function () {
			await TokenVendor.connect(alice).buy({value: testData.ethAmount});

			await expect(
				TokenVendor.connect(alice).sell(testData.amountOfTokens)
			).to.be.revertedWith('ERC20: insufficient allowance');
		});
	});

	describe('sellTokenWithPermit', function () {
		it('Should exchange the correct amount of ether for tokens and emit an event', async function () {
			await TokenVendor.connect(alice).buy({value: testData.ethAmount});

			const permit = await signPermit(
				Money,
				alice,
				TokenVendor.address,
				testData.amountOfTokens,
				testData.validDeadline
			);

			await expect(
				TokenVendor.connect(alice).sellWithPermit(
					testData.amountOfTokens,
					testData.validDeadline,
					permit.v,
					permit.r,
					permit.s
				)
			)
				.to.emit(TokenVendor, 'Sold')
				.withArgs(alice.address, testData.amountOfTokens);

			expect(await Money.balanceOf(alice.address)).to.equal(0);
		});
		it('Should revert if an invalid permit was given', async function () {
			await TokenVendor.connect(alice).buy({value: testData.ethAmount});

			const permit = await signPermit(
				Money,
				alice,
				TokenVendor.address,
				testData.amountOfTokens,
				testData.invalidDeadline
			);

			await expect(
				TokenVendor.connect(alice).sellWithPermit(
					testData.amountOfTokens,
					testData.validDeadline,
					permit.v,
					permit.r,
					permit.s
				)
			).to.be.revertedWith('ERC20Permit: invalid signature');
		});
	});

	describe('withdraw', function () {
		it('Should return the requested amount of ethers if available and called by owner', async function () {
			await TokenVendor.connect(alice).buy({value: testData.ethAmount});

			await expect(await TokenVendor.withdraw(testData.ethAmount)).to.changeEtherBalance(
				owner,
				testData.ethAmount
			);
		});
		it('Should revert if withdrawing more ethers than available', async function () {
			await TokenVendor.connect(alice).buy({value: testData.ethAmount});

			await expect(TokenVendor.withdraw(testData.ethAmount.mul(2))).to.be.revertedWith(
				'Withdrawing more than available'
			);
		});
		it('Should revert if withdrawal is done by somebody else than owner', async function () {
			await TokenVendor.connect(alice).buy({value: testData.ethAmount});

			await expect(TokenVendor.connect(eve).withdraw(testData.ethAmount)).to.be.revertedWith(
				'Ownable: caller is not the owner'
			);
		});
	});
});
