# TokenVendor









## Methods

### buy

```solidity
function buy() external payable
```

Transfers newly minted money to caller based on amount of sent ether

*Emits a Bought and Transfer event*


### money

```solidity
function money() external view returns (contract IMoney)
```

Address of the token contract used by the TokenVendor




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IMoney | The tokens address |

### moniesPerEth

```solidity
function moniesPerEth() external view returns (uint256)
```

Amount of Money exchanged for one Ether




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | Amount of tokens per eth |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### sell

```solidity
function sell(uint256 tokenAmount) external nonpayable
```

Transfers ether to the message sender calculated based on the given amount of sent money

*Emits a Sold and Transfer event. Sent money will be burned*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAmount | uint256 | undefined |

### sellWithPermit

```solidity
function sellWithPermit(uint256 tokenAmount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external nonpayable
```

Transfers ether to the message sender calculated based on the given amount of sent money

*Same as `sellTokens` with additional, with additional signature parameters which which allow the approval and transfer of Money in a single Transaction using EIP-2612 Permits Emits a Sold and Transfer event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAmount | uint256 | Amount of tokens that will be burned by the TokenVendor |
| deadline | uint256 | timestamp until when the given signature will be valid |
| v | uint8 | The parity of the y co-ordinate of r of the signature |
| r | bytes32 | The x co-ordinate of the r value of the signature |
| s | bytes32 | The x co-ordinate of the s value of the signature |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### withdraw

```solidity
function withdraw(uint256 amount) external nonpayable
```

Transfers given amount of ether to the contract owner

*Only executable by contract owner*

#### Parameters

| Name | Type | Description |
|---|---|---|
| amount | uint256 | Amount of ether that should be transferred |



## Events

### Bought

```solidity
event Bought(address indexed buyer, uint256 amount)
```

Emitted when a user buys tokens from the TokenVendor



#### Parameters

| Name | Type | Description |
|---|---|---|
| buyer `indexed` | address | undefined |
| amount  | uint256 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### Sold

```solidity
event Sold(address indexed seller, uint256 amount)
```

Emitted when a user sells tokens to the TokenVendor



#### Parameters

| Name | Type | Description |
|---|---|---|
| seller `indexed` | address | undefined |
| amount  | uint256 | undefined |



