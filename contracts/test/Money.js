const {ethers} = require('hardhat');

const {use, expect} = require('chai');
const {solidity} = require('ethereum-waffle');

const {testFixture} = require('./shared/fixtures.js');

use(solidity);

describe('Money', function () {
	let owner, alice, bob, eve;
	let Money, contracts;

	let testData = {
		transferAmount: ethers.utils.parseEther('100')
	};

	beforeEach(async function () {
		[owner, alice, bob, eve] = await ethers.getSigners();
		({Money, ...contracts} = await testFixture([owner]));
	});

	describe('owner', function () {
		it('Should return the correct owner', async function () {
			expect(await Money.owner()).to.equal(owner.address);
		});
	});

	describe('setPrinter', function () {
		it('Should set a new printer and emit an event if called by owner', async function () {
			await expect(Money.setPrinter(alice.address))
				.to.emit(Money, 'PrinterChange')
				.withArgs(alice.address);
			expect(await Money.printer()).to.equal(alice.address);
		});

		it('Should not revert if called by non-owner', async function () {
			await expect(Money.connect(eve).setPrinter(eve.address)).to.revertedWith(
				'Ownable: caller is not the owner'
			);
		});
	});

	describe('print', function () {
		it('Should transfer Money to a given receiver and emit an event if called by printer', async function () {
			await Money.setPrinter(owner.address);

			await expect(() =>
				Money.print(alice.address, testData.transferAmount)
			).to.changeTokenBalances(Money, [owner, alice], [0, testData.transferAmount]);

			expect(await Money.totalSupply()).to.equal(testData.transferAmount);
		});

		it('Should revert and net transfer any Money if called by non-printer', async function () {
			await expect(
				Money.connect(eve).print(eve.address, ethers.utils.parseEther('100'))
			).to.revertedWith('Not a printer');

			expect(await Money.totalSupply()).to.equal(0);
		});
	});

	describe('burn', function () {
		it('Should burn Money from a given account and emit an event if amount is approved and called by printer', async function () {
			await Money.setPrinter(owner.address);
			await Money.print(alice.address, testData.transferAmount);

			await Money.connect(alice).approve(owner.address, testData.transferAmount);

			await expect(() =>
				Money.burn(alice.address, testData.transferAmount)
			).to.changeTokenBalances(Money, [owner, alice], [0, testData.transferAmount.mul(-1)]);

			expect(await Money.totalSupply()).to.equal(0);
		});

		it('Should revert and not burn Money if amount is not approved and called by printer', async function () {
			await Money.setPrinter(owner.address);
			await Money.print(alice.address, testData.transferAmount);

			await expect(Money.burn(alice.address, testData.transferAmount)).to.be.revertedWith(
				'ERC20: insufficient allowance'
			);
			expect(await Money.totalSupply()).to.equal(testData.transferAmount);
		});

		it('Should revert and not burn Money if called by non-printer', async function () {
			await Money.setPrinter(owner.address);
			await Money.print(alice.address, testData.transferAmount);

			await expect(
				Money.connect(eve).burn(alice.address, testData.transferAmount)
			).to.revertedWith('Not a printer');

			expect(await Money.totalSupply()).to.equal(testData.transferAmount);
		});
	});
});
